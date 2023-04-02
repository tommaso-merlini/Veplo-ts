import { admin } from "../../firebase/firebase";
require("dotenv").config();

const canSee = async (creator: string, token: string) => {
  //if (process.env.NODE_ENV = environment) {
  const watcher = await admin.auth().verifyIdToken(token);

  console.log(watcher);
  console.log(creator);

  //if (creator == watcher.uid) {
  //  throw new Error("User not authorized");
  //}

  //return 0; //the user is authenticated

  //return 1; //the environment does not match
};

export default canSee;
