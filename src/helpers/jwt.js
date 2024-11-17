require('dotenv').config();
console.log('SECRET_KEY:', process.env.JWT_SECRET); 
const jwt = require("jsonwebtoken");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.jwt = (roles = []) => {
  // roles param can be a single role string (e.g. Role.User or 'User')
  // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
  if (typeof roles === "string") {
    roles = [roles];
  }
  return [
    (req, res, next) => {

      if (req.session.user) {
        // Si la sesión existe, autentica al usuario
        req.user = req.session.user;
        return next();
      }

      const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

      if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
      }

      // Se decodifica el token manualmente para verificar su contenido
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded JWT:', decoded); // Ver el payload decodificado
        req.user = decoded;
        next();
      } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
      }
    },

    async (req, res, next) => {
      console.log("JWT user:", req.user);

      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: No user found in JWT" });
      }

      try {
        const user = await prisma.user.findUnique({
          where: { id: req.user.sub },
        });

        if (!user || (roles.length && !roles.includes(user.role))) {
          return res.status(403).json({ message: "Forbidden" });
        }

        req.user.role = user.role;
        next();
      } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
      }
    },
  ];
};