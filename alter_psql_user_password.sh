#!/bin/bash

PSQL_PASS=`tail -1 password.key`
PSQL_USER="critr"
PSQL_DB="critr_db"

echo "Alter the password in case the user is already created"
psql_cmd="ALTER USER $PSQL_USER WITH PASSWORD '$PSQL_PASS';"
su postgres -c "psql -c \"$psql_cmd\"";
