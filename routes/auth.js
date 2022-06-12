"use strict";

const router = require("express").Router();
const userController = require("../controllers/user");
const middleware = require("../scripts/middleware/token");

router.post("/LoginUser", userController.loginUser);

router.post("/SaveUser", userController.saveUser);

router.post("/AddDevice", middleware.verifyToken, userController.addDevice);

router.post("/RemoveDevice", middleware.verifyToken, userController.removeDevice);

module.exports = router;
