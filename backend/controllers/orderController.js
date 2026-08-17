import orderModel from "../models/orderModel.js";
import UserModel from "../models/userModel.js";
import productModel from "../models/productModel.js";

const normalizeMethod = (value) => {
    const method = String(value || 'cod').toLowerCase();
    return ['cod', 'bkash', 'rocket'].includes(method) ? method : 'cod';
};

const placeOrder = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { items = [], amount, address, paymentMethod, transactionId = '' } = req.body;
        const method = normalizeMethod(paymentMethod);

        if (!userId) return res.status(401).json({ success: false, message: 'Authentication required' });
        if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ success: false, message: 'Your cart is empty' });
        if (!address || typeof amount !== 'number' || amount <= 0) return res.status(400).json({ success: false, message: 'Invalid order data' });
        if (method !== 'cod' && !transactionId.trim()) {
            return res.status(400).json({ success: false, message: 'Transaction ID is required for this payment method' });
        }

        // Validate products before clearing the cart.
        for (const item of items) {
            const product = await productModel.findById(item._id || item.id);
            if (!product) return res.status(400).json({ success: false, message: `Product not found: ${item.name || ''}` });
            const qty = Number(item.quantity);
            if (!Number.isInteger(qty) || qty < 1) return res.status(400).json({ success: false, message: 'Invalid item quantity' });
            // Only enforce stock when a positive stock value has been configured.
            if (product.stock > 0 && product.stock < qty) {
                return res.status(400).json({ success: false, message: `${product.name} is out of stock or has insufficient stock` });
            }
        }

        // Reduce configured stock.
        for (const item of items) {
            const productId = item._id || item.id;
            const product = await productModel.findById(productId);
            if (product && product.stock > 0) {
                product.stock -= Number(item.quantity);
                await product.save();
            }
        }

        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: method,
            paymentStatus: method === 'cod' ? 'unpaid' : 'pending',
            payment: method === 'cod',
            transactionId: transactionId.trim(),
            status: 'Order Placed',
            date: Date.now()
        };

        const newOrder = await orderModel.create(orderData);
        await UserModel.findByIdAndUpdate(userId, { cartData: {} });

        res.status(201).json({
            success: true,
            message: method === 'cod' ? 'Order placed successfully' : 'Order placed. Payment is pending verification.',
            order: newOrder
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const placeOrderRocket = async (req, res) => placeOrder(req, res);
const placeOrderBkash = async (req, res) => placeOrder(req, res);

const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({}).sort({ date: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const userOrders = async (req, res) => {
    try {
        const userId = req.user?.id;
        const orders = await orderModel.find({ userId }).sort({ date: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateStatus = async (req, res) => {
    try {
        const { orderId, status, paymentStatus } = req.body;
        const allowed = ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];
        if (!allowed.includes(status)) return res.status(400).json({ success: false, message: 'Invalid order status' });

        const update = { status };
        if (paymentStatus && ['unpaid', 'pending', 'paid', 'failed'].includes(paymentStatus)) {
            update.paymentStatus = paymentStatus;
            update.payment = paymentStatus === 'paid';
        }

        const order = await orderModel.findByIdAndUpdate(orderId, update, { new: true });
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        res.json({ success: true, message: 'Order updated', order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { placeOrder, placeOrderRocket, placeOrderBkash, allOrders, userOrders, updateStatus };
