import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

let databaseUrl: string;

if (process.env.NODE_ENV === "production") {
  databaseUrl = process.env.PROD_DATABASE_URL || "";
} else {
  databaseUrl = process.env.DEV_DATABASE_URL || "";
}

const keepAliveInitialDelayInSeconds = 100;
const keepAliveInitialDelayInMilliseconds =
  keepAliveInitialDelayInSeconds * 1000;

const initMongoose = () => {
  mongoose.set("strictQuery", false);
  mongoose.connect(databaseUrl, {
    keepAlive: true,
    keepAliveInitialDelay: keepAliveInitialDelayInMilliseconds,
    // useUnifiedTopology: true,
    // useNewUrlParser: true,
    //!not supported anymore useFindAndModify: false,
  });

  // mongoose.connection.on("error", (err: any) => {
  //   console.log(chalk.bgRedBright.black("Mongoose has occured an error"));
  //   console.log(err.message);
  // });

  // mongoose.connection.on("open", (err: any) => {
  //   console.log(chalk.bgGreen.black("Mongoose is connected to MongoDB"));
  // });

  // process.on("SIGINT", async () => {
  //   await mongoose.connection.close();
  //   console.log(chalk.bgYellowBright.black("Mongoose has disconnected"));
  //   process.exit(0);
  // });
};

export default initMongoose;
