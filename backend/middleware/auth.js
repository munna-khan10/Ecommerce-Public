import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    const token = req.headers.token || req.headers.authorization?.replace(/^Bearer\s+/i, '');
    if (!token) {
        return res.status(401).json({ success: false, message: 'Not Authorized. Please login again.' });
    }
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = token_decode;
        req.body = req.body || {};
        req.body.userId = token_decode.id;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};

export default authUser;
