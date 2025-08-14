import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.json({
                success: false,
                message: "Not Authorized Login Again",
            });
        }

        const token = authHeader.split(" ")[1]; // Remove "Bearer " part
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if this token is specifically for admin
        if (decoded !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.json({
                success: false,
                message: "Not Authorized Login Again",
            });
        }

        next();
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export default adminAuth;
