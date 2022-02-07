const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: false
    },
    devices: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Device"
    }]
});

module.exports = mongoose.model("User", userSchema);
