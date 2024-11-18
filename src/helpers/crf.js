// REVISAR!!! 
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Middleware to check CSRF Token
exports.csrfProtection = async (req, res, next) => {
    // Get the CSRF token from the cookie
    const csrfToken = req.cookies.csrf_token; // Assuming you're using a cookie named csrf_token

    if (!csrfToken) {
        return res.status(403).json({ message: "CSRF token missing" });
    }

    // Retrieve the user from the database
    const user = await prisma.user.findUnique({
        where: { id: req.user.sub }, });
        
    if (!user || user.csrfToken !== csrfToken) {
        return res.status(403).json({ message: "Invalid CSRF token" });
    }

    next(); // Continue if the token is valid
};

