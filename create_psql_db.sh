#!/bin/bash 

PSQL_PASS=`tail -1 password.key`
PSQL_USER="critr"
PSQL_DB="critr_db"

echo "Creating User \"$PSQL_USER\""
psql_cmd="CREATE ROLE $PSQL_USER WITH NOCREATEDB NOCREATEROLE NOSUPERUSER ENCRYPTED PASSWORD '$PSQL_PASS';"
su postgres -c "psql -c \"$psql_cmd\"";

echo "Creating Database \"$PSQL_DB\""
psql_cmd="CREATE DATABASE $PSQL_DB WITH OWNER '$PSQL_USER';"
su postgres -c "psql -c \"$psql_cmd\"";

