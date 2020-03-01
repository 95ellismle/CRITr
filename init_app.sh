#!/usr/bin/env bash


# Set the value of DEBUG in the settings.py file
FILE_TO_CHANGE="$SETTINGS_DIRECTORY/settings.py"
DEBUG_STR=$(grep "DEBUG" $FILE_TO_CHANGE)
if [ "$DEVELOPMENT_MODE" == "true" ]
then 
    echo "Setting DEBUG = True"
    if ! [ -z "$DEBUG_STR" ]; then
        sed -i "s/$DEBUG_STR/DEBUG = True/" $FILE_TO_CHANGE
        echo "Set DEBUG = True"
    else
        echo "ERROR: No DEBUG setting found in settings.py"
        exit 1;
    fi
else
    echo "Setting DEBUG = False"
    if ! [ -z "$DEBUG_STR" ]; then
        if ! [ -f "$FILE_TO_CHANGE" ]
        then
            echo "Can't find file $FILE_TO_CHANGE. pwd = $(pwd)"
        fi
        sed -i "s/$DEBUG_STR/DEBUG = False/" $FILE_TO_CHANGE
        echo "Set DEBUG = False"
    else
        echo "ERROR: No DEBUG setting found in settings.py"
        exit 1;
    fi
fi


# Set the secret key
SECRET_KEY_FILEPATH="$ROOT_DIRECTORY/secret.key"
if ! [ -f $SECRET_KEY_FILEPATH ]
then
    SECRET_KEY=`head /dev/urandom | tr -dc A-Za-z0-9 | head -c 72 ; echo ""`
    echo $SECRET_KEY > $SECRET_KEY_FILEPATH
fi
echo "Created Secret Key"


# Change the db host
CURR_HOST_STR=`grep "'HOST':.*'," $SETTINGS_FILE`
echo $CURR_HOST_STR
if [ "$DEVELOPMENT_MODE" == "true" ]
then
    sed -i "s/$CURR_HOST_STR/        'HOST': 'localhost',/" $SETTINGS_FILE;
else
    sed -i "s/$CURR_HOST_STR/        'HOST': '',/" $SETTINGS_FILE;
fi
echo "Changed Host String"


# Use the downloaded jquery in development mode (as the developer may be offline, though for production the jquery CDN should be faster)
# Will comment an html line
if [ "$DEVELOPMENT_MODE" == "false" ]
then
    sed -i "s/{% static 'js\/jquery.js'}/https:\/\/ajax.googleapis.com\/ajax\/libs\/jquery\/3.4.1\/jquery.min.js/" $BASE_HTML_FILE
    echo "Set jquery path to local"
else
    sed -i "s/https:\/\/ajax.googleapis.com\/ajax\/libs\/jquery\/3.4.1\/jquery.min.js/{% static 'js\/jquery.js'}/" $BASE_HTML_FILE
    echo "Set jquery path to CDN"
fi

# Choose to turn on or off the secure http settings for development or production
if [ "$DEVELOPMENT_MODE" == "true" ]
then
    declare -a lines_to_comment=("SECURE_SSL_REDIRECT" "SECURE_PROXY_SSL_HEADER" "SESSION_COOKIE_SECURE" "CSRF_COOKIE_SECURE")
    for line in "${lines_to_comment[@]}"
    do
        line_commented=$(grep "# *$line" $SETTINGS_FILE)
        if [ -z "$line_commented" ]
        then
            sed -i s/"$line"/"# $line"/ $SETTINGS_FILE
        else
            echo "Don't recomment"
        fi
    done
else
    sed -i s/"# *SECURE_PROXY_SSL_HEADER"/"SECURE_PROXY_SSL_HEADER"/ $SETTINGS_FILE
fi

# Collect static files and make migrations
echo "Collecting static and making migrations"
$PIPENV run python3 $MANAGE_PY_FILE collectstatic --noinput
$PIPENV run python3 $MANAGE_PY_FILE makemigrations
$PIPENV run python3 $MANAGE_PY_FILE migrate --noinput
