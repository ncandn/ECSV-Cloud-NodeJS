"use strict";

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const SALT_WORK_FACTOR = 10;
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

userSchema.pre("save", function(next) {
    var user = this;
    if (!user.isModified("password")) return next();

    try {
        //var iv = crypto.randomBytes(16);
        var iv = "1234567812345678";
        
        var key = "12345678123456781234567812345678";
    
        var cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
        var encrypted = cipher.update(user.password, "utf-8", "hex");
        encrypted += cipher.final("hex");
        user.password = encrypted;
    } catch (err) {
        console.error(err);
    }

    next();
});

module.exports = mongoose.model("User", userSchema);
