#!/usr/bin/env bash

SETTINGS_DIRECTORY="./CRITr"
MAPS_DIRECTORY="./maps"
MANAGE_PY_FILE="$SETTINGS_DIRECTORY/../manage.py"
BASE_HTML_FILE="$MAPS_DIRECTORY/templates/base.html"

# Collect static files and make migrations
pipenv run python3 $MANAGE_PY_FILE collectstatic --noinput
pipenv run python3 $MANAGE_PY_FILE makemigrations
pipenv run python3 $MANAGE_PY_FILE migrate --noinput


# Read the flags
DEVELOPMENT_MODE="false"
while getopts d option
do
    case "${option}"
    in
    d)  echo "In Development Mode"
        DEVELOPMENT_MODE="true"
esac
done



# Set the value of DEBUG in the settings.py file
FILE_TO_CHANGE="$SETTINGS_DIRECTORY/settings.py"
DEBUG_STR=$(grep "DEBUG" $FILE_TO_CHANGE)
if [ $DEVELOPMENT_MODE == "true" ]
then 
    echo "Setting DEBUG = True"
    if ! [ -z "$DEBUG_STR" ]; then
        sed -i "s/$DEBUG_STR/DEBUG = True/" $FILE_TO_CHANGE
    else
        echo "ERROR: No DEBUG setting found in settings.py"
        exit 1;
    fi
else
    echo "Setting DEBUG to False"
    if ! [ -z "$DEBUG_STR" ]; then
        sed -i "s/$DEBUG_STR/DEBUG = False/" $FILE_TO_CHANGE
    else
        echo "ERROR: No DEBUG setting found in settings.py"
        exit 1;
    fi
fi



# Set the secret key
SECRET_KEY_FILEPATH="$SETTINGS_DIRECTORY/../secret.key"
if ! [ -f $SECRET_KEY_FILEPATH ]
then
    SECRET_KEY=`head /dev/urandom | tr -dc A-Za-z0-9 | head -c 72 ; echo ""`
    echo $SECRET_KEY > $SECRET_KEY_FILEPATH
fi


# Use the downloaded jquery in development mode (as the developer may be offline, though for production the jquery CDN should be faster)

# Will comment an html line
if [ $DEVELOPMENT_MODE == "true" ]
then
    sed -i "s/https:\/\/ajax.googleapis.com\/ajax\/libs\/jquery\/3.4.1\/jquery.min.js/{% static 'js\/jquery.js'}/" $BASE_HTML_FILE
else
    sed -i "s/{% static 'js\/jquery.js'}/https:\/\/ajax.googleapis.com\/ajax\/libs\/jquery\/3.4.1\/jquery.min.js/" $BASE_HTML_FILE
fi
