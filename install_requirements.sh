apt-get install -y postgres-10
apt-get install -y postgresql-server-dev-10
apt-get install -y erlang
apt-get install -y rabbitmq-server

./create_database.sh

pipenv shell
pipenv install
