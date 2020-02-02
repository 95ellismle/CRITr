#!/bin/bash 

PSQL_PASS="0SXCSV0GOARvIyTN"
PSQL_USER="critr"
PSQL_DB="critr_db"

echo "To create user follow the steps below:

1) sudo su - postgres
2) psql
3) CREATE USER $PSQL_USER WITH NOCREATEDB NOCREATEROLE NOSUPERUSER ENCRYPTED PASSWORD '$PSQL_PASS';
4) CREATE DATABASE $PSQL_DB WITH OWNER '$PSQL_USER';
5) \q
6) exit
"
