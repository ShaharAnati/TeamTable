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
  address: {
    city: { type: String },
    country: { type: String },
    street: { type: String },
    house_number: { type: String },
  },
  location: {
    lat: { type: Number },
    lng: { type: Number }
  },
  contactInfo: {
    phoneNumber: { type: String },
    email: { type: String }
  },
  url: { type: String },
  isVerified: { type: Boolean },
  pricePoint: { type: Number }
});

const schema: any = mongoose.model("restaurants", restaurantSchema);

export const getAllRestaurants = async (): Promise<Restaurant[]> => {
  return ((await schema.find({})) as Document[]).map(rest => rest.toObject() as Restaurant);
}

export default schema;
