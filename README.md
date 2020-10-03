![Node-app CI](https://github.com/Lordrigar/node-graphql-app/workflows/Node-app%20CI/badge.svg?branch=master&event=push)

# Node and graphql app

Skeleton app mainly used for testing and setups. Currently runs github actions for tests, image deployment to dockerhub and app deployment to Digital Ocean (`swarm with mongodb replica set`). Includes mongo memory db, testing setup and auth with passport, serving two graphql endpoints as a playground (auth and no auth)

Tests can be run from `/app` directory without starting docker containers (thanks to Mongo memory server)

## Swarm cluster and MongoDB

For learning purpose app runs in docker swarm mode with sharded mongodb replica set. Failover is implemented, so when mongo1 fails, one of the workers takes responsibility for write actions.

## Starting

To start the app, the easiest thing is to run `./build.sh` script in root directory (make sure to comment the line about replica set in `app/index.js`)  
Alternatively run `./build_swarm.sh` (first `cp build_swarm.example.sh build_swarm.sh`) and fill the voids in script (let's be honest, I wrote it for myself).

## Deployments

As a practice session, there are two types of deployments: rsync and github actions. Rsync scripts (`deploy.sh and deploy_swarm.sh`) were made for a quick testing of setup on Digital Ocean, main mean of deployment is done by Github actions.

## Scripts

```javascript
  npm run test
```

## Fixtures and db seeding

Basic data fixtures can be imported to db and removed by running respected files inside `/fixtures` folder

```bash
  ./run_fixtures.sh

  ./drop_collections.sh
```
