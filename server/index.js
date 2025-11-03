
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
// app.options("*", cors());
app.use(express.json({ limit: "500000000mb" }));
app.use(express.urlencoded({ limit: "500000000mb" }));
// const fs = require("fs");
// const path = require("path");
// const axios = require('axios');
// require('dotenv').config(); // Load default .env
// var sql = require("mssql");
// const multer = require("multer");
// const { log } = require("console");
// const CryptoJS = require("crypto-js");


app.get("/", function (req, res) {
  res.send("HELLO");
});

var server = app.listen(process.env.PORT || 1000, function () {
  console.log("Server is running..");
});

const allowedOrigins = [
  /^http:\/\/localhost:4200(\/.*)?$/,
  /^http:\/\/localhost:3000(\/.*)?$/,
];

app.use((req, res, next) => {
  const origin = req.headers.origin || req.headers.referer || '';
  // Allow if no origin header (e.g., direct server/server or browser GET)
  if (!origin || allowedOrigins.some(pattern => pattern.test(origin))) {
    next();
  } else {
    res.status(403).send('Forbidden');
  }
});

/////DO NOT CHANGE ABOVE THIS LINE/////
/////====================================================================================================================================/////
/////====================================================================================================================================/////
/////====================================================================================================================================/////
//------------------------------------------------------------------------------------------------------------------------------------------->
