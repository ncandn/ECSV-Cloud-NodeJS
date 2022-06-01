"use strict";

const router = require("express").Router();
const { Device } = require("../models/device");
const Crypto = require("../scripts/crypto");

router.get("/DemoDevice", async function (req, res, next) {
    try {
        const device = await Device.findOne({id: 911});
        res.json(device);
    } catch (err) {
        res.json("lmao")
    }
});

router.get("/DemoString", async function (req, res, next) {
    res.status(200).send("OK");
});

router.get("/Crypto", async function (req, res, next) {
    Crypto.func();
});

module.exports = router;
