import mongoose, { Schema } from "mongoose";

const orderItemSchema = new Schema(
  {
    itemQuantity: {
      type: Number,
      required: true,
    },

    itemPrice: {
      type: Number,
      required: true,
    },

    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },

    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  { timestamps: true, collection: "orderItems" }
  /* updatedAt & createdAt ni qoyib beradi,
  quyida "OrderItem" ni => "orderitems" nomi bilan avtomatik
  collecton databaseda hosil boladi
  timestamps: true, collection: "collection name"
  qilish orqali collectionga ozmiz yoqqan nomni qoysak boladi*/
);
export default mongoose.model("OrderItem", orderItemSchema);
