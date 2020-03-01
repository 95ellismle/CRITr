#!/usr/bin/env bash

echo $SETTINGS_FILE

# Set the value of DEBUG in the settings.py file
DEBUG_STR=$(grep "DEBUG" $SETTINGS_FILE)
if [ "$DEVELOPMENT_MODE" == "true" ]
then 
    echo "Setting DEBUG = True"
    if ! [ -z "$DEBUG_STR" ]; then
        sed -i "s/$DEBUG_STR/DEBUG = True/" $SETTINGS_FILE
        echo "Set DEBUG = True"
    else
        echo "ERROR: No DEBUG setting found in settings.py"
        exit 1;
    fi
else
    echo "Setting DEBUG = False"
    if ! [ -z "$DEBUG_STR" ]; then
        if ! [ -f "$SETTINGS_FILE" ]
        then
            echo "Can't find file $SETTINGS_FILE. pwd = $(pwd)"
        fi
        sed -i "s/$DEBUG_STR/DEBUG = False/" $SETTINGS_FILE
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
DEV_STR="{% static 'js\/jquery.js' %}"
PROD_STR="https:\/\/ajax.googleapis.com\/ajax\/libs\/jquery\/3.4.1\/jquery.min.js"
if [ "$DEVELOPMENT_MODE" == "false" ]
then
    sed -i s/"$DEV_STR"/"$PROD_STR"/ $BASE_HTML_FILE
    echo "Set jquery path to local"
else
    sed -i s/"$PROD_STR"/"$DEV_STR"/ $BASE_HTML_FILE
    echo "Set jquery path to CDN"
fi



# Choose to turn on or off the secure http settings for development or production

# Create an array of variables to comment
declare -a lines_to_comment=("SECURE_SSL_REDIRECT" "SECURE_PROXY_SSL_HEADER" "SESSION_COOKIE_SECURE" "CSRF_COOKIE_SECURE" "STATIC_ROOT")

# If in dev mode then comment them
if [ "$DEVELOPMENT_MODE" == "true" ]
then
    for line in "${lines_to_comment[@]}"
    do
        line_commented=$(grep "# *$line" $SETTINGS_FILE)
        if [ -z "$line_commented" ]
        then
            sed -i s/"$line"/"# $line"/ $SETTINGS_FILE
        fi
    done

else

    for line in "${lines_to_comment[@]}"
    do
        sed -i s/"# *$line"/"$line"/ $SETTINGS_FILE
    done
fi


# Collect static files and make migrations
echo "Collecting static and making migrations"
$PIPENV run python3 $MANAGE_PY_FILE collectstatic --noinput
$PIPENV run python3 $MANAGE_PY_FILE makemigrations
$PIPENV run python3 $MANAGE_PY_FILE migrate --noinput
