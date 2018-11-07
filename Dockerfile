FROM ubuntu:16.04
LABEL maintainer="Denis Stepanov"

WORKDIR /usr/local/app
ENV WORKDIR /usr/local/app
RUN mkdir /config_templates

RUN apt-get update
RUN apt-get install -fy wget git vim gettext-base net-tools
RUN apt-get install -fy build-essential
RUN apt-get install -fy nginx-full
RUN apt-get install -fy curl
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install -fy nodejs
RUN apt-get install -fy supervisor
RUN apt-get install -fy postgresql postgresql-contrib

COPY package.json package-lock.json Makefile ./
RUN make install

COPY . .
RUN make build
RUN cp $WORKDIR/deploy/nginx.template.conf /config_templates/nginx.template.conf
RUN cp $WORKDIR/deploy/supervisord.template.conf /config_templates/supervisord.template.conf

RUN make prune
RUN mkdir $WORKDIR/logs

CMD NODEJS_APP=$WORKDIR/build/src/app.js ./deploy/start.sh
