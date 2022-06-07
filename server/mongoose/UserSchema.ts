import mongoose from "mongoose";
import { Model } from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: { type: String },
  phoneNumber: {type: String },
  fullName: {type: String},
  tokens: {type:[String]},
  isAdmin: {type: Boolean, default: false }
});

const schema = mongoose.model("users", userSchema);

export default schema;