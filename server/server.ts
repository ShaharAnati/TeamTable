import express from "express";
import * as bodyParser from 'body-parser';
import { initLogger } from "./conf/Logger";
import BuildResourceRouter from './routers/ResourcesRouter';
import LoginRouter from './routers/LoginRouter';
import GroupsRouter from './routers/GroupsRouter';

import { withAuth } from './middlewares/auth'
import { connectToDatabase } from './mongoose/DatabaseEndpoint';
import RestaurantsRouter from "./routers/RestaurantsRouter";

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json")

require('dotenv').config();

const app: express.Application = express();

const init = async (): Promise<void> => {

    await initLogger();
    await connectToDatabase();

    app.use(bodyParser.json());

    app.use(LoginRouter());
    app.use('/groups', GroupsRouter());
    app.use("/restaurants", RestaurantsRouter());
    // app.use(withAuth);

    app.use(
        '/api-docs',
        swaggerUi.serve,
        swaggerUi.setup(swaggerDocument)
    )

    app.post('/welcome', withAuth, (req, res) => {
        res.status(200).send("Welcome 🙌 ");
    });

    app.use(BuildResourceRouter());

    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running on port ${process.env.PORT || 3000}`)
    })
}


init();

export default app;