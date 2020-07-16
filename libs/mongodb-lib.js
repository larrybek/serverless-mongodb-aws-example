import log from './logger';

const { MongoClient } = require('mongodb');
const assert = require('assert');

// Connection URL
const url = process.env.MONGODB_URL;

export const initialize = async (event, context, dbName) => new Promise((resolve, reject) => {
  try {
    if (context) {
      context.callbackWaitsForEmptyEventLoop = false;//eslint-disable-line
    }
    if (event) {
      log.info('EVENT', JSON.stringify(event));
    }

    // Use connect method to connect to the server
    MongoClient.connect(url, (err, client) => {
      assert.equal(null, err);
      log.info('Connected successfully to server');

      const db = client.db(dbName);
      resolve(db);
    });
  } catch (e) {
    reject(e);
  }
});
