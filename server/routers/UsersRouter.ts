import { Router } from "express";
import { Document } from "mongoose";
import { TagGroup } from "../models/Restaurant";

import UserSchema from "../mongoose/UserSchema";

const buildRouter = (): Router => {
  const router: Router = Router();

  router.patch("/like-restaurant", async (req, res) => {
    try {
      const { email, restaurant_id } = req.body;

      const user = await UserSchema.findOne({ email });

      if (!user.likedRestaurants.find((r: string) => r === restaurant_id)) {
        const newlikedRestaurants = [...user.likedRestaurants, restaurant_id];
        await UserSchema.findOneAndUpdate(
          { email },
          { likedRestaurants: newlikedRestaurants }
        );
      }
    } catch (error) {
      res.status(500).json([]);
    }
  });

  router.delete("/unlike-restaurant", async (req, res) => {
    try {
      const { email, restaurant_id } = req.body;

      const user = await UserSchema.findOne({ email });
      const newlikedRestaurants = user.likedRestaurants.filter(
        (r: string) => r !== restaurant_id
      );
      await UserSchema.findOneAndUpdate(
        { email },
        { likedRestaurants: newlikedRestaurants }
      );

      res.status(200);
    } catch (error) {
      res.status(200).json([]);
    }
  });

  return router;
};

export default buildRouter;
