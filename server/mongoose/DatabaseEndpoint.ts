const mongoose = require("mongoose");

export const connectToDatabase = async () => {
    require('dotenv').config();
    console.log(process.env.MONGO_URI);
    // Connecting to the database
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