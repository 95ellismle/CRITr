#!/usr/bin/env bash

SETTINGS_DIRECTORY="./CRITr"
MANAGE_PY_FILE="$SETTINGS_DIRECTORY/../manage.py"

# Activate the pip virtual enviroment
pipenv shell

# Collect static files and make migrations
python3 $MANAGE_PY_FILE collectstatic --noinput
python3 $MANAGE_PY_FILE makemigrations
python3 $MANAGE_PY_FILE migrate --noinput


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

# If in development mode run the app
if [ $DEVELOPMENT_MODE ]
then
    python3 $MANAGE_PY_FILE runserver 127.0.0.1:8000
fi
