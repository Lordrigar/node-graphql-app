#!/bin/bash
cd .. && docker compose -f docker-compose-dev.yml exec mongo mongosh mymongo -u user -p password /fixtures/fixtures.js
