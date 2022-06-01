const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
require("dotenv").config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.DATABASE_URI || "mongodb://localhost/api", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true
});

const db = mongoose.connection;
db.on("error", (err) => console.error(err));
db.once("open", () => console.log("Connection is successful."));

const authRouter = require("./routes/auth");
const edgeRouter = require("./routes/edge");
const testRouter = require("./routes/test");

app.get("/", function (req, res, next) {
    res.status(200).send("CONNECTED - ECSV DATABASE SERVER");
});

// HTTP BLOCKER
/*app.use("/api/auth/*", function (req, res, next) {
    res.status(511).json({
        error: true,
        message: "Not Authorized"
    });
});*/

app.use("/testapi/edge", testRouter);
app.use("/api/auth", authRouter);
app.use("/api/edge", edgeRouter);

const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`Started listening on port ${process.env.PORT || 3000}.`);
});

module.exports = server;
