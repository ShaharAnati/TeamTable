const mongoose = require("mongoose");

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
  },
  location: { type: String },
  contactIndo: {
    phoneNumber: { type: String },
    email: { type: String }
  }  
});

const schema: any = mongoose.model("restaurants", restaurantSchema);

export default schema;