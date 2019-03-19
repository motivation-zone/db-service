# Server information

## Testing
| Environment | URL |
|---|---|
| Testing DB_Service | 178.21.8.244/db-service |
| Testing DB Postgres | 178.21.8.244:5432 |

## Production
| Production DB_Service | ${url}/db-service |
| Production Postgres | ${url}:5432 |

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

### NGINX installation
```
    sudo apt-get install -fy nginx-full
    # TODO write command to copy configs
    # remove initial config and restart and others
```

### Environment settings (source ~/.bash_profile)
```
    export ENVIRONMENT="testing"; # or "production"
    export TZ="UTC";
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

### Postgres connection
```
    psql "host=host port=port dbname=dbname user=user"
```

### Dirs
```
    /usr/share/motivation_zone - common files
    /usr/local/www - projects folder
```
