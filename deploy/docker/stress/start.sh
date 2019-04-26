#!/usr/bin/env bash

export NGINX_PORT=80
export NODEJS_PORT=8080
export NODEJS_APP=/usr/local/app/build/src/app.js
export NODEJS_ENV=${NODEJS_ENV:-"development"}

envsubst \
    '\$NGINX_PORT \$NODEJS_PORT' \
    < /config-templates/nginx.template.conf \
    > /etc/nginx/sites-available/nginx.default.conf

ln -snf /etc/nginx/sites-available/nginx.default.conf /etc/nginx/sites-enabled/nginx.default.conf
rm -rf /etc/nginx/sites-enabled/default
rm -rf /etc/nginx/sites-available/default

envsubst \
    '\$NODEJS_APP \$NODEJS_OPTIONS \$NODEJS_ENV \$NODE_PATH' \
    < /config-templates/supervisord.template.conf \
    > /etc/supervisor/conf.d/supervisord.conf

echo "local   replication     all                                     trust" >> /etc/postgresql/9.5/main/pg_hba.conf
/etc/init.d/postgresql start
echo "log_directory = 'pg_log'" >> /etc/postgresql/9.5/main/postgresql.conf
echo "log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'" >> /etc/postgresql/9.5/main/postgresql.conf
echo "log_statement = 'all'" >> /etc/postgresql/9.5/main/postgresql.conf
echo "logging_collector = on" >> /etc/postgresql/9.5/main/postgresql.conf
/etc/init.d/postgresql restart
sudo -u postgres psql -c '\x' -c "CREATE USER admin WITH SUPERUSER CREATEDB CREATEROLE REPLICATION BYPASSRLS PASSWORD 'znkzslvj4g'"
sudo -u postgres psql -c '\x' -c "UPDATE pg_database SET datistemplate=FALSE WHERE datname='template1'"
sudo -u postgres psql -c '\x' -c "DROP DATABASE template1"
sudo -u postgres psql -c '\x' -c "CREATE DATABASE template1 WITH owner=postgres template=template0 encoding='UTF8'"
sudo -u postgres psql -c '\x' -c "UPDATE pg_database SET datistemplate=TRUE WHERE datname='template1'"
sudo -u postgres psql -c '\x' -c "CREATE DATABASE motivation_zone WITH ENCODING 'UTF8' OWNER admin"
sudo -u postgres psql -c '\x' -c "SET timezone='UTC';"
sudo -u postgres psql motivation_zone < /usr/local/app/motivation_zone.bak

/usr/bin/supervisord
