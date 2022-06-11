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
import {getAllGroups, updateGroup} from "./BL/groupsService";
import {rankByTags, getRestaurants} from "./BL/restaurantsBL";
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

const delayedRestaurantsCalc = new Map<string, ReturnType<typeof setTimeout>>();

function delayRestaurantsCalc(groupId: string, eventEmitCb: (restaurants: Restaurant[]) => void) {
  const prevDelayedCalculateRestaurants = delayedRestaurantsCalc.get(groupId);
  clearTimeout(prevDelayedCalculateRestaurants);

  const newDelayedCalculateRestaurants = setTimeout(async () => {
    const cachedGroup = groupsDataCache.get(groupId);
    const rankedRestaurants: Restaurant[] = await rankByTags(cachedGroup?.filters?.tags || [], cachedGroup?.members);
    eventEmitCb(rankedRestaurants);
  }, 100)

  delayedRestaurantsCalc.set(groupId, newDelayedCalculateRestaurants);
}


function createNewGroup(groupId: any, user: string) {
  const group: Group = {
    id: groupId,
    members: [{ username: user, active: true }],
    creator: user,
    filters: {},
  };

  groupsDataCache.set(groupId, group);

  return { ...group, restaurants: [] }
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

      const { restaurants, ...groupToSave } = extendedGroup;
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

  // Somebody entered the group room
  socket.on("joinGroup", async (data: any) => {
    const { user, groupId } = data;
    socket.join(groupId);

    let group: Group;

    if (groupsDataCache.has(groupId)) {
      group = groupsDataCache.get(groupId)!;

      const existingUser = group.members.find(memberObj => memberObj.username === user);
      if (existingUser) {
        existingUser.active = true;
      } else {
        //group.members = [...group.members, { username: user, active: true }];
        io.to(groupId).emit("newUser", user);
      }
    } else {
      group = createNewGroup(groupId, user);
    }

    groupsUserSocketId.set(socket.id, { user, groupId });

    io.to(groupId).emit("groupDataChanged", group);

    delayRestaurantsCalc(groupId, (rankedRestaurants) => {
      io.in(groupId).emit('restaurantsUpdate', rankedRestaurants)
    })

    console.log("joined group: " + groupId);

    updateGroup(groupId, group);
  });

  socket.on("filtersUpdate", async (data: Group) => {
    console.log('received filtersUpdate event')
    const { id: groupId } = data;
    groupsDataCache.set(groupId, data);

    io.in(groupId).emit("groupDataChanged", data);

    delayRestaurantsCalc(groupId, (rankedRestaurants) => {
      io.in(groupId).emit('restaurantsUpdate', rankedRestaurants)
    })
  });

  socket.on("disconnect", async () => {
    if (groupsUserSocketId.has(socket.id)) {
      const { user, groupId } = groupsUserSocketId.get(socket.id);

      const group = groupsDataCache.get(groupId)!;

      const existingUser = group.members.find(memberObj => memberObj.username === user);
      if (existingUser) {
        existingUser.active = false;
      }

      groupsUserSocketId.delete(socket.id);
      socket.to(groupId).emit("groupDataChanged", group);

      updateGroup(groupId, group);

      delayRestaurantsCalc(groupId, (rankedRestaurants) => {
        io.in(groupId).emit('restaurantsUpdate', rankedRestaurants)
      })
    }

    console.log("disconnected");
  });

  io.emit("connected");
});

const init = async (): Promise<void> => {
  await initLogger();
  await connectToDatabase();

  try {
    // initialize in-memory groups cache
    (await getAllGroups()).forEach((group:any) => {
      groupsDataCache.set(group.id, group);
    })
  } catch (err) {
    console.error('Failed initializing in-memory group cache')
  }

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
