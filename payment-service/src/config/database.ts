import mongoose from "mongoose";
import { config } from "./config";

import { logger } from "@envy-core/common";

const connectDB = async () => {
  try {
    if (config.mongo.uri) {
      console.log(config.mongo.uri);

      await mongoose.connect(config.mongo.uri);
      logger.info("Payment Database connected");
    }
  } catch (error) {
    logger.error("MongoDB connection error");
    console.log(error);
  }
};

export default connectDB;
