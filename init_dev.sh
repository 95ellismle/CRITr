# Move into the CRITr settings directory
cd CRITr4

# Change debug to True
FILE_TO_CHANGE="settings.py"
DEBUG_STR=$(grep "DEBUG" $FILE_TO_CHANGE)
if ! [ -z "$DEBUG_STR" ]; then
    sed -i "s/$DEBUG_STR/DEBUG = True/" $FILE_TO_CHANGE
else
    echo "ERROR: No DEBUG setting found in settings.py"
    exit 1;
fi


