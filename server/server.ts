import express from "express";
import * as bodyParser from "body-parser";

import { initLogger } from "./conf/Logger";
import { withAuth } from "./middlewares/auth";
import { connectToDatabase } from "./mongoose/DatabaseEndpoint";
import { ExtendedGroupData, Group } from "./models/Group";

import BuildResourceRouter from "./routers/ResourcesRouter";
import LoginRouter from "./routers/LoginRouter";
import GroupsRouter from "./routers/GroupsRouter";
import RestaurantsRouter from "./routers/RestaurantsRouter";
import TagsRouter from "./routers/TagsRouter";
import UsersRouter from "./routers/UsersRouter";
import AuthRouter from './routers/AuthenticationRouter';
import { updateGroup } from "./BL/groupsService";
import { rankByTags } from "./BL/restaurantsBL";
import { Restaurant } from "./models/Restaurant";

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");

require("dotenv").config();

const app: express.Application = express();
const { Server } = require("socket.io");

const httpServer = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});

const io = new Server(httpServer);

const groupsDataCache = new Map<string, Group>();

const groupsUserSocketId = new Map();

io.on("connection", (socket: any) => {
  console.log(socket.id);

  socket.on("joinGroup", (data: any) => {
    const { user, groupId } = data;
    socket.join(groupId);

    let group: Group;

    if (groupsDataCache.has(groupId)) {
      group = groupsDataCache.get(groupId)!;

      const existingUser = group.members.find(memberObj => memberObj.username === user);
      if (existingUser) {
        existingUser.active = true;
      } else {
        group.members = [...group.members, { username: user, active: true }];
      }

    } else {
      group = {
        id: groupId,
        members: [{ username: user, active: true }],
        creator: user,
        filters: {},
      };

      groupsDataCache.set(groupId, group);
    }

    groupsUserSocketId.set(socket.id, { user, groupId });

    io.to(groupId).emit("groupDataChanged", group);

    console.log("joined group: " + groupId);
    updateGroup(groupId, group);
  });

  socket.on("filtersUpdate", async (data: Group) => {
    const { id: groupId } = data;
    groupsDataCache.set(groupId, data);

    const rankedRestaurants: Restaurant[] = await rankByTags(data?.filters?.tags || []);
    const dataToReturn: ExtendedGroupData = {
      restaurants: rankedRestaurants,
      ...data
    }

    io.to(groupId).emit("groupDataChanged", dataToReturn);
  });

  socket.on("disconnect", () => {
    if (groupsUserSocketId.has(socket.id)) {
      const { user, groupId } = groupsUserSocketId.get(socket.id);

      const group = groupsDataCache.get(groupId)!;

      const existingUser = group.members.find(memberObj => memberObj.username === user);
      if (existingUser) {
        existingUser.active = false;
      }

      // group.members.splice(group.members.indexOf(user), 1);

      groupsUserSocketId.delete(socket.id);
      socket.to(groupId).emit("groupDataChanged", group);
      updateGroup(groupId, group);
    }

    // TODO
    // maybe at this point do saving of group to DB

    console.log("disconnected");
  });

  io.emit("connected");
});

const init = async (): Promise<void> => {
  await initLogger();
  await connectToDatabase();

  app.use(bodyParser.json());

  app.use(LoginRouter());
  app.use("/groups", GroupsRouter());
  app.use("/restaurants", RestaurantsRouter());
  app.use("/tags", TagsRouter());
  app.use("/users", UsersRouter());
  app.use("/auth", withAuth, AuthRouter());

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.post("/welcome", (req, res) => {
    res.status(200).send("Welcome 🙌 ");
  });

  app.use(BuildResourceRouter());

};

init();

export default app;
