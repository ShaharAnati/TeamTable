import mongoose from "mongoose";
import { Model } from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: { type: String },
  phoneNumber: { type: String },
  fullName: { type: String },
  tokens: { type: [String] },
  likedRestaurants: { type: [String] },
});

const schema = mongoose.model("users", userSchema);

export default schema;
