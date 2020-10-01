#!/bin/bash

docker swarm leave --force

docker swarm init --advertise-addr 157.230.126.239

docker network create -d overlay --internal mynetwork

docker stack deploy --compose-file=docker-compose.yml myapp

./mongo/mongo_setup.sh