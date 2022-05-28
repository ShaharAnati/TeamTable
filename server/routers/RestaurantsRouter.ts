import { Request, Response, Router } from "express";
import { rankByTags } from "../BL/restaurantsBL";
import { Restaurant } from "../models/Restaurant";

import RestaurantsSchema from "../mongoose/RestaurantsSchema";

const buildRouter = (): Router => {
    const router: Router = Router();

    router.get("/", async (req, res) => {
        try {
            
            const restaurants = await RestaurantsSchema.find();
            
            return res.status(200).json(restaurants);
        } catch (error) { }
    });

    router.post("/", async (req, res) => {
        try {

            const restaurant  = req.body;

            const newRestaurant = await RestaurantsSchema.create(restaurant);
            
            return res.status(201).json(newRestaurant);
        } catch (error) { }
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