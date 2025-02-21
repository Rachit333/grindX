import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Missing MongoDB URI");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// ✅ Properly extend `globalThis`
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

// ✅ Use `globalThis` instead of `global`
globalThis.mongoose = globalThis.mongoose ?? { conn: null, promise: null };

async function connectDB(): Promise<typeof mongoose> {
  if (globalThis.mongoose!.conn) return globalThis.mongoose!.conn;

  if (!globalThis.mongoose!.promise) {
    globalThis.mongoose!.promise = mongoose.connect(MONGODB_URI, {
      dbName: "test",
      bufferCommands: false,
    });
  }

  globalThis.mongoose!.conn = await globalThis.mongoose!.promise;
  return globalThis.mongoose!.conn;
}

export default connectDB;
