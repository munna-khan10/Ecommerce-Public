import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true, min: 0 },
    address: { type: Object, required: true },
    status: { type: String, required: true, default: 'Order Placed' },
    paymentMethod: { type: String, enum: ['cod', 'bkash', 'rocket'], required: true, default: 'cod' },
    paymentStatus: { type: String, enum: ['unpaid', 'pending', 'paid', 'failed'], default: 'unpaid' },
    payment: { type: Boolean, default: false },
    transactionId: { type: String, default: '' },
    date: { type: Number, default: Date.now }
}, { timestamps: true });

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema);
export default orderModel;
