import express from "express";
import * as bodyParser from 'body-parser';

import {initLogger} from "./conf/Logger";
import {withAuth} from './middlewares/auth'
import {connectToDatabase} from './mongoose/DatabaseEndpoint';
import {Group} from "./models/Group";

import BuildResourceRouter from './routers/ResourcesRouter';
import LoginRouter from './routers/LoginRouter';
import GroupsRouter from './routers/GroupsRouter';
import RestaurantsRouter from "./routers/RestaurantsRouter";

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json")

require('dotenv').config();

const app: express.Application = express();
const { Server } = require('socket.io');

const httpServer = app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`)
});

const io = new Server(httpServer);

io.on('connection', (socket: any) => {
    console.log(socket.id);
    socket.on('joinGroup', (groupId: string) => {
        socket.join(groupId);
        console.log("joined group: " + groupId);
    })

    socket.on("groupUpdate", (data: Group) => {
        socket.to(data.id).emit("updateClient", data);
    });

    socket.on('disconnect', () => {
        console.log('disconnected');
    });

    io.emit('connected')
});

const init = async (): Promise<void> => {

    await initLogger();
    await connectToDatabase();

    app.use(bodyParser.json());

    app.use(LoginRouter());
    app.use('/groups', GroupsRouter(io));
    app.use('/restaurants', RestaurantsRouter());

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
}

init();

export default app;