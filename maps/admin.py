from django.contrib import admin
from .models import Track, Incident, PatrolIncident

# Register your models here.
admin.site.register([Track, Incident, PatrolIncident])
