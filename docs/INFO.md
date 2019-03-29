# Server information

| Environment | URL |
|---|---|
| Testing db-service | 176.99.11.253/db |
| Testing database | manny.db.elephantsql.com:5432 |

## Service routing (testing)
1. ${host}/db/smth - request on this address
2. nginx:80 - nginx rewrite /db and proxies request
3. localhost:5000/smth - is a mapping for docker
4. docker-container: localhost:80/smth - docker has nginx in and proxy request too
5. docker-container: localhost:${NODEJS_PORT}/smth - analyse request and form response
6. nodejs request the database on manny.db.elephantsql.com:5432

### Server dirs
```
/usr/share/motivation-zone - common files
/usr/local/www - projects folder
```

### Environment settings (source ~/.profile)
```
export NODEJS_ENV="testing"; # or "production"
export TZ="UTC";
export MZ_DB_SERVICE_DOCKER_USER=${value};
export MZ_DB_SERVICE_DOCKER_PASS=${value};
export MZ_DB_SERVICE_PRIVATE_KEY=${value}; // for sign/verify token
export MZ_DB_SERVICE_TOKEN=${value}; // token
```

### OS preparation
```
sudo apt-get update
sudo apt-get install -fy wget \
    git \
    vim \
    gettext-base \
    net-tools \
    build-essential \
    curl \
    python
```

### Postgresql installation
```
sudo apt-get install -fy postgresql postgresql-contrib
su - postgres
```
```
CREATE USER ${username} WITH SUPERUSER CREATEDB CREATEROLE REPLICATION BYPASSRLS PASSWORD '${password}';
CREATE DATABASE ${dbname} WITH ENCODING 'UTF8' OWNER ${rolename};
SET timezone='UTC';
For DataGrip connection:
    'DB source properties' -> 'Advanced' tab -> 'VM Options': -Duser.timezone=UTC+06:00
```
```
vim /etc/postgresql/10/main/postgresql.conf
    "listen_addresses = '*'"

vim /etc/postgresql/10/main/pg_hba.conf
"
    host    all             all              0.0.0.0/0                       md5
    host    all             all              ::/0                            md5
"
/etc/init.d/postgresql restart
```

### NGINX installation
```
sudo apt-get install -fy nginx-full
# u can find nginx template in /deploy/docker/config-templates
```

### Docker installation
```
sudo apt-get update
sudo apt-get -fy install apt-transport-https \
    ca-certificates \
    software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo apt-key fingerprint 0EBFCD88
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) stable"
sudo apt-get update
sudo apt-get install docker-ce
```

### Postgres connection
```
psql "host=host port=port dbname=dbname user=user"
```
