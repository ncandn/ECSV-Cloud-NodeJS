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
};

const createDevice = async (req, res, next) => {
    try {
        const deviceExists = await Device.exists({id: 911});

        if (!deviceExists) {
            const newDevice = await Device.create({
                id: 911,
                name: "Demo Device"
            });
            res.status(201).json(newDevice);
        } else {
            throw new Error("Device already exists.");
        }
    } catch (err) {
        res.status(400).json({
            error: true,
            message: err.message
        });
    }
};

const saveDevice = async (req, res, next) => {
    try {
        const sensorExists = await Sensor.findOne({id: 977});
        const device = await Device.findOne({id: 911});

        if (!sensorExists && device) {
            const sensor = await Sensor.create({
                id: 977,
                type: "temperature",
                device: device._id
            });
            device.sensors.push(sensor);
            await device.save();
            res.status(201).json(sensor);
        } else {
            throw new Error("Couldn't save sensor.");
        }
    } catch (err) {
        res.status(400).send(err.message);
    }
};

const updateReading = async (req, res, next) => {
    try {
        const sensor = await Sensor.findOne({id: 977});

        if (sensor) {
            const reading = await Reading.create({
                unit: "celcius",
                value: 30,
                sensor: sensor._id
            });

            sensor.reading = reading;
            await sensor.save();

            const device = await Device.findOne({_id: sensor.device._id}).populate("sensors");
            console.log(sensor)
            console.log(device)
            for (var sn in device.sensors) {
                console.log(sn)
                console.log(device.sensors[sn]._id)
                console.log(sensor._id)
                console.log(sensor._id.equals(device.sensors[sn]._id))
                if (sensor._id.equals(device.sensors[sn]._id)) {
                    device.sensors[sn] = sensor;
                    console.log("yeah")
                    break;
                }
            }
            //console.log(device)
            await device.save();
            res.status(201).json(sensor);
        } else {
            throw new Error("Couldn't find sensor.");
        }
    } catch (err) {
        res.status(400).send(err.message);
    }
};

const removeDevice = async (req, res, next) => {
    try {

    } catch (err) {

    }
};

const getInfo = async (req, res, next) => {
    try {

    } catch (err) {

    }
};

module.exports = { getDevices, createDevice, updateReading, saveDevice, removeDevice, getInfo };
