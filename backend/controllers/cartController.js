import UserModel from "../models/userModel.js";

const getUser = async (userId) => {
    if (!userId) return null;
    return UserModel.findById(userId);
};

const addToCart = async (req, res) => {
    try {
        const userId = req.user?.id || req.body.userId;
        const { itemId, size } = req.body;
        if (!itemId || !size) return res.status(400).json({ success: false, message: "Product and size are required" });

        const userData = await getUser(userId);
        if (!userData) return res.status(404).json({ success: false, message: "User not found" });

        const cartData = userData.cartData || {};
        cartData[itemId] ||= {};
        cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
        await UserModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Added To Cart", cartData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateCart = async (req, res) => {
    try {
        const userId = req.user?.id || req.body.userId;
        const { itemId, size, quantity } = req.body;
        const userData = await getUser(userId);
        if (!userData) return res.status(404).json({ success: false, message: "User not found" });

        const cartData = userData.cartData || {};
        if (!cartData[itemId]) cartData[itemId] = {};
        const qty = Math.max(0, Number(quantity));
        if (qty === 0) {
            delete cartData[itemId][size];
            if (!Object.keys(cartData[itemId]).length) delete cartData[itemId];
        } else {
            cartData[itemId][size] = qty;
        }

        await UserModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Cart Updated", cartData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getUserCart = async (req, res) => {
    try {
        const userId = req.user?.id;
        const userData = await getUser(userId);
        if (!userData) return res.status(404).json({ success: false, message: "User not found" });
        res.json({ success: true, cartData: userData.cartData || {} });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { addToCart, updateCart, getUserCart };
