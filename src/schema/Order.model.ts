import mongoose, { Schema } from "mongoose";
import { OrderStatus } from "../libs/enums/order";

const orderSchema = new Schema(
  {
    orderTotal: {
      type: Number,
      required: true,
    },

    orderDelivery: {
      type: Number,
      required: true,
    },

    orderStatus: {
      type: String,
      enum: OrderStatus,
      default: OrderStatus.PAUSE,
    },

    memberId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Member",
    },
  },
  { timestamps: true }
  /* updatedAt & createdAt ni qoyib beradi,
  quyida "Member" ni => members nomi bilan avtomatik
  collecton databaseda hosil boladi
  timestamps: true, collection: "collection name"
  qilish orqali collectionga ozmiz yoqqan nomni qoysak boladi*/
);
export default mongoose.model("Order", orderSchema);
