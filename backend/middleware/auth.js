import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "Authorization header missing or malformed",
                });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = { id: decoded.id };
        next();
    } catch (err) {
        return res
            .status(401)
            .json({
                success: false,
                message:
                    err.name === "TokenExpiredError"
                        ? "Token expired"
                        : "Invalid token",
            });
    }
};

export default authUser;
