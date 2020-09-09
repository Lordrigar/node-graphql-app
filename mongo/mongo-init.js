db = db.getSiblingDB('mymongo');

db.createUser({
  user: 'user',
  pwd: 'password',
  roles: [
    {
      role: 'readWrite',
      db: 'mymongo',
    },
  ],
});
