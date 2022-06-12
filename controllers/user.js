"use strict";

const User = require("../models/user");
const { Device } = require("../models/device");
const Crypto = require("crypto");
const cryptoHelpers = require("../scripts/crypto");
const jwt = require("jsonwebtoken");
const DEVICE_HMAC = process.env.DEVICE_HMAC;

const loginUser = async (req, res, next) => {
    const email = req.body?.email;
    const password = req.body?.password;

    try {
        const user = await User.findOne({email: email});

        if (!user) {
            throw new Error("User not found.");
        }

        var key = Crypto.createHash("sha512").update(password, "utf-8").digest("hex").substr(0, 32);
        var decrypted = cryptoHelpers.decryptDataAES256GCM(user.password, key);

        if (password == decrypted) {
            let token = jwt.sign(
                { user_id: user._id, email: email },
                process.env.TOKEN_KEY,
                { expiresIn: "2h" }
            );

            res.json({
                user: user,
                token: token
            });
        } else {
            throw new Error("Passwords must match.");
        }
    } catch (err) {
        res.status(400).json({
            error: true,
            message: err.message
        });
    }

    next();
};

const saveUser = async (req, res, next) => {
    const email = req.body?.email;
    const password = req.body?.password;

    try {
        if (email && password) {
            const user = await User.exists({email: email});
            
            if (!user) {
                let newUser = await User.create({
                    email: email,
                    password: password,
                    devices: []
                });

                let token = jwt.sign(
                    { user_id: newUser._id, email: email },
                    process.env.TOKEN_KEY,
                    { expiresIn: "2h" }
                );

                res.status(201).json({
                    user: newUser,
                    token: token
                });
            } else {
                res.status(200).json({
                    error: true,
                    message: "User already exists."
                });
            }
        } else {
            throw new Error("Please fill the fields.");
        }
    } catch (err) {
        res.status(400).json({
            error: true,
            message: err.message
        });
    }

    next();
};

const addDevice = async (req, res, next) => {
    const deviceID = req.body?.deviceID;
    const deviceName = req.body?.deviceName;
    const email = req.user && req.user.email ? req.user.email : null;

    try {
        if (deviceID && email) {
            var deviceHMAC = Crypto.createHmac("sha256", DEVICE_HMAC).update(deviceID).digest("hex");
            const device = await Device.findOne({id: deviceHMAC});
            if (!device) {
                throw new Error("Couldn't find the device with the ID of " + deviceID + ".");
            }

            if (device.status != "Pending") {
                throw new Error("This device is not available.");
            }

            const user = await User.findOne({email: email});
            if (!user) {
                throw new Error("Users must login.");
            }

            device.status = "Owned";
            if (deviceName) {
                device.name = deviceName;
            }
            await device.save();

            user.devices.push(device);
            await user.save();

            res.status(200).json(user);
        } else {
            throw new Error("Missing information.");
        }
    } catch (err) {
        res.status(400).json({
            error: true,
            message: err.message
        });
    }

    next();
};

const removeDevice = async (req, res, next) => {
    const deviceUUID = req.body?.deviceUUID;
    const email = req.user && req.user.email ? req.user.email : null;

    try {
        if (deviceID && email) {
            const device = await Device.findOne({_id: deviceUUID});

            if (!device) {
                throw new Error("Couldn't find the device with the ID of " + deviceID + ".");
            }

            if (device.status != "Owned") {
                throw new Error("This device is already available.");
            }

            const user = await User.findOne({email: email});
            if (!user) {
                throw new Error("Users must login.");
            }

            device.status = "Pending";
            await device.save();
            
            user.devices = user.devices.filter(data => !device._id.equals(data._id));
            await user.save();

            res.status(200).json(user);
        } else {
            throw new Error("Missing information.");
        }
    } catch (err) {
        res.status(400).json({
            error: true,
            message: err.message
        });
    }

    next();
}

module.exports = { saveUser, loginUser, addDevice, removeDevice };
