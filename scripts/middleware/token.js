"use strict";

const jwt = require("jsonwebtoken");
const KEY = process.env.TOKEN_KEY;

const verifyToken = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
        return res.status(403).json({
            error: true,
            message: "A token is required for authentication!"
        });
    }

    try {
        const decoded = jwt.verify(token, KEY);
        req.user = decoded;
    } catch (err) {
        return res.status(401).json({
            error: true,
            message: "Invalid token."
        });
    }

    next();
};

module.exports = { verifyToken };
