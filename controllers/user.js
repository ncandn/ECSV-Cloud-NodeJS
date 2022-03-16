"use strict";

const User = require("../models/user");
const { Device } = require("../models/device");

const saveUser = async (req, res, next) => {
    const email = req.body?.email;
    const password = req.body?.password;

    console.log(email);
    console.log(password);


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

module.exports = { saveUser };
