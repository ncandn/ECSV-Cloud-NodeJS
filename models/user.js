"use strict";

const mongoose = require("mongoose");
const { Device } = require("../models/device");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    devices: [Device.schema]
});

module.exports = mongoose.model("User", userSchema);
