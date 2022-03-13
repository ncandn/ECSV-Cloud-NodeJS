"use strict";

const router = require("express").Router();
const edgeController = require("../controllers/edge");

router.get("/GetDevices", edgeController.getDevices);

router.get("/GetInfo/:id", edgeController.getInfo);

router.post("/CreateDevice", edgeController.createDevice);

router.put("/SaveDevice/:id", edgeController.registerDeviceProp);

router.put("/UpdateReading/:id", edgeController.updateReading);

router.delete("/RemoveDevice/:id", edgeController.removeDevice);

module.exports = router;
