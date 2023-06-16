import mongodb from "mongodb";

const { MongoClient } = mongodb;
let client;

export const connectDB = async() => {
  try{
    client = await MongoClient.connect(process.env.DB_URI);
    console.log("DataBase Connected Successfully");
  }
  catch(err){
    console.log(err);
    throw err;
  }
};

export const getDB = () => {
  if (!client) {
    throw new Error("Database Not Connected");
  }
  return client.db();
};
