import express from 'express';
import { placeOrder, placeOrderRocket, placeOrderBkash, allOrders, userOrders, updateStatus } from '../controllers/orderController.js';
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';

const orderRouter = express.Router();

orderRouter.post('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus);

orderRouter.post('/place', authUser, placeOrder);
orderRouter.post('/rocket', authUser, placeOrderRocket);
orderRouter.post('/bkash', authUser, placeOrderBkash);

orderRouter.post('/userorders', authUser, userOrders);

export default orderRouter;
