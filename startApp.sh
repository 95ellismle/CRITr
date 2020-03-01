#!/usr/bin/env bash
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


# Set up all the filepaths for development and production
if [ "$DEVELOPMENT_MODE" == "true" ]
then
    ROOT_DIRECTORY="."
else
    ROOT_DIRECTORY="$HOME/Documents/CRITr"
fi

SETTINGS_DIRECTORY="$ROOT_DIRECTORY/CRITr"
SETTINGS_FILE="$SETTINGS_DIRECTORY/settings.py"
MAPS_DIRECTORY="$ROOT_DIRECTORY/maps"
MANAGE_PY_FILE="$ROOT_DIRECTORY/manage.py"
BASE_HTML_FILE="$MAPS_DIRECTORY/templates/base.html"

PIPENV="$HOME/.local/bin/pipenv"

declare -a ALL_FPATHS=($BASE_HTML_FILE $MANAGE_PY_FILE $SETTINGS_FILE)

# Check all files are there
for filepath in "${ALL_FPATHS[@]}"
do
    if ! [ -f "$filepath" ]
    then
        echo "Can't find file '$filepath'. PWD = $(pwd)"
        exit 1
    fi
done

# Allow initApp.sh to access the variables
export ROOT_DIRECTORY
export DEVELOPMENT_MODE
export SETTINGS_DIRECTORY
export SETTINGS_FILE
export MAPS_DIRECTORY
export MANAGE_PY_FILE
export BASE_HTML_FILE
export PIPENV

./init_app.sh

if [ "$DEVELOPMENT_MODE" == "true" ]
then
    echo "Running app in development mode"

	$PIPENV run python3 manage.py runserver 127.0.0.1:8000
else
    echo "-----------------------------------------------------------------"
    echo "|                                                               |"
    echo "|   ########   ##########   ########### ########### ##########  |"
    echo "| ##########   ###########  ########### ########### ########### |"
    echo "| #####        ###     ###      ###         ###     ###     ### |"
    echo "| ###          ###     ###      ###         ###     ###     ### |"
    echo "| ###          ###########      ###         ###     ########### |"
    echo "| ###          ##########       ###         ###     #########   |"
    echo "| #####        ###  ####        ###         ###     ###  ####   |"
    echo "| ##########   ###   ####   ###########     ###     ###   ####  |"
    echo "|   ########   ###    ####  ###########     ###     ###    #### |"
    echo "|                                                               |"
    echo "|---------------------------------------------------------------|"
    echo "|            Communities Resolving Issues Together              |"
    echo "-----------------------------------------------------------------"
    echo "|                                                               |"
    echo "| App running in production mode                                |"
	
	$PIPENV run gunicorn -c "$ROOT_DIRECTORY/config/gunicorn/conf.py" CRITr.wsgi:application
fi
