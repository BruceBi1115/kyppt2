from django import forms

class UploadFileForm(forms.Form):
    entity_file = forms.FileField(required=False)
    individual_file = forms.FileField(required=False)
    location_file = forms.FileField(required=False)
