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
    cd CRITr;
    python3 collectstatic;
    python3 manage.py makemigrations;
    python3 manage.py migrate;

    cd -;
    echo "true" > $INIT_DONE_FILE;
fi



################################################
###                RUNNING                   ###
################################################
# Now run the server
python3 manage.py runserver 0.0.0.0:8000
