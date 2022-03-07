const mongoose = require("mongoose");

export const connectToDatabase = async () => {
    console.log(process.env.MONGO_URI);
    // Connecting to the database
    mongoose
      .connect(process.env.MONGO_URI || "", {
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