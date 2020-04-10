from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

from . import models

class IncidentForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        super(IncidentForm, self).__init__(*args, **kwargs)
        for key in ('incidentType', 'incidentTime', 'incidentDate',
                    'longitude', 'x', 'y', 'timeSubmitted',
                    'latitude',):
            self.fields[key].required = True

        for key in ("details", "photoPath"):
            self.fields[key].required = False

    class Meta:
        model = models.Incident
        fields = ('incidentType', 'incidentTime', 'incidentDate',
                  'longitude', 'x', 'y', 'details', 'photoPath',
                  'timeSubmitted', 'latitude')#, 'userID',)

class PatrolIncidentForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        super(PatrolIncidentForm, self).__init__(*args, **kwargs)
        for key in ('incidentType', 'incidentTime', 'incidentDate',
                    'longitude', 'x', 'y', 'timeSubmitted',
                    'latitude', 'trackID'):
            self.fields[key].required = True

        for key in ("details", "photoPath"):
            self.fields[key].required = False

    class Meta:
        model = models.PatrolIncident
        fields = ('incidentType', 'incidentTime', 'incidentDate',
                  'longitude', 'x', 'y', 'details', 'photoPath',
                  'timeSubmitted', 'latitude', 'trackID')#, 'userID',)


class SignUpForm(UserCreationForm):
    # first_name = forms.CharField(max_length=60, required=False)
    # last_name = forms.CharField(max_length=60, required=False)
    email = forms.EmailField(max_length=254, help_text="This field is required")

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'username', 'email', 'password1',
                  'password2',)
        # fields = ('username', 'email', 'password1',
        #           'password2',)

    def __init__(self, *args, **kwargs):
        super(SignUpForm, self).__init__(*args, **kwargs)
        for visible in self.visible_fields():
            visible.field.widget.attrs['class'] = 'signinFormField'
