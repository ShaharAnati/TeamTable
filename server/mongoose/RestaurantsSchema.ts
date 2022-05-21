import mongoose from "mongoose";
import { Document } from 'mongoose';
import { Restaurant } from "../models/Restaurant";

const restaurantSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String },
  description: { type: String },
  imgUrl: { type: String },
  tags: [{ type: String }],
  openingTimes: {
    "1": [{ type: String }],
    "2": [{ type: String }],
    "3": [{ type: String }],
    "4": [{ type: String }],
    "5": [{ type: String }],
    "6": [{ type: String }],
    "7": [{ type: String }],
  },
  location: { type: String },
  contactIndo: {
    phoneNumber: { type: String },
    email: { type: String }
  }  
});

const schema: any = mongoose.model("restaurants", restaurantSchema);

export const getAllRestaurants = async (): Promise<Restaurant[]> => {
  return ((await schema.find({})) as Document[]).map(rest => rest.toObject() as Restaurant);
}

export default schema;