#!/usr/bin/env bash

SETTINGS_DIRECTORY="$HOME/Documents/CRITr/CRITr"
MANAGE_PY_FILE="$SETTINGS_DIRECTORY/../manage.py"
SETTINGS_FILE="$SETTINGS_DIRECTORY/settings.py";
DEVELOPMENT_MODE="false"

# Collect static files and make migrations
PIPENV="$HOME/.local/bin/pipenv"
$PIPENV run python3 $MANAGE_PY_FILE collectstatic --noinput
$PIPENV run python3 $MANAGE_PY_FILE makemigrations
$PIPENV run python3 $MANAGE_PY_FILE migrate --noinput


if [ "$DEVELOPMENT_MODE" == "true" ]
then
    echo "In Development Mode"
    ./init_app.sh -d
	$PIPENV python3 manage.py runserver 127.0.0.1:8000
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
    echo ""
    echo ""
	SETTINGS_DIRECTORY="$HOME/Documents/CRITr/CRITr"
	MANAGE_PY_FILE="$SETTINGS_DIRECTORY/../manage.py"
	
    $SETTINGS_DIRECTORY/../init_app.sh
    echo "Initialised"
	$PIPENV run gunicorn -c "$SETTINGS_DIRECTORY/../config/gunicorn/conf.py" CRITr.wsgi:application
fi
