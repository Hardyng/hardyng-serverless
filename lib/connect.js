import mongoose from "mongoose";
require("dotenv").config();

var cachedDb = null;
const MONGODB_URI = `mongodb+srv://${process.env.MONGO_ATLAS_USERNAME}:${
  process.env.MONGO_ATLAS_PASSWORD
}@hardyngapp-lbavh.mongodb.net/test?retryWrites=true`;

const connect = async function connectToDatabase(uri = MONGODB_URI) {
  if (cachedDb == null) {
    console.log("=> Creating new connection...");
    cachedDb = await mongoose.createConnection(MONGODB_URI, {
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0 // and MongoDB driver buffering
    });
    return Promise.resolve(cachedDb);
  }
  console.log("=> using cached database instance");
  return Promise.resolve(cachedDb);
};
export const curryDb = function provideDb(fn) {
  return async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    const db = await connect(MONGODB_URI);
    const reply = await fn({ db, event, context, callback });
    cachedDb.close();
    return reply;
  };
};

// export const closeConn = function closeConn(fn) {
//   return async (...props) => {
//     cachedDb.close();
//     return await fn(...props);
//   };
// };
