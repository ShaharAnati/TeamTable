import { Router } from "express";
import { uuid } from "uuidv4";

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

    return router;
};

export default buildRouter;