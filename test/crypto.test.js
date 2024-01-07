"use strict";

const Crypto = require("crypto");
const AES_128_ECB = "aes-128-ecb";
const AES_128_CBC = "aes-128-cbc";

const compareAES = () => {
    var start = new Date();
    
    // ECB
    var cipher = Crypto.createCipheriv(AES_128_ECB, process.env.READING_KEY, null);
    var encrypted1 = cipher.update("42", "utf-8");
    var encrypted2 = cipher.final();

    Buffer.concat([encrypted1, encrypted2]).toString("hex");

    var finish = new Date();

    console.log(`AES-128-ECB Elapsed Time: ${finish - start}ms.\n`);

    start = new Date();
    
    // ECB
    cipher = Crypto.createCipheriv(AES_128_CBC, process.env.READING_KEY, new Crypto.randomBytes(16));
    encrypted1 = cipher.update("42", "utf-8");
    encrypted2 = cipher.final();

    Buffer.concat([encrypted1, encrypted2]).toString("hex");

    finish = new Date();

    console.log(`AES-128-CBC Elapsed Time: ${finish - start}ms.`);
};

module.exports = { compareAES };
