"use strict";

const mongoose = require("mongoose");

const readingSchema = new mongoose.Schema({
    unit: {
        type: String,
        required: true,
        enum: ["celcius", "g.m^-3", "ppm"]
    },
    value: {
        type: String,
        required: true
    },
    sensor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sensor"
    }
});

const sensorSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ["temperature", "humidity", "pollution"],
        required: true
    },
    device: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Device",
        required: true
    },
    reading: readingSchema
});

const deviceSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ["Pending", "Owned"],
        required: true
    },
    registrationDate: {
        type: Date,
        required: true,
        immutable: true,
        default: () => Date.now()
    },
    sensors: [sensorSchema]
});

const Device = mongoose.model("Device", deviceSchema);
const Sensor = mongoose.model("Sensor", sensorSchema);
const Reading = mongoose.model("Reading", readingSchema);

module.exports = {
    Device: Device,
    Sensor: Sensor,
    Reading: Reading
};
