const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: false
    },
    registrationDate: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model("Device", deviceSchema);
