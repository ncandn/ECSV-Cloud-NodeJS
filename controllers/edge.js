"use strict";

const { Device } = require("../models/device");
const { Sensor } = require("../models/device");
const { Reading } = require("../models/device");
const User = require("../models/user");
const Crypto = require("crypto");
const DEVICE_HMAC = process.env.DEVICE_HMAC;
const cryptoHelpers = require("../scripts/crypto");

const getDevices = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.user.email});
        if (!user) {
            throw new Error("User's not found.");
        }

        let devices = user.devices;
        res.json(devices);
    } catch (err) {
        res.status(500).json({
            error: true,
            message: err.message,
        });
    }

    next();
};

const createDevice = async (req, res, next) => {
    const deviceID = req.body?.deviceID.toString();

    try {
        if (deviceID) {
            var deviceHMAC = Crypto.createHmac("sha256", DEVICE_HMAC).update(deviceID).digest("hex");
            const deviceExists = await Device.exists({id: deviceHMAC});

            if (!deviceExists) {
                const newDevice = await Device.create({
                    id: deviceHMAC,
                    name: "ECSV Device",
                    status: "Pending"
                });

                res.status(201).json(newDevice);
            } else {
                res.status(200).json({
                    error: false,
                    message: "Device already exists."
                });
            }
        } else {
            throw new Error("No specified device ID.");
        }
    } catch (err) {
        res.status(400).json({
            error: true,
            message: err.message
        });
    }

    next();
};

const registerDeviceProp = async (req, res, next) => {
    const deviceID = req.params?.id.toString();
    const incomingSensor = {
        id: req.body?.sensorID,
        type: req.body?.type
    };

    try {
        if (deviceID && incomingSensor) {
            var deviceHMAC = Crypto.createHmac("sha256", DEVICE_HMAC).update(deviceID).digest("hex");
            const sensorExists = await Sensor.findOne({id: incomingSensor.id});
            const device = await Device.findOne({id: deviceHMAC});

            if (!sensorExists && device) {
                const sensor = await Sensor.create({
                    id: incomingSensor.id,
                    type: incomingSensor.type,
                    device: device._id
                });

                device.sensors.push(sensor);
                await device.save();

                res.status(201).json(sensor);
            } else {
                throw new Error("Couldn't save sensor.");
            }
        } else {
            throw new Error("No information provided.");
        }
    } catch (err) {
        res.status(400).json({
            error: true,
            message: err.message
        });
    }

    next();
};

const updateReading = async (req, res, next) => {
    const sensorID = req.params?.id;
    const readings = {
        unit: req.body?.unit,
        value: req.body?.value
    };

    try {
        if (!sensorID) {
            throw new Error("No specified sensor ID.");
        }

        const newSensor = await Sensor.findOne({id: sensorID});

        if (newSensor) {
            const prevReading = await Reading.findOne({sensor: newSensor._id});
            if (prevReading) {
                await Reading.deleteOne({sensor: newSensor._id, unit: readings.unit});
                console.log("Previous reading is deleted successfully.");
            }

            if (readings.value) {
                readings.value = cryptoHelpers.encryptDataAES256GCM(readings.value, process.env.READING_KEY + process.env.READING_KEY, new Crypto.randomBytes(12));
            }

            const reading = await Reading.create({
                unit: readings.unit,
                value: readings.value,
                sensor: newSensor._id
            });

            newSensor.reading = reading;
            await newSensor.save();

            const device = await Device.findOne({_id: newSensor.device._id}).populate("sensors");

            for (var sn in device.sensors) {
                if (newSensor._id.equals(device.sensors[sn]._id)) {
                    device.sensors[sn] = newSensor;
                    break;
                }
            }

            await device.save();
            res.status(201).json(newSensor);
        } else {
            throw new Error("Couldn't find sensor.");
        }
    } catch (err) {
        res.status(400).send(err.message);
    }

    next();
};

const getInfo = async (req, res, next) => {
    const deviceUUID = req.params?.deviceUUID;
    const email = "test@test.com"; //req.user && req.user.email ? req.user.email : null;

    try {
        if (deviceUUID && email) {
            const device = await Device.findOne({_id: deviceUUID});

            if (!device) {
                throw new Error("Device could not be found.");
            }
            
            const user = await User.findOne({email: email});
            if (!user) {
                throw new Error("User could not be found.");
            }

            var userHasDevice = false;
            user.devices.forEach((element) => {
                if (element._id.equals(device._id)) {
                    userHasDevice = true;
                }
            });

            if (userHasDevice) {
                device.sensors.forEach((sensor) => {
                    sensor.reading.value = Number(cryptoHelpers.decryptDataAES256GCM(sensor.reading.value, process.env.READING_KEY + process.env.READING_KEY));
                });
                res.status(200).json(device);
            } else {
                res.status(404).json({
                    error: true,
                    message: "Device could not be found."
                });
            }
        } else {
            throw new Error("No information provided.");
        }
    } catch (err) {
        res.status(500).json({
            error: true,
            message: err.message,
        });
    }

    next();
};

module.exports = { getDevices, createDevice, updateReading, registerDeviceProp, getInfo };
