#!/bin/bash

docker system prune --all --force
docker image prune --all --force
# use the dev for now, just for testing, soon I will replace it with docker-compose for swarm for production
docker-compose -f docker-compose-dev.yml up -d --build --remove-orphans
docker volume ls -qf dangling=true | xargs -r docker volume rm