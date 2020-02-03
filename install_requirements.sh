apt-get install -y libpq-dev postgresql-10 postgresql-contrib
apt-get install -y postgresql-server-dev-10
apt-get install -y erlang
apt-get install -y rabbitmq-server
apt-get install -y supervisor

./create_database.sh

pipenv shell
pipenv install
