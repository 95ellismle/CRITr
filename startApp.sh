#!/usr/bin/env bash

echo $HOME
SETTINGS_DIRECTORY="$HOME/Documents/CRITr/CRITr"
MANAGE_PY_FILE="$SETTINGS_DIRECTORY/../manage.py"
SETTINGS_FILE="$SETTINGS_DIRECTORY/settings.py";
DEVELOPMENT_MODE="false"

# Collect static files and make migrations
PIPENV=/home/critr/.local/bin/pipenv
$PIPENV run python3 $MANAGE_PY_FILE collectstatic --noinput
$PIPENV run python3 $MANAGE_PY_FILE makemigrations
$PIPENV run python3 $MANAGE_PY_FILE migrate --noinput


# Read the flags

DEVELOPMENT_MODE="false"
while getopts d option
do
    case "${option}"
    in
    d)  echo "In Development Mode"
        DEVELOPMENT_MODE="true";;
esac
done


# Set the secret key
SECRET_KEY_FILEPATH="$SETTINGS_DIRECTORY/../secret.key"
if ! [ -f $SECRET_KEY_FILEPATH ]
then
    SECRET_KEY=`head /dev/urandom | tr -dc A-Za-z0-9 | head -c 72 ; echo ""`
    echo $SECRET_KEY > $SECRET_KEY_FILEPATH
fi


# Set the value of DEBUG in the settings.py file
DEBUG_STR=$(grep "DEBUG" $SETTINGS_FILE)
if [ "$DEVELOPMENT_MODE" == "true" ]
then
    echo "Setting DEBUG = True"
    if ! [ -z "$DEBUG_STR" ]; then
        sed -i "s/$DEBUG_STR/DEBUG = True/" $SETTINGS_FILE
    else
        echo "ERROR: No DEBUG setting found in settings.py"
        exit 1;
    fi
else
    echo "Setting DEBUG to False"
    if ! [ -z "$DEBUG_STR" ]; then
        sed -i "s/$DEBUG_STR/DEBUG = False/" $SETTINGS_FILE
    else
        echo "ERROR: No DEBUG setting found in settings.py"
        exit 1;
    fi
fi



# Change the db host
CURR_HOST_STR=`grep "'HOST':.*'," $SETTINGS_FILE`
if [ "$DEVELOPMENT_MODE" == "true" ]
then
    sed -i "s/$CURR_HOST_STR/        'HOST': 'localhost',/" $SETTINGS_FILE;
else
    sed -i "s/$CURR_HOST_STR/        'HOST': '',/" $SETTINGS_FILE;
fi



if [ "$DEVELOPMENT_MODE" == "true" ]
then
	python3 manage.py runserver 127.0.0.1:8000
    exit

else
	
	MANAGE_PY_FILE="$SETTINGS_DIRECTORY/../manage.py"
	
	$PIPENV run gunicorn -c "$SETTINGS_DIRECTORY/../config/gunicorn/conf.py" CRITr.wsgi:application
fi
