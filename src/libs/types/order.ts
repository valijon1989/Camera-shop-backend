import { OrderStatus } from "../enums/order";
import { Product } from "./product";
import { MongoId } from "./common";

export interface OrderItem {
  _id: MongoId;
  itemQuantity: number;
  itemPrice: number;
  orderId: MongoId;
  productId: MongoId;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  _id: MongoId;
  orderTotal: number;
  orderDelivery: number;
  orderStatus: OrderStatus;
  memberId: MongoId;
  createdAt: Date;
  updatedAt: Date;
  /** from aggrigation **/
  orderItems?: OrderItem[];
  productData?: Product[];
}

export interface OrderItemInput {
  itemQuantity: number;
  itemPrice: number;
  productId: MongoId;
  orderId?: MongoId;
}

export interface OrderInquiry {
  page: number;
  limit: number;
  orderStatus: OrderStatus;
}

export interface OrderUpdateInput {
  orderId: string;
  orderStatus: OrderStatus;
}
