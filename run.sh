# Read the parameters from the bash_flags directory
#  this sets some permanent parameters used to change 
#  how we load/run the app.
FLAGS_DIR="bash_flags"
INIT_DONE_FILE="$FLAGS_DIR/init_done"


################################################
###              INITIALISATION              ###
################################################
# Check if the app has already been initialised
if [ -f $INIT_DONE_FILE ]; then
    INIT_DONE=`cat $INIT_DONE_FILE`
else
    INIT_DONE="false"
fi

# Do the initialisation (do migrations, collec static files)
if [ $INIT_DONE = "false" ]; then
    cd CRITr
    python3 manage.py collectstatic
    python3 manage.py makemigrations
    python3 manage.py migrate
    cd ../

    echo "true" > $INIT_DONE_FILE;
fi
if ! [ -f "secret_key.txt" ]; then
    echo " vvvvvvvvvvvvvvvvvvvvvv "
    echo " "
    echo " "
    echo "NO SECRET KEY FILE FOUND!"
    echo " "
    echo " "
    echo " ^^^^^^^^^^^^^^^^^^^^^^ "
    exit 1
fi
export SECRET_KEY=`cat secret_key.txt`
export DJANGO_DEBUG="True"




################################################
###                RUNNING                   ###
################################################


# Now run the server
cd CRITr

gunicorn --bind 0.0.0.0:8000 CRITr.wsgi
#python3 manage.py runserver 0.0.0.0:8000
