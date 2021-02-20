const mongoose = require('mongoose');

const connectDB = () => {
  const options = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
  };

  mongoose.connect(process.env.DB, options);
};

const connection = () => {
  connectDB();

  mongoose.connection.on('error', e => {
    console.error('[MongoDB] Something went super wrong!', e);
    setTimeout(() => {
      connection();
    }, 5000);
  });

  mongoose.connection.on('disconnected', () => {
    setTimeout(() => {
      connection();
    }, 5000);
  });

  mongoose.connection.on('connected', () => {
    console.log('Connected to DB!');
  });
};

module.exports = connection;
