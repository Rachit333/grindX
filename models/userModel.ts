import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String },
  photoURL: { type: String },
});

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
