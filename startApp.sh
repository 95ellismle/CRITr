#!/usr/bin/env bash

SETTINGS_DIRECTORY="$HOME/Documents/CRITr/CRITr"
MANAGE_PY_FILE="$SETTINGS_DIRECTORY/../manage.py"
SETTINGS_FILE="$SETTINGS_DIRECTORY/settings.py";
DEVELOPMENT_MODE="false"

# Read the flags
DEVELOPMENT_MODE="false"
while getopts d option
do
    case "${option}"
    in
    d) DEVELOPMENT_MODE="true";;
esac
done


# 
if [ $DEVELOPMENT_MODE == "true" ]
then
    echo "In Development Mode"
    ./init_app.sh -d
	python3 manage.py runserver 127.0.0.1:8000
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
	
    ./init_app.sh
	pipenv run gunicorn -c "$SETTINGS_DIRECTORY/../config/gunicorn/conf.py" CRITr.wsgi:application
fi
