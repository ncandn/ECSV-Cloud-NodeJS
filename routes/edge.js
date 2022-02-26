const router = require("express").Router();
const edgeController = require("../controllers/edge")

router.get("/GetDevices", edgeController.getDevices);

router.get("/GetInfo/:id", edgeController.getInfo);

router.get("/CreateDevice", edgeController.createDevice);

router.get("/SaveDevice", edgeController.saveDevice);

router.get("/UpdateReading", edgeController.updateReading);

router.delete("/RemoveDevice/:id", edgeController.removeDevice);

module.exports = router;
