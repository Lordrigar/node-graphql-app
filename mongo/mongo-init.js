db = db.getSiblingDB('mongodb')

db.createUser({
  user: 'user',
  pwd: 'password',
  roles: [
    {
      role: 'readWrite',
      db: 'mongodb',
    },
  ],
});

db.createCollection("test");