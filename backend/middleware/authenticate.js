const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token is missing or invalid' });
    }

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user data to the request object
        req.user = { id: decoded.id, role: decoded.role };

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

// Middleware to check if the user is an Admin
const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Access denied. Admins only' });
    }

    next(); // Proceed to the next middleware or route handler
};

// Middleware to check if the user is a Customer
const authorizeCustomer = (req, res, next) => {
    if (req.user.role !== 'Customer') {
        return res.status(403).json({ message: 'Access denied. Customers only' });
    }

    next(); // Proceed to the next middleware or route handler
};

module.exports = { authenticateUser, authorizeAdmin, authorizeCustomer };
