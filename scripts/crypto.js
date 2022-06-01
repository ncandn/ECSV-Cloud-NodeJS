"use strict";

const crypto = require("crypto");

function func() {
    if (crypto) {
        console.log(crypto.getCiphers());
    }
}

module.exports = {
    func: func
};
