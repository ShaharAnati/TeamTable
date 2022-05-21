import { Router } from "express";
import { uuid } from "uuidv4";
import { Restaurant } from "../../client/src/types/Resturants";

import RestaurantsSchema from "../mongoose/RestaurantsSchema";

const buildRouter = (): Router => {
    const router: Router = Router();

    router.get("/", async (req, res) => {
        try {
            const unverified: boolean = ((req.query.unverified + '').toLowerCase() === 'true')

            const restaurants: Restaurant[] = await RestaurantsSchema.find();

            if (unverified) {
                return res.status(200).json(restaurants.filter(res => !res.isVerified));
            }

            return res.status(200).json(restaurants);
        } catch (error) { }
    });

    router.post("/", async (req, res) => {
        try {

            const restaurant = req.body;

            const newRestaurant = await RestaurantsSchema.create(restaurant);

            return res.status(201).json(newRestaurant);
        } catch (error) { }
    });


    router.patch("/:id/approve", async (req, res) => {
        try {

            const restaurant = req.body;

            //update to verified
            // const newRestaurant = await RestaurantsSchema.updateOne(restaurant);

            return res.status(200);
        } catch (error) { }
    });


    router.delete("/:id/decline", async (req, res) => {
        try {

            const restaurant = req.body;

            //delete restaurant
            // const newRestaurant = await RestaurantsSchema.updateOne(restaurant);

            return res.status(200);
        } catch (error) { }
    });




    return router;
};

export default buildRouter;