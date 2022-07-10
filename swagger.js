const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Team Table API",
    description: "api of project teamtable",
  },

  host: "localhost:3000",
  schemes: ["http"],
  definitions: {
    Restaurant: {
      openingTimes: {
        1: ["11:00", "00:00"],
        2: ["11:00", "00:00"],
        3: ["11:00", "00:00"],
        4: ["11:00", "00:00"],
        5: ["12:00", "00:00"],
        6: ["12:00", "00:00"],
        7: ["12:00", "00:00"],
      },
      location: {
        lat: 32.09014,
        lng: 34.77385,
      },
      contactInfo: {
        phoneNumber: "+97236969629",
        email: "",
      },
      name: "Wok Republic",
      description: "Street food",
      tags: ["street-food", "asian", "thai", "vegan"],
      imgUrl:
        "https://imageproxy.wolt.com/venue/5df7ae7668e0074e549b36c3/c5924ede-2a4b-11ea-b1b0-0a58646cbf5f_yaelitz.jpg",
      id: "3",
      pricePoint: 3,
      url: "www.good.com",
    },
  },
};

const outputFile = "./swagger.json";
const endpointsFiles = [
  "./server/server.ts",
  //   "./server/routers/LoginRouter.ts",
  //   "./server/routers/GroupsRouter.ts",
  //   "./server/routers/TagsRouter.ts",
  //   "./server/routers/UsersRouter.ts",
  //   "./server/routers/RestaurantsRouter.ts",
];

swaggerAutogen(outputFile, endpointsFiles, doc);
