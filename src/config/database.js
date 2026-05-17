import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let connectionPromise = null;

const connectDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("Missing MONGODB_URI environment variable");
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
  }

  await connectionPromise;
  console.log("Connected to MongoDB");
  return mongoose.connection;
};

export default connectDatabase;
