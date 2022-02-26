const router = require("express").Router();
const { Device } = require("../models/device");

router.get("/DemoDevice", async function (req, res, next) {
    try {
        const device = await Device.findOne({id: 911});
        res.json(device);
    } catch (err) {
        res.json("lmao")
    }
});

module.exports = router;
