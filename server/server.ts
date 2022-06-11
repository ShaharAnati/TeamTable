import express from "express";
import * as bodyParser from "body-parser";

import {initLogger} from "./conf/Logger";
import {withAuth} from "./middlewares/auth";
import {connectToDatabase} from "./mongoose/DatabaseEndpoint";
import {ExtendedGroupData, Group} from "./models/Group";

import BuildResourceRouter from "./routers/ResourcesRouter";
import LoginRouter from "./routers/LoginRouter";
import GroupsRouter from "./routers/GroupsRouter";
import RestaurantsRouter from "./routers/RestaurantsRouter";
import TagsRouter from "./routers/TagsRouter";
import UsersRouter from "./routers/UsersRouter";
import AuthRouter from './routers/AuthenticationRouter';
import {updateGroup} from "./BL/groupsService";
import {rankByTags} from "./BL/restaurantsBL";
import {Restaurant} from "./models/Restaurant";
import GroupSchema from "./mongoose/GroupSchema";

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

function createNewGroup(groupId: any, user: string) {
  const group: Group = {
    id: groupId,
    members: [{username: user, active: true}],
    creator: user,
    filters: {},
  };

  groupsDataCache.set(groupId, group);

  return {...group, restaurants: []}
}

async function handleCreatorLeavingGroup(group: Group, socket: any, groupId: string) {
  if (group.members.length === 0) {
    await GroupSchema.deleteOne(group.id);
    groupsDataCache.delete(group.id);
  } else {
    group.creator = group.members[0].username;
    socket.to(groupId).emit("groupDataChanged", group);
    updateGroup(groupId, group);
  }
}

io.on("connection", (socket: any) => {
  console.log(socket.id);

  socket.on("addNewUser", async (data: any) => {
    const { user, groupId } = data;

    if (groupsDataCache.has(groupId)) {
      const group: Group = groupsDataCache.get(groupId)!;
      group.members = [...group.members, { username: user, active: true }];

      let extendedGroup: ExtendedGroupData = {
        ...group,
        restaurants: await rankByTags(data?.filters?.tags || [], data.members)
      };

      io.to(groupId).emit("groupDataChanged", extendedGroup);

      console.log("joined group: " + groupId);

      const { restaurants, ...groupToSave} = extendedGroup;
      updateGroup(groupId, groupToSave);
    }
  })

  socket.on("leaveGroup", async (data: any) => {
    const {user, groupId} = data;
    
    if (groupsDataCache.has(groupId)) {
      const group: Group = groupsDataCache.get(groupId)!;
      group.members = group.members.filter(member => member.username != user);

      if(group.creator && group.creator === user) {
        await handleCreatorLeavingGroup(group, socket, groupId);
      } else {
        socket.to(groupId).emit("groupDataChanged", group);
        updateGroup(groupId, group);
      }

      groupsUserSocketId.delete(socket.id);
    }
  })

  socket.on("joinGroup", async (data: any) => {
    const { user, groupId } = data;
    socket.join(groupId);

    let extendedGroup: ExtendedGroupData;

    if (groupsDataCache.has(groupId)) {
      const group: Group = groupsDataCache.get(groupId)!;

      const existingUser = group.members.find(memberObj => memberObj.username === user);
      if (existingUser) {
          existingUser.active = true;
      } else {
        //group.members = [...group.members, { username: user, active: true }];
        io.to(groupId).emit("newUser", user);
      }

      extendedGroup = {
        ...group,
        restaurants: await rankByTags(data?.filters?.tags || [], data.members)
      };
      
    } else {
      extendedGroup = createNewGroup(groupId, user);
    }    

    groupsUserSocketId.set(socket.id, { user, groupId });

    io.to(groupId).emit("groupDataChanged", extendedGroup);

    console.log("joined group: " + groupId);

    const { restaurants, ...groupToSave} = extendedGroup;
    updateGroup(groupId, groupToSave);
  });

  socket.on("filtersUpdate", async (data: Group) => {
    const { id: groupId } = data;
    groupsDataCache.set(groupId, data);

    const rankedRestaurants: Restaurant[] = await rankByTags(data?.filters?.tags || [], data.members);
    const dataToReturn: ExtendedGroupData = {
      restaurants: rankedRestaurants,
      ...data
    }

    io.to(groupId).emit("groupDataChanged", dataToReturn);
  });

  socket.on("disconnect", async () => {
    if (groupsUserSocketId.has(socket.id)) {
      const { user, groupId } = groupsUserSocketId.get(socket.id);

      const group = groupsDataCache.get(groupId)!;

      const existingUser = group.members.find(memberObj => memberObj.username === user);
      if (existingUser) {
        existingUser.active = false;
      }
      
      const extendedGroup: ExtendedGroupData = {...group, restaurants: []};
      if(group.members.some( u => u.active)) {
        extendedGroup.restaurants =  await rankByTags(group?.filters?.tags || [], group.members);
      }

      groupsUserSocketId.delete(socket.id);
      socket.to(groupId).emit("groupDataChanged", extendedGroup);

      updateGroup(groupId, group);
    }

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
