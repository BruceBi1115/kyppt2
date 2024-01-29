import tempfile
from threading import Thread
import pandas as pd
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
from .forms import UploadFileForm
from .models import Entity, Individual, Location
import uuid
from django.core.exceptions import FieldDoesNotExist, ValidationError
from django.core.cache import cache


def search(request):
    query = request.GET.get('query', '')
    search_type = request.GET.get('type', '')
    print(query)
    print(search_type)

    results = []
    if search_type == 'Entity':
        results = list(Entity.objects.filter(entity_name__icontains=query).values())
    elif search_type == 'Individual':
        results = list(Individual.objects.filter(individual_name__icontains=query).values())
    elif search_type == 'Location':
        location_results = list(Location.objects.filter(country__icontains=query).values())
        results = [result for result in location_results if result['kypp_decision'] != 'Not included']

    print("Query:", query, "Type:", search_type, "Results:", results)
    return JsonResponse({'results': results})


@csrf_exempt
@require_POST
def upload_and_process(request):
    form = UploadFileForm(request.POST, request.FILES)

    if form.is_valid():
        session_uuid = request.POST.get('session_id', str(uuid.uuid4()))

        if 'entity_file' in request.FILES:
            file = request.FILES['entity_file']
            with tempfile.NamedTemporaryFile(delete=False, suffix=".xlsx") as temp_file:
                for chunk in file.chunks():
                    temp_file.write(chunk)
                file_path = temp_file.name

            # Start the thread with the file path
            thread = Thread(target=process_file_thread, args=(file_path, Entity, session_uuid))
            thread.start()

        if 'individual_file' in request.FILES:
            file = request.FILES['individual_file']
            with tempfile.NamedTemporaryFile(delete=False, suffix=".xlsx") as temp_file:
                for chunk in file.chunks():
                    temp_file.write(chunk)
                file_path = temp_file.name

            # Start the thread with the file path
            thread = Thread(target=process_file_thread, args=(file_path, Individual, session_uuid))
            thread.start()

        if 'location_file' in request.FILES:
            file = request.FILES['location_file']
            with tempfile.NamedTemporaryFile(delete=False, suffix=".xlsx") as temp_file:
                for chunk in file.chunks():
                    temp_file.write(chunk)
                file_path = temp_file.name

            # Start the thread with the file path
            thread = Thread(target=process_file_thread, args=(file_path, Location, session_uuid))
            thread.start()

        return JsonResponse({'status': 'success', 'session_id': session_uuid})
    else:
        return JsonResponse({'status': 'failed', 'errors': form.errors})


def process_file_thread(file_path, model, session_uuid):
    process_file(file_path, model, session_uuid)


def clear_database():
    Entity.objects.all().delete()
    Individual.objects.all().delete()
    Location.objects.all().delete()
    print("Database cleared.")


def is_na(value):
    return pd.isna(value)


def process_file(file_path, model, session_uuid):
    print("file in processing " + str(model))
    cache_key = f"upload_progress_{session_uuid}"
    print("created cache_key is " + str(cache_key))
    df = pd.read_excel(file_path, engine='openpyxl')
    # Define the field mapping based on the model
    field_mapping = {
        Entity: {
            'Entity': 'entity_name',
            'Aliases/Subsidiaries': 'aliases',
            'Date of listing/update': 'date_of_listing',
            'Type (entity or individual)': 'type',
            'Reason for listing': 'reason_for_listing',
            'Source': 'source',
            'Location_1': 'location_1',
            'Location_2': 'location_2',
            'Location_3': 'location_3',
            'Location_4': 'location_4',
        },
        Individual: {
            'Individual': 'individual_name',
            'Aliases': 'aliases',
            'Date of listing/update': 'date_of_listing',
            'Type (entity or individual)': 'type',
            'Reason for listing': 'reason_for_listing',
            'Source': 'source',
            'Location_1': 'location_1',
            'Location_2': 'location_2',
            'Location_3': 'location_3',
            'Location_4': 'location_4',
        },
        Location: {
            'Country': 'country',
            'KYPPTool Decision': 'kypp_decision',
            'Sanctioned Regime': 'sanctioned_regime',
        },
    }
    # Map the model to its unique identifier field name
    unique_identifier_field = {
        Entity: 'entity_name',
        Individual: 'individual_name',
        Location: 'country'
    }[model]

    # Determine the total number of rows for progress tracking
    total_rows = len(df)
    cache.set(cache_key, {'processed': 0, 'total': total_rows}, timeout=3600)

    # Ensure the unique identifier field is in the DataFrame
    excel_unique_identifier = next(
        (key for key, value in field_mapping[model].items() if value == unique_identifier_field), None)
    if excel_unique_identifier is None or excel_unique_identifier not in df.columns:
        raise KeyError(f"The unique identifier '{unique_identifier_field}' column is not found in the Excel file.")

    # Read all existing unique identifiers from the database
    existing_identifiers = set(model.objects.values_list(unique_identifier_field, flat=True))
    # Process the Excel file
    for index, row in df.iterrows():
        # Get the unique identifier from the Excel file
        if is_na(row[excel_unique_identifier]):
            print(f"Skipping row {index + 2}: missing unique identifier.")
            continue
        unique_identifier = row[excel_unique_identifier]

        # Remove the unique identifier from the set as it's found in the Excel file
        existing_identifiers.discard(unique_identifier)

        # Prepare the data for this row
        row_data = {model_field: row[excel_field] if not is_na(row[excel_field]) else None for excel_field, model_field
                    in field_mapping[model].items()}

        # Filter for the existing record in the database
        existing_record = model.objects.filter(**{unique_identifier_field: unique_identifier}).first()
        cache.set(cache_key, {'processed': index + 1, 'total': total_rows}, timeout=3600)
        # Update or create the record
        if existing_record:
            # Update only if there are changes
            update_needed = any(
                getattr(existing_record, model_field) != value for model_field, value in row_data.items())
            if update_needed:
                for model_field, value in row_data.items():
                    setattr(existing_record, model_field, value)
                existing_record.save()
                print(f"Updated record for {unique_identifier} at row {index + 2}")
        else:
            try:
                with transaction.atomic():
                    model.objects.create(**row_data)
                    print(f"Created new record for {unique_identifier} at row {index + 2}")
            except (ValidationError, FieldDoesNotExist) as e:
                print(f"Error processing record '{unique_identifier}' at row {index + 2}: {e}")

        # test_cache(session_uuid)
        # progress = {'processed': index + 1, 'total': total_rows}
        # print(f"Processing progress: {progress}")  # Debug print
    # Delete records that are in the database but not in the Excel file
    for identifier in existing_identifiers:
        model.objects.filter(**{unique_identifier_field: identifier}).delete()
        print(f"Deleted record for {identifier}")


def test_cache(session_uuid):
    cache_key = f"upload_progress_{session_uuid}"
    progress = cache.get(cache_key, None)
    print(f"Test processing progress: {progress}")  # Debug print


def get_upload_progress(request):
    session_uuid = request.GET.get('session_id')
    cache_key = f"upload_progress_{session_uuid}"
    progress = cache.get(cache_key, None)
    if progress:
        # if progress.get('processed') == progress.get('total'):
        #     cache.delete(cache_key)
        return JsonResponse(progress)
    else:
        # Return a default response if no progress is found
        return JsonResponse({'processed': 0, 'total': 1})
