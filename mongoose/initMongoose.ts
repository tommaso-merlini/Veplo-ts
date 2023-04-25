import mongoose from "mongoose";
import dotenv from "dotenv";
import chalk from "chalk";
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
};

// If the connection throws an error
mongoose.connection.on("error", function (err: Error) {
  console.error(
    chalk.bgRed.black("Failed to connect to MongoDB on startup "),
    err
  );
});

mongoose.connection.on("connected", async function () {
  console.log(chalk.bgGreen.black("Mongoose is connected to MongoDB"));
});

// When the connection is disconnected
mongoose.connection.on("disconnected", function () {
  console.log(
    chalk.bgYellow.black(
      "Mongoose default connection to MongoDB is disconnected"
    )
  );
  initMongoose();
});

export default initMongoose;
