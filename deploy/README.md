# Server information

## Testing
| Environment | URL |
|---|---|
| Testing db-service | 176.99.11.253/db |
| Testing postgres | 176.99.11.253:5432 |

## Route
request: (176.99.11.253/db/smth) -> nginx:80 -> localhost:5000/smth ->
proxy to docker -> docker.localhost:80/smth -> docker.localhost:${NODEJS_PORT}/smth ->
db on remote host

## Production
| Production db-service | ${url}/db |
| Production postgres | ${url}:5432 |

### Dirs
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
    # u can find nginx template in /deploy/config-templates
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
