# Node and graphql app

Skeleton app for graphql setup, including mongo memory db, testing setup and auth with passport. There are currently two graphql routes.  
One without auth and second that requires authentication.

There is a very lazy and horrible fixture located in models/index just for some sample data.

Tests can be run from `/app` directory without starting docker containers (thanks to Mongo memory server)

## Scripts

```javascript
  npm run test

  npm run pm2

  npm run pm2:dev
```
