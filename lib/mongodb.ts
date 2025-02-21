import mongoose, { Connection } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Missing MongoDB URI");
}

interface MongooseCache {
  conn: Connection | null;
  promise: Promise<typeof mongoose> | null;
}

// ✅ Correct global declaration using `var`
declare global {
  let mongoose: MongooseCache | undefined;
}

// ✅ Use nullish coalescing to initialize `global.mongoose`
global.mongoose = global.mongoose ?? { conn: null, promise: null };

async function connectDB(): Promise<Connection> {
  if (global.mongoose.conn) return global.mongoose.conn;

  if (!global.mongoose.promise) {
    global.mongoose.promise = mongoose.connect(MONGODB_URI, {
      dbName: "test", // ✅ Change this to your actual database name
      bufferCommands: false,
    }).then((mongooseInstance) => mongooseInstance.connection);
  }

  global.mongoose.conn = await global.mongoose.promise;
  return global.mongoose.conn;
}

export default connectDB;
