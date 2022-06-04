import { Router } from "express";

import UserSchema from "../mongoose/UserSchema";

const buildRouter = (): Router => {
  const router: Router = Router();

  router.get("/:email/all-liked-restaurants", async (req, res) => {
    try {
      const email  = req.params.email;
      const user = await UserSchema.findOne({ email });

      if (!user) {
        res.sendStatus(404);
      }

      res.status(200);
      res.send(user.likedRestaurants);
    } catch (error) {
      res.status(500);
    }
  });

  router.patch("/like-restaurant", async (req, res) => {
    try {
      const { email, restaurantId } = req.body;

      const user = await UserSchema.findOne({ email });

      if (!user) {
        res.sendStatus(404);
      }

      if (!user.likedRestaurants.find((currId: string) => currId === restaurantId)) {
        const newlikedRestaurants = [...user.likedRestaurants, restaurantId];
        await UserSchema.findOneAndUpdate(
          { email },
          { likedRestaurants: newlikedRestaurants }
        );
      }

      res.sendStatus(200)
    } catch (error) {
      res.status(500);
    }
  });

  router.patch("/unlike-restaurant", async (req, res) => {
    try {
      const { email, restaurantId } = req.body;

      const user = await UserSchema.findOne({ email });
      const newlikedRestaurants = user.likedRestaurants.filter(
        (r: string) => r !== restaurantId
      );
      await UserSchema.findOneAndUpdate(
        { email },
        { likedRestaurants: newlikedRestaurants }
      );

      res.sendStatus(200);
    } catch (error) {
      res.status(500);
    }
  });

  return router;
};

export default buildRouter;
