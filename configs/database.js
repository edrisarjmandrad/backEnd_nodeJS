import mongodb from "mongodb";
import dotenv from 'dotenv'
const MongoClient = mongodb.MongoClient;

dotenv.config()
let _db;
console.log(process.env.MONGO_URI);

export const mongoConnect = (callback) => {
  MongoClient.connect(process.env.MONGO_URI)
    .then((client) => {
      console.log("Connected!");
      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

export const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found!";
};
