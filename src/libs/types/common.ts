import { Types } from "mongoose";

export interface T {
  [key: string]: any;
}

export type MongoId = Types.ObjectId | string;
