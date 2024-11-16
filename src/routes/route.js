const express = require("express");
const router = express.Router();
const { jwt } = require("../helpers/jwt");
const Role = require("../helpers/role")
const Controller = require("../controllers/controller");


router.post("/Registro", Controller.SignUp);
router.post("/Login", Controller.SignIn);
router.get("/Users", jwt([Role.Admin]), Controller.GetAll)
module.exports = router;