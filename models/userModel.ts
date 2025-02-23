import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  profilePicture: { type: String },
  codingHandles: {
    leetcode: { type: String, default: "" },
    codeforces: { type: String, default: "" },
    codechef: { type: String, default: "" },
    geeksforgeeks: { type: String, default: "" },
    atcoder: { type: String, default: "" },
    hackerrank: { type: String, default: "" },
    spoj: { type: String, default: "" },
    other: { type: String, default: "" },
  },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);
