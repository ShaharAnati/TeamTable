import { Router } from "express";
import { uuid } from "uuidv4";

import GroupSchema from "../mongoose/GroupSchema";
import restaurants from "./restaurants.json";

const buildRouter = (): Router => {
    const router: Router = Router();

    router.get("/", async (req, res) => {
        try {
            return res.status(201).json(restaurants);
        } catch (error) { }
    });

    return router;
};

export default buildRouter;