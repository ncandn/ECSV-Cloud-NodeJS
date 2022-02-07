const router = require("express").Router();
const edgeController = require("../controllers/edge")

router.get("/GetDevices", edgeController.getDevices);

router.get("/GetInfo/:id", edgeController.getInfo);

router.post("/SaveDevice", edgeController.saveDevice);

router.delete("/RemoveDevice/:id", edgeController.removeDevice);

module.exports = router;
