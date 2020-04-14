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

    def _validate_fields_(self):
        """
        Will do some basic validation of the form fields.

        This involves checking we have the correct types, only allowing 
        certain values for the incidentType and checking the times are
        in the past
        """
        # Check str variables
        str_vars = (self.details, self.incidentType, self.photoPath)
        if not all(type(j) != str for j in str_vars):
            return False

        # Check float variables
        float_vars = (self.x, self.y, self.latitude, self.longitude)
        if not all(type(j) != float for j in float_vars):
            return False

        # Check the incident type
        if not any(self.incidentType.lower() == j[0].lower() for j in models.incidentChoices):
            return False
        

    class Meta:
        model = models.Incident
        fields = ('incidentType', 'incidentTime', 'incidentDate',
                  'longitude', 'x', 'y', 'details', 'photoPath',
                  'timeSubmitted', 'latitude')#, 'userID',)

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
