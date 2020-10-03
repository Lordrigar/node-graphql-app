#!/bin/bash
echo SETUP.sh time now: `date +"%T" `

echo "Intializing replica set on master"
docker exec $(docker ps -qf label=com.docker.swarm.service.name=myapp_mongo1) mongo --eval '
  rs.initiate(
    {
      "_id": "rs0",
    "protocolVersion": 1,
    "version": 1,
    "members": [
        {
            "_id": 0,
            "host": "mongo1:27017",
            "priority": 2
        },
        {
            "_id": 1,
            "host": "mongo2:27017",
            "priority": 0
        },
        {
            "_id": 2,
            "host": "mongo3:27017",
            "priority": 0
        },
    ],settings: {chainingAllowed: true}
    }, { force: true }
  );
';

sleep 2

docker exec $(docker ps -qf label=com.docker.swarm.service.name=myapp_mongo1) mongo --eval '
  rs.reconfig(
    {
      "_id": "rs0",
    "protocolVersion": 1,
    "version": 1,
    "members": [
        {
            "_id": 0,
            "host": "mongo1:27017",
            "priority": 2
        },
        {
            "_id": 1,
            "host": "mongo2:27017",
            "priority": 0
        },
        {
            "_id": 2,
            "host": "mongo3:27017",
            "priority": 0
        },
    ],settings: {chainingAllowed: true}
    }, { force: true }
  );
';

sleep 10

echo 'setup admin account';
docker exec $(docker ps -qf label=com.docker.swarm.service.name=myapp_mongo1) mongo --eval '
admin = db.getSiblingDB("admin")
admin.createUser(
  {
    user: "root",
    pwd: "admin",
    roles: [ { role: "root", db: "admin" } ]
  }
)
';

echo 'setup user';
docker exec $(docker ps -qf label=com.docker.swarm.service.name=myapp_mongo1) mongo --eval '
db = db.getSiblingDB("mymongo")
db.createUser(
  {
    user: "user",
    pwd: "password",
    roles:
    [
      { role: "readWrite", db: "mymongo" }
    ],
  }
)
'