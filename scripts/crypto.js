"use strict";

const Crypto = require("crypto");
const AES_256_GCM = "aes-256-gcm";
const AES_128_ECB = "aes-128-ecb";

const encryptDataAES256GCM = (message, key, iv) => {
    var cipher = Crypto.createCipheriv(AES_256_GCM, key, iv);
    var encrypted1 = cipher.update(message,"utf-8");
    var encrypted2 = cipher.final();

    return Buffer.concat([encrypted1, encrypted2, iv, cipher.getAuthTag()]).toString("base64");
};

const decryptDataAES256GCM = (encrypted, key) => {
    encrypted = Buffer.from(encrypted, "base64");
    var iv = encrypted.slice(encrypted.length - 28, encrypted.length - 16);
    var tag = encrypted.slice(encrypted.length - 16);
    encrypted = encrypted.slice(0, encrypted.length - 28);

    var decipher = Crypto.createDecipheriv(AES_256_GCM, key, iv);
    decipher.setAuthTag(tag);

    var message = decipher.update(encrypted, null, "utf-8");
    message += decipher.final("utf-8");

    return message;
};

const decryptDataAES128ECB = (encrypted, key) => {
    var cipher = Crypto.createDecipheriv(AES_128_ECB, key, null);
    return Buffer.concat([cipher.update(encrypted), cipher.final()]).toString("utf-8");
};

module.exports = { encryptDataAES256GCM, decryptDataAES256GCM, decryptDataAES128ECB };
