import mongoose from "mongoose";
import { Model } from "mongoose";
import { GroupLikedRestaurants } from "../models/Group";
import { User } from "../models/User";

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: { type: String },
  phoneNumber: {type: String },
  fullName: {type: String},
  tokens: {type:[String]},
  isAdmin: {type: Boolean, default: false },
  likedRestaurants: { type: [String] }
});

const schema = mongoose.model("users", userSchema);


export const getLikedRestaurantsByUserIds = async (usersEmail: string[]): Promise<GroupLikedRestaurants> => {
  const restaurantsLikes: GroupLikedRestaurants = {};

  const users: User[] = await schema.find({email: {$in : usersEmail}});

  users.forEach(user => {
      user.likedRestaurants.forEach(resId => {
        if(!restaurantsLikes[resId]) {
          restaurantsLikes[resId] = 0;
        }

        restaurantsLikes[resId]+=1;
      });
  });

  return restaurantsLikes;
}


export default schema;
