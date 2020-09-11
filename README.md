![Node.js CI](https://github.com/Lordrigar/node-graphql-app/workflows/Node.js%20CI/badge.svg?branch=master)
# Node and graphql app

Skeleton app for graphql setup, including mongo memory db, testing setup and auth with passport. There are currently two graphql routes.  
One without auth and second that requires authentication.

Tests can be run from `/app` directory without starting docker containers (thanks to Mongo memory server)

## Scripts

```javascript
  npm run test

  npm run pm2

  npm run pm2:dev
```

## Fixtures and db seeding

Basic data fixtures can be imported to db and removed by running respected files inside `/fixtures` folder

```bash
  ./run_fixtures.sh

  ./drop_collections.sh
```
