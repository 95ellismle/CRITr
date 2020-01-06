from django.shortcuts import render, redirect
from django.core.files.storage import FileSystemStorage
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponse
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.core.validators import validate_email as email_is_valid
from django.core.exceptions import ValidationError
from django.contrib.auth import authenticate, login

import re

from .forms import IncidentForm, SignUpForm
from .models import Track

def user_login(request):
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']

        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return render(request, "maps/map_index.html", {})
        else:
            return render(request, "registration/login.html",
                          {'error_message': 'Incorrect username and / or password.'})
    else:
        return render(request, "registration/login.html", {})

# Create your views here.
@login_required
def mapIndex(request):
    return render(request, "maps/map_index.html", {})

# Create your views here.
@login_required
def activities(request):
    return render(request, "activities/activities_list.html", {})

@login_required
def reportIncident(request):
    if request.method == "POST":
        form = IncidentForm(request.POST, request.FILES)
        if form.is_valid():
            post = form.save(commit=False)
            post.user = request.user
            post.save()
            return redirect("successful_report")

    else:
        form = IncidentForm()

    return render(request, "reporting/reportIncident.html",
                  {'form': form, "succes": False})

@login_required
def successful_report(request):
    return render(request, "reporting/successfulIncident.html", {})

def signup(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=raw_password)
            login(request, user)
            return redirect('maps')
    else:
        form = SignUpForm()
        extra = "Did"
    return render(request, "registration/signup.html", {'form': form,
                                                        'form_len':len(form.fields),
                                                        'form_len_sub1':len(form.fields)-1})

# Using AJAX to validate username email and password
def validate_username(request):
    username = request.GET.get('username', None)
    data = {
        'is_taken': User.objects.filter(username__iexact=username).exists()
    }
    return JsonResponse(data)


def validate_email(request):
    email = request.GET.get('email', None)
    try:
         email_is_valid(email)
         is_valid = True
    except ValidationError:
        is_valid = False

    data = {
        'is_taken': User.objects.filter(email__iexact=email).exists(),
        'is_valid': is_valid,
    }
    return JsonResponse(data)


def track_location(request):
    if request.is_ajax():
        Track.objects.create(user=request.user,
                             x=request.POST['x'],
                             y=request.POST['y'],
                             latitude=request.POST['latitude'],
                             longitude=request.POST['longitude'])
        message = ""
    else:
        message = "Data not added check the serverside code."

    return HttpResponse(message)
