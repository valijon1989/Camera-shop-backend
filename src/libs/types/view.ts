import { ViewGroup } from "../enums/view.enum";
import { MongoId } from "./common";

export interface View {
  _id: MongoId;
  viewGroup: ViewGroup;
  memberId: MongoId;
  viewRefId: MongoId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ViewInput {
  memberId: MongoId;
  viewRefId: MongoId;
  viewGroup: ViewGroup;
}
