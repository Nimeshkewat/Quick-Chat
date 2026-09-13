import mongoose from "mongoose";

export const connectDb = async () => {
  if (!process.env.MONGO_URI) {
    console.log("Mongo Uri is not defined");
    return;
  }
  try {
    mongoose.connection.on("connected", () => {
      console.log("Db Connected");
    });
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.log(`Error connecting to db: ${error}`);
  }
};
