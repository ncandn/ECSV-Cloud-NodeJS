"use strict";

const User = require("../models/user");
const { Device } = require("../models/device");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res, next) => {
    const email = req.body?.email;
    const password = req.body?.password;

    try {
        const user = await User.findOne({email: email});

        if (!user) {
            throw new Error("User not found.");
        }

        //let iv = crypto.randomBytes(16);
        var iv = "1234567812345678";
        var key = "12345678123456781234567812345678";
        let decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
        let decrypted = decipher.update(user.password, "hex", "utf-8");
        decrypted += decipher.final("utf-8");

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
                //let device = await Device.findOne({id: "1112"});

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
    const email = req.user && req.user.email ? req.user.email : null;

    try {
        const device = await Device.findOne({id: deviceID});
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
        await device.save();

        user.devices.push(device);
        await user.save();

        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({
            error: true,
            message: err.message
        });
    }

    next();
};

module.exports = { saveUser, loginUser, addDevice };
