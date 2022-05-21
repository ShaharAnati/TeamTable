import mongoose from "mongoose";

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
    houseNumber: { type: String },
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
  isVerified: { type: Boolean }
});

const schema: any = mongoose.model("restaurants", restaurantSchema);

export default schema;