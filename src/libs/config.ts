export const AUTH_TIMER = 24;
export const MORGAN_FORMAT = `:method :url :response-time [:status] \n`;

import mongoose, { Types } from "mongoose";
import { MongoId } from "./types/common";

export function shapeIntroMongooseObjectId(target: MongoId): Types.ObjectId {
  return typeof target === "string"
    ? new mongoose.Types.ObjectId(target)
    : target;
}
