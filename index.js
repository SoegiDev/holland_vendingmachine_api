const bodyParser = require("body-parser");
const cCPUs = require("os").cpus().length;
const express = require("express");
const cors = require("cors");
const app = express();
const useragent = require("express-useragent");
const axios = require("axios");
var HTTP_PORT = 3000;
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors());
app.use(express.json());
app.use(useragent.express());
//var INITDB = require("./services/init_db");
const vendingmachineRoute = require("./router/VendingMachine");

app.listen(HTTP_PORT, () => {
  console.log("Server is Running Set %PORT%".replace("%PORT%", HTTP_PORT));
});

app.get("/", (req, res) => {
  res.json({
    message: "success",
    data: "Welcome to VM API",
  });
});

app.use("/api/vend", vendingmachineRoute);
