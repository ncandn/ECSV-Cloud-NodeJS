const express = require("express");
const mongoose = require("mongoose");
const app = express();
require('dotenv').config();

mongoose.connect(process.env.DATABASE_URI || "mongodb://localhost/api", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", (err) => console.error(err));
db.once("open", () => console.log("Connection is successful."));

const authRouter = require("./routes/auth");
const edgeRouter = require("./routes/edge");

app.use("/api/auth", authRouter);
app.use("/api/edge", edgeRouter);

const server = app.listen(process.env.PORT || 3000);
module.exports = server;
