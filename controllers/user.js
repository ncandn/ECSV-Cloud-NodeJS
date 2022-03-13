"use strict";

const User = require("../models/user");

const saveUser = async (req, res, next) => {
    var email, password;

    if (req.body) {
        email = req.body.email;
        password = req.body.password;
    }

    try {
        if (email && password) {
            const user = await User.exists({email: email});
            if (!user) {
                let newUser = await User.create({
                    email: email,
                    password: password
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
