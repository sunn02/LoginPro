const express = require("express");
const router = express.Router();
const { jwt } = require("../helpers/jwt");
const Role = require("../helpers/role")
const Controller = require("../controllers/controller");
const rateLimit = require('express-rate-limit');
const { validateCSRFToken } = require("../helpers/csrfHandler");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // límite de 5 intentos
  message: "Demasiados intentos de inicio de sesión. Inténtelo de nuevo más tarde."
});

router.post("/signup", Controller.SignUp);
router.post("/login", loginLimiter, Controller.SignIn);
router.post("/logout", Controller.LogOut);
router.get("/profile",validateCSRFToken ,Controller.Authenticaded);
router.get("/users", jwt([Role.Admin]), validateCSRFToken, Controller.GetAll);


module.exports = router;