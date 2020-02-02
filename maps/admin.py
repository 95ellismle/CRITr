from django.contrib import admin
from .models import Track, Incident

# Register your models here.
admin.site.register([Track, Incident])
