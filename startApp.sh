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
	python3 manage.py runserver 0.0.0.0:8000
else
	SETTINGS_DIRECTORY="$HOME/Documents/CRITr/CRITr4"
	
	MANAGE_PY_FILE="$SETTINGS_DIRECTORY/../manage.py"
	
	pipenv run gunicorn -c "$SETTINGS_DIRECTORY/../config/gunicorn/conf.py" CRITr4.wsgi:application
fi
