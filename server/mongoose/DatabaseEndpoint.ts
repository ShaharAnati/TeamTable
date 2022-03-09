const mongoose = require("mongoose");
const { config } = require('dotenv'); 

export const connectToDatabase = async () => {
    mongoose
      .connect(process.env.MONGO_URI || 'mongodb+srv://admin:Aa123456@teamtable.mii7y.mongodb.net/TeamTable', {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then(() => {
        console.log("Successfully connected to database");
      })
      .catch((error: Error) => {
        console.log('error: ' + JSON.stringify(error));
        console.log("database connection failed. exiting now...");
        console.error(error);
        process.exit(1);
      });
  };