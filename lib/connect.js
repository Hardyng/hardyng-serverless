import mongoose from 'mongoose';
require('dotenv').config()

let cachedDb = null;
const MONGODB_URI = `mongodb+srv://${process.env.MONGO_ATLAS_USERNAME}:${process.env.MONGO_ATLAS_PASSWORD}@hardyngapp-lbavh.mongodb.net/test?retryWrites=true`;

const connect = async function connectToDatabase (uri = MONGODB_URI) {
  cachedDb = await mongoose.createConnection(MONGODB_URI, {
    bufferCommands: false, // Disable mongoose buffering
    bufferMaxEntries: 0 // and MongoDB driver buffering
  });
  return Promise.resolve(cachedDb);
}
export const curryDb = function provideDb (fn) {
  return async(event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    if(cachedDb === null || !cachedDb.serverConfig.isConnected()){
      return await fn({db: await connect(MONGODB_URI), event, context, callback});
    }
    return await fn({db: cachedDb, event, context, callback});
  }
}
