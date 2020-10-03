#!/bin/bash

docker swarm leave --force
docker system prune --all --force
docker image prune --all --force
docker volume prune --all --force

docker swarm init --advertise-addr 157.230.126.239

mkdir /var/www/zaorski.co.uk/html/mongo/mongo-config-1
mkdir /var/www/zaorski.co.uk/html/mongo/mongo-config-2
mkdir /var/www/zaorski.co.uk/html/mongo/mongo-config-3

mkdir /var/www/zaorski.co.uk/html/mongo/mongo-data-1
mkdir /var/www/zaorski.co.uk/html/mongo/mongo-data-2
mkdir /var/www/zaorski.co.uk/html/mongo/mongo-data-3

docker stack deploy --compose-file=docker-compose.yml myapp

./mongo/mongo_setup.sh