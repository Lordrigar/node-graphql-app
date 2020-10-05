#!/bin/bash

docker swarm leave --force
docker system prune --all --force
docker image prune --all --force
docker volume prune --force

docker swarm init --advertise-addr <host>

mkdir /var/www/<folder_path>/html/mongo/mongo-config-1
mkdir /var/www/<folder_path>/html/mongo/mongo-config-2
mkdir /var/www/<folder_path>/html/mongo/mongo-config-3

mkdir /var/www/<folder_path>/html/mongo/mongo-data-1
mkdir /var/www/<folder_path>/html/mongo/mongo-data-2
mkdir /var/www/<folder_path>/html/mongo/mongo-data-3

mkdir /var/www/<folder_path>/html/app/logs

docker stack deploy --compose-file=docker-compose.yml myapp

./mongo/mongo_setup.sh