#!/bin/bash

docker system prune --all --force
docker image prune --all --force
docker volume prune --all --force

docker-compose -f docker-compose-dev.yml up --build --remove-orphans
docker volume ls -qf dangling=true | xargs -r docker volume rm