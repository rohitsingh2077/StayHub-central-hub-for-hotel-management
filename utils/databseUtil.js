const { MongoClient } = require('mongodb');

// Use environment variable if available, otherwise fall back to the hard-coded URI.
// (In production, put credentials in env vars or a secrets manager.)
const Mongo_URL = process.env.MONGO_URL || "mongodb+srv://root:root@rohitsingh.oa2ul7f.mongodb.net/?retryWrites=true&w=majority&appName=RohitSingh";

let _db;

const mongoconnect = (callback) => {
  MongoClient.connect(Mongo_URL)
    .then(client => {
      // store the database instance first
      _db = client.db('airbnb');
      console.log('Connected to MongoDB');
      // then call the callback (e.g. start the server)
      if (typeof callback === 'function') callback();
    })
    .catch(err => {
      console.error('Error while connecting to MongoDB:', err);
    });
};

const getDB = () => {
  if (!_db) {
    throw new Error('MongoDB not connected');
  }
  return _db;
};

module.exports = { mongoconnect, getDB };
