from django.db import models
# from django_mysql.models import ListCharField
from django.conf import settings
from django.utils import timezone

incidentChoices = (("Littering", "Littering"),
                   ("Loitering","Loitering"),
                   ("Graffiti","Graffiti"),
                   ("Speeding","Speeding"),
                   ("Parking","Parking"),)

# Create your models here.
class Incident(models.Model):
    """Will save incident information."""
    incidentType = models.CharField(max_length=200, choices=incidentChoices)
    incidentTime = models.TimeField(default=timezone.now)
    incidentDate = models.DateField(default=timezone.now)
    latitude = models.FloatField()
    longitude = models.FloatField()
    x = models.FloatField()
    y = models.FloatField()
    details = models.TextField(null=True, blank=True)
    photoPath = models.ImageField(upload_to="incidentPhotos/%Y/%m/%d")
    timeSubmitted = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                               on_delete=models.CASCADE)

    def publish(self):
        self.timeSubmitted = timezone.now()
        self.save()

    def __str__(self):
        return self.incidentType


class Track(models.Model):
    """Will save user's tracking data."""
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                                   on_delete=models.CASCADE)
    x = models.FloatField()
    y = models.FloatField()
    latitude = models.FloatField()
    longitude = models.FloatField()
    datetime = models.DateTimeField(default=timezone.now)
    trackID = models.IntegerField(null=False)

    def __str__(self):
        return f"Track ID: {trackID}. User {str(user)}."

class PatrolIncident(models.Model):
    """
    Will save incident information from a patrol.
    
    N.B. This should really just inherit from the Incident model but
         I haven't got that working.
    """
    incidentType = models.CharField(max_length=200, choices=incidentChoices)
    incidentTime = models.TimeField(default=timezone.now)
    incidentDate = models.DateField(default=timezone.now)
    latitude = models.FloatField()
    longitude = models.FloatField()
    x = models.FloatField()
    y = models.FloatField()
    details = models.TextField(null=True, blank=True)
    photoPath = models.ImageField(upload_to="incidentPhotos/%Y/%m/%d")
    timeSubmitted = models.DateTimeField(default=timezone.now)
    trackID = models.IntegerField()
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                               on_delete=models.CASCADE)

    def publish(self):
        self.timeSubmitted = timezone.now()
        self.save()

    def __str__(self):
        return self.incidentType


# class Activity(models.Model):
#     activityChoices = (("patrol", "Patrol"),
#                        ("community_event", "Community Event"),
#                        ("community_speed_watch", "Community Speed Watch"),
#                        ("litter_picking", "Litter Picking"),)
#     type = models.CharField(max_length=200, choices=activityChoices)
#     date = models.DateField(default=timezone.now)
#     time = models.TimeField(default=timezone.now)
#     latitude = models.FloatField()
#     longitude = models.FloatField()
#     x = models.FloatField()
#     y = models.FloatField()
#     details = models.TextField(null=True, blank=True)
#     points = models.PositiveSmallIntegerField(null=False)
#     numPeople = models.PositiveSmallIntegerField(null=False)
#     spacesTaken = models.PositiveSmallIntegerField(null=False)
#     relevantIncidentIDs = models.ListCharField(IntegerField)
