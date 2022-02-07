const Device = require("../models/device");

const getDevices = async (req, res) => {
    try {
        const devices = await Device.find();
        res.json(devices);
    } catch (err) {
        res.status(500).json({
            error: true,
            message: err.message,
        });
    }
};

const saveDevice = async (req, res) => {
    const device = new Device({
        id: 1,
        name: "test"
    });

    try {
        const newDevice = await device.save();
        res.status(201).json(newDevice);
    } catch (err) {
        res.status(400).json({
            error: true,
            message: err.message
        });
    }
};

const removeDevice = async (req, res) => {
    try {

    } catch (err) {

    }
};

const getInfo = async (req, res) => {
    try {

    } catch (err) {

    }
};

module.exports = { getDevices, saveDevice, removeDevice, getInfo };
