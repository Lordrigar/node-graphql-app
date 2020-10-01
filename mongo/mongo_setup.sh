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
    ]})
'