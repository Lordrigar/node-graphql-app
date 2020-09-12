#!/bin/bash
cd .. && docker-compose -f docker-compose-dev.yml exec mongo mongo mymongo -u user -p password /fixtures/fixtures.js