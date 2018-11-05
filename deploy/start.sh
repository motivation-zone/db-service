#!/usr/bin/env bash

export NGINX_PORT=80
export NODEJS_PORT=8080
export NODEJS_APP=${NODEJS_APP:-/usr/local/www/server/app.js}
export ENVIRONMENT=${GLOBAL_ENVIRONMENT:-"development"}

envsubst \
    '\$NGINX_PORT \$NODEJS_PORT' \
    < /config_templates/nginx.template.conf \
    > /etc/nginx/sites-available/nginx.default.conf

ln -snf /etc/nginx/sites-available/nginx.default.conf /etc/nginx/sites-enabled/nginx.default.conf
rm -rf /etc/nginx/sites-enabled/default
rm -rf /etc/nginx/sites-available/default

envsubst \
    '\$NODEJS_APP \$NODEJS_OPTIONS \$ENVIRONMENT' \
    < /config_templates/supervisord.template.conf \
    > /etc/supervisor/conf.d/supervisord.conf

/usr/bin/supervisord
