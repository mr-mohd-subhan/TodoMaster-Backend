import jwt from 'jsonwebtoken'
export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ success: false, message: "User not authenticated" })
        }
        jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
            if (error) {
                return res.status(401).json({ success: false, message: "Token is invalid" })
            }
            req.userId = decoded.id;
            next()
        });
    } catch (error) {
        console.error("Error in authentication middleware:", error);
        res.status(500).json({ message: 'Server error' });
    }
}