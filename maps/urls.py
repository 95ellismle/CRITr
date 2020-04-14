from django.urls import path
from django.contrib.auth import views as auth_views
from django.conf.urls import url

from . import views


urlpatterns = [
    path('', views.user_login, name='login'),
    path("maps", views.mapIndex, name="maps"),
    path("activities", views.activities, name="activities"),
    path("reporting_an_incident", views.reportIncident, name="reportIncident"),
    path("success", views.successful_report, name="successful_report"),
    url(r'^signup/$', views.signup, name='signup'),
    url(r'^ajax/validate_username/$', views.validate_username,
        name='validate_username'),
    url(r'^ajax/validate_email/$', views.validate_email,
        name='validate_email'),
    url('maps/save_track_data', views.save_track_data, name="save_track_data"),
    url('maps/get_track_ID', views.get_track_ID, name="get_track_ID"),
    url("save_patrol_incident_data", views.save_patrol_incidents, name="save_patrol_incidents")
]
