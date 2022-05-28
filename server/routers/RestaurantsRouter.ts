import { Request, Response, Router } from "express";
import { uuid } from "uuidv4";
import { Restaurant } from "../../client/src/types/Resturants";
import { rankByTags } from "../BL/restaurantsBL";

import RestaurantsSchema from "../mongoose/RestaurantsSchema";

const buildRouter = (): Router => {
  const router: Router = Router();

  router.get("/", async (req, res) => {
    try {
        const unverified: boolean = ((req.query.unverified + '').toLowerCase() === 'true')

      const restaurants: Restaurant[] = await RestaurantsSchema.find();

      if (unverified) {
            return res.status(200).json(restaurants.filter(res => res.isVerified === false));
      }

      return res.status(200).json(restaurants);
    } catch (error) { }
  });

  router.post("/", async (req, res) => {
    try {
        const restaurant: Restaurant = req.body;

      const newRestaurant = await RestaurantsSchema.create({
          ...restaurant,
          id: uuid()
      });

      return res.status(201).json(newRestaurant);
    } catch (error) {
        console.log(error)
    }
  });

  router.patch("/:id/approve", async (req, res) => {
    try {
      const id = req.params.id;
      await RestaurantsSchema.findOneAndUpdate({ id: id }, { isVerified: true });

      return res.status(200);
    } catch (error) {
      return res.status(500);
    }
  });

  router.delete("/:id/decline", async (req, res) => {
    try {
      const id = req.params.id;
      await RestaurantsSchema.deleteOne({ id });

      return res.status(200);
    } catch (error) {
      return res.status(500);
    }
  });

  router.get("/:tags", async (req: Request, res: Response) => {
      try {
          const { tags } = req.params;
          const tagsToRankBy: string[] = (tags as string).split(',');
          console.log(`ranking by received tags: ${tags}`);

          const rankedRestaurants: Restaurant[] = await rankByTags(tagsToRankBy);
          res.status(200).json(rankedRestaurants);
      } catch (error) {
          console.error(error);
          res.status(500).json(error);
      }
  });

  return router;
};

export default buildRouter;
