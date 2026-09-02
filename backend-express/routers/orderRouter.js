import express from "express";
import { createOrder } from "../controllers/orderController.js";
import { getAllOrders } from "../controllers/orderController.js";
import { updateOrderStatus } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/", createOrder);

orderRouter.get("/:pageNumber/:pageSize", getAllOrders);

orderRouter.put("/:orderId", updateOrderStatus);

export default orderRouter;