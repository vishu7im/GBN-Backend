import mongoose from "mongoose";

const { Schema } = mongoose;

// admin AdminSchema
const AdminSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  flag: {
    type: Boolean,
  },
});
// Define the user schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  rollNo: {
    type: String,
    required: true,
  },
  batch: {
    type: String,
    required: true,
  },
  profession: {
    type: String,
    required: true,
  },
  profile: {
    type: String,
  },
  proof: {
    type: String,
    required: true,
  },
  linkdln: {
    type: String,
  },
  facebook: {
    type: String,
  },
  twitter: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  about: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

// Create the user model
export const TempUser = mongoose.model("TempUser", UserSchema);
export const User = mongoose.model("User", UserSchema);
export const Admin = mongoose.model("admin", AdminSchema);
