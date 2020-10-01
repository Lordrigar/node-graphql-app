#!/bin/bash
sleep 10

echo SETUP.sh time now: `date +"%T" `
docker exec $(docker ps -aqf "name=mongo1") mongo --eval '
  rs.initiate({"_id": "rs0",
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
    ]});
'
echo 'setup admin account'
docker exec $(docker ps -aqf "name=mongo1") mongo --eval '
admin = db.getSiblingDB("admin")
admin.createUser(
  {
    user: "root",
    pwd: "admin",
    roles: [ { role: "root", db: "admin" } ]
  }
)
'
echo 'setup user'
docker exec $(docker ps -aqf "name=mongo1") mongo --eval '
db.createUser(
  {
    user: "user",
    pwd: "password",
    roles:
    [
      { role: "readWrite", db: "mymongo" }
    ],
    mechanisms: [ "SCRAM-SHA-1" ] 
  }
)
'