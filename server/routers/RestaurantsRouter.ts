import { Router } from "express";
import { uuid } from "uuidv4";

import RestaurantsSchema from "../mongoose/RestaurantsSchema";

const buildRouter = (): Router => {
    const router: Router = Router();

    router.get("/", async (req, res) => {
        try {
            
            const restaurants = await RestaurantsSchema.find();
            
            return res.status(201).json(restaurants);
        } catch (error) { }
    });

    return router;
};

export default buildRouter;