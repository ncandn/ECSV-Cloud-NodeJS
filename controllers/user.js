"use strict";

const User = require("../models/user");
const { Device } = require("../models/device");

const getUser = async (req, res, next) => {
    const email = req.params?.email;

    try {
        const user = await User.findOne({email: email});

        if (!user) {
            throw new Error("User not found.");
        }

        res.json(user);
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
                let device = await Device.findOne({id: "8138108"});

                let newUser = await User.create({
                    email: email,
                    password: password,
                    devices: [device]
                });

                res.status(201).json(newUser);
            } else {
                res.status(200).json({
                    error: false,
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

module.exports = { saveUser, getUser };
