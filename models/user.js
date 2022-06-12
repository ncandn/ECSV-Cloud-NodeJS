"use strict";

const mongoose = require("mongoose");
const { Device } = require("../models/device");
const Crypto = require("crypto");
const cryptoHelpers = require("../scripts/crypto");

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

userSchema.pre("save", function(next) {
    var user = this;
    if (!user.isModified("password")) return next();

    try {
        var key = Crypto.createHash("sha512").update(user.password, "utf-8").digest("hex").substr(0, 32);
        var iv = new Crypto.randomBytes(12);
        user.password = cryptoHelpers.encryptDataAES256GCM(user.password, key, iv);
    } catch (err) {
        console.error(err);
    }

    next();
});

module.exports = mongoose.model("User", userSchema);
