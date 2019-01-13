const { success, failure } = require('../../lib/response-lib');
var mongoose = require('mongoose');
require('dotenv').config()
const MONGODB_URI = `mongodb+srv://${process.env.MONGO_ATLAS_USERNAME}:${process.env.MONGO_ATLAS_PASSWORD}@hardyngapp-lbavh.mongodb.net/test?retryWrites=true`;
let cachedDb = null;

async function connectToDatabase (uri) {
  if (cachedDb && cachedDb.serverConfig.isConnected()) {
    console.log('=> using cached database instance');
    return Promise.resolve(cachedDb);
  }
  cachedDb = await mongoose.createConnection(MONGODB_URI, {
    bufferCommands: false, // Disable mongoose buffering
    bufferMaxEntries: 0 // and MongoDB driver buffering
  });
  return Promise.resolve(cachedDb);
}
function queryDatabase (db) {
  console.log('=> query database');
  db.model('Test', new mongoose.Schema({ name: String }));
  return db.model('Test').findOne()
    .then(() => { return success({message: 'success'}) })
    .catch(err => {
      console.log('=> an error occurred: ', err);
      return failure({ body: 'error' });
    });
}
export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return await queryDatabase(await connectToDatabase(MONGODB_URI));
};
