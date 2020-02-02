#!/usr/bin/env bash

# Read the flags

DEVELOPMENT_MODE="false"
while getopts d option
do
    case "${option}"
    in
    d)  echo "In Development Mode"
        ./init_app.sh -d
esac
done



if [ $DEVELOPMENT_MODE == "true" ]
then
	python3 manage.py runserver 127.0.0.1:8000
    exit

else
    echo "BOB"
	SETTINGS_DIRECTORY="$HOME/Documents/CRITr/CRITr"
	
	MANAGE_PY_FILE="$SETTINGS_DIRECTORY/../manage.py"
	
	pipenv run gunicorn -c "$SETTINGS_DIRECTORY/../config/gunicorn/conf.py" CRITr.wsgi:application
fi
