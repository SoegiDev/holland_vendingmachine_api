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
var db = require("./database");

app.listen(HTTP_PORT, () => {
  console.log("Server is Running Set %PORT%".replace("%PORT%", HTTP_PORT));
});

app.get("/", (req, res) => {
  res.json({
    message: "success",
    data: "Welcome to VM API",
  });
});

// app.get("/api/banner/all", (req, res, next) => {
//   var sql = "select * from banner";
//   var params = [];
//   db.all(sql, params, (err, rows) => {
//     if (err) {
//       res.status(400).json({ error: err.message });
//       return;
//     }
//     res.json({
//       message: "success",
//       data: rows,
//     });
//   });
// });

// // GET BANNER SYNC
app.get("/api/banner/sync", (req, res, next) => {
  const vm_id = { vmcode: process.env.VM_ID };
  let url = "http://vm.hollandbakery.co.id/";
  let path = "confirm/Other/video?";
  let buff = new Buffer(JSON.stringify(vm_id));
  let base64data = buff.toString("base64");
  let jailbreak = base64data.substring(-5);
  let datakey = crypto.createHash("sha1").update(jailbreak).digest("hex");
  let post_string = "key=" + datakey + "&data=" + base64data;
  let basename = url + path + post_string;
  axios({
    method: "get",
    basename,
  })
    .then(function (response) {
      console.log(response);
      res.send(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
});

// app.get("/api/banner/sync2", (req, res, next) => {
//   const vm_id = { vmcode: process.env.VM_ID };
//   let url = "https://vm.hollandbakery.co.id/";
//   let pathName = "confirm/VmStock?";
//   let buff = new Buffer(JSON.stringify(vm_id));
//   let base64data = buff.toString("base64");
//   let jailbreak = base64data.substring(-5);
//   let datakey = crypto.createHash("sha1").update(jailbreak).digest("hex");
//   let post_string = "key=" + datakey + "&data=" + base64data;
//   let basename = url + pathName + post_string;
//   var https = require("https");
//   console.log(basename);
//   const querystring = require("querystring");

//   // GET parameters
//   const parameters = {
//     key: datakey,
//     data: base64data,
//   };

//   // GET parameters as query string : "?id=123&type=post"
//   const get_request_args = querystring.stringify(parameters);

//   // Final url is "http://usefulangle.com/get/ajax.php?id=123&type=post"
//   const options = {
//     url: url,
//     path: pathName + get_request_args,
//     headers: {
//       Accept: "*/*",
//       "Cache-Control": "no-cache",
//       Connection: "keep-alive",
//       "accept-encoding": "gzip, deflate",
//       "cache-control": "no-cache",
//     },
//   };

//   // send request
//   const request = https.request(options, (response) => {
//     // response from server
//     console.log("Berhasil", response);
//   });

//   // In case error occurs while sending request
//   request.on("error", (error) => {
//     console.log("Error", error.message);
//   });

//   request.end();
// });
