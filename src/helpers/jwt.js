var { expressjwt: jwt } = require("express-jwt");
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();

exports.jwt = (roles = []) => {
  // roles param can be a single role string (e.g. Role.User or 'User')
  // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
  if (typeof roles === "string") {
    roles = [roles];
  }


  return [
    // 1. Authenticate JWT token and attach user to request object (req.user)
    jwt({ secret: process.env.SECRET_KEY, algorithms: ["HS256"] }),

    // 2. Authorize based on user role
    async (req, res, next) => {
      console.log("JWT user:", req.user);

        try {
          if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: No user found in JWT" });
            }
            
            // Buscar al usuario en la base de datos
            const user = await prisma.user.findUnique({
              where: { id: req.user.sub }, // `sub` : ID del usuario
            });
    
            // Verifica si el usuario existe y si tiene un rol permitido
            if (!user || (roles.length && !roles.includes(user.role))) {
              return res.status(403).json({ message: "Only Admin is Authorized!" });
            }
    
            // Si el usuario está autorizado, pasa a la siguiente función
            req.user.role = user.role;
            next();
          } 
          catch (error) {
            return res.status(500).json({ message: "Internal Server Error", error: error.message });
          }
        },
      ];
    };

