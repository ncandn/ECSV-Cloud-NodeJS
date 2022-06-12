"use strict";

const router = require("express").Router();
const edgeController = require("../controllers/edge");
const middleware = require("../scripts/middleware/token");

router.get("/GetDevices", middleware.verifyToken, edgeController.getDevices);

router.get("/GetInfo/:id", middleware.verifyToken, edgeController.getInfo);

router.post("/CreateDevice", edgeController.createDevice);

router.put("/SaveDevice/:id", edgeController.registerDeviceProp);

router.put("/UpdateReading/:id", edgeController.updateReading);

module.exports = router;
