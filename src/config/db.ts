import mongoose from "mongoose";
import { MONGO_URI } from "./env";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
  } catch (err: any) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;
