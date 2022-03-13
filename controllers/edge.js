"use strict";

const { Device } = require("../models/device");
const { Sensor } = require("../models/device");
const { Reading } = require("../models/device");

const getDevices = async (req, res, next) => {
    try {
        const devices = await Device.find();
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
    const deviceID = req.body?.deviceID;
    const deviceName = req.body?.deviceName;

    try {
        if (deviceID) {
            const deviceExists = await Device.exists({id: deviceID});

            if (!deviceExists) {
                const newDevice = await Device.create({
                    id: deviceID,
                    name: deviceName || "ECSV Device"
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
    const deviceID = req.params?.id;
    const incomingSensor = {
        id: req.body?.sensorID,
        type: req.body?.type
    };

    try {
        if (deviceID && incomingSensor) {
            const sensorExists = await Sensor.findOne({id: incomingSensor.id});
            const device = await Device.findOne({id: deviceID});
    
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
    console.log(req.params?.id)
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

const removeDevice = async (req, res, next) => {
    try {

    } catch (err) {

    }
};

const getInfo = async (req, res, next) => {
    var deviceID = req.params?.id;

    try {
        if (deviceID) {
            const device = await Device.findOne({id: deviceID});
            if (device) {
                res.status(200).json(device);
            } else {
                throw new Error("Device could not be found.");
            }
        } else {
            throw new Error("No specified device ID.");
        }
    } catch (err) {
        res.status(500).json({
            error: true,
            message: err.message,
        });
    }
    
    next();
};

module.exports = { getDevices, createDevice, updateReading, registerDeviceProp, removeDevice, getInfo };
