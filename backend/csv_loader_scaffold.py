import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

django.setup()

import pandas as pd
from Database.models import Entity
from Database.models import Location
from Database.models import Individual

def set_to_none_if_empty(data):
    if pd.isna(data):
        return None
    else:
        return data

# TODO: Change the file location to your own file location
entity_df = pd.read_excel()

for index, row in entity_df.iterrows():
    entity_name = row['Entity']
    aliases=row['Aliases/Subsidiaries']
    type=row['Type (entity or individual)']
    reason_for_listing=row['Reason for listing']
    source=row['Source']
    location_1=row['Location_1']
    location_2=row['Location_2']
    location_3=row['Location_3']
    location_4=row['Location_4']
    date_of_listing = pd.to_datetime(row['Date of listing/update'], errors='coerce')

    entity = Entity(
        entity_name=set_to_none_if_empty(entity_name),
        aliases=set_to_none_if_empty(aliases),
        date_of_listing=set_to_none_if_empty(date_of_listing),
        type=set_to_none_if_empty(type),
        reason_for_listing=set_to_none_if_empty(reason_for_listing),
        source=set_to_none_if_empty(source),
        location_1=set_to_none_if_empty(location_1),
        location_2=set_to_none_if_empty(location_2),
        location_3=set_to_none_if_empty(location_3),
        location_4=set_to_none_if_empty(location_4),
    )
    entity.save()

# TODO: Change the file location to your own file location
location_df = pd.read_excel()

for index, row in location_df.iterrows():
    country=row['Country']
    kypp_decision=row['KYPPTool Decision']
    sanctioned_regime=row['Sanctioned Regime']

    location = Location(
        country=set_to_none_if_empty(country),
        kypp_decision=set_to_none_if_empty(kypp_decision),
        sanctioned_regime=set_to_none_if_empty(sanctioned_regime),
    )
    location.save()

# TODO: Change the file location to your own file location
individual_df = pd.read_excel()

for index, row in individual_df.iterrows():
    individual_name=row['Individual']
    aliases=row['Aliases']
    date_of_listing=date_of_listing,
    type=row['Type (entity or individual)']
    reason_for_listing=row['Reason for listing']
    source=row['Source']
    location_1=row['Location_1']
    location_2=row['Location_2']
    location_3=row['Location_3']
    location_4=row['Location_4']
    date_of_listing = pd.to_datetime(row['Date of listing/update'], errors='coerce')

    individual = Individual(
        individual_name=set_to_none_if_empty(individual_name),
        aliases=set_to_none_if_empty(aliases),
        date_of_listing=set_to_none_if_empty(date_of_listing),
        type=set_to_none_if_empty(type),
        reason_for_listing=set_to_none_if_empty(reason_for_listing),
        source=set_to_none_if_empty(source),
        location_1=set_to_none_if_empty(location_1),
        location_2=set_to_none_if_empty(location_2),
        location_3=set_to_none_if_empty(location_3),
        location_4=set_to_none_if_empty(location_4),
    )
    individual.save()
