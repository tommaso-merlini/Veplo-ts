const mongoose = require("mongoose");
import chalk from "chalk";
require("dotenv").config();

let databaseUrl;

if (process.env.NODE_ENV === "production") {
  databaseUrl = process.env.PROD_DATABASE_URL;
} else {
  databaseUrl = process.env.DEV_DATABASE_URL;
}

const initMongoose = () => {
  mongoose.set("strictQuery", false);
  mongoose
    .connect(databaseUrl, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      //!not supported anymore useFindAndModify: false,
    })
    .catch((err: any) => {
      console.log(err.message);
    });

  mongoose.connection.on("error", (err: any) => {
    console.log(err.message);
  });

  mongoose.connection.on("open", (err: any) => {
    console.log(chalk.bgGreen.black("Mongoose is connected to MongoDB"));
  });

  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    process.exit(0);
  });
};

export default initMongoose;
