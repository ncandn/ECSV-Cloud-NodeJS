"use strict";

const router = require("express").Router();
const userController = require("../controllers/user");

router.post("/SaveUser", userController.saveUser);

module.exports = router;
