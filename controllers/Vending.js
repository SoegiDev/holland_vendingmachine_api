const crypto = require("crypto");
const { success, error, validation } = require("../model/responseApi");
const {
  countRowsAll,
  countRows,
  countdeleteBulk,
  countInsert,
} = require("../model/Offline");
let TESTING = true;

module.exports.getVMAccount = async (req, res, next) => {
  try {
    if (process.env.VM_ID === undefined) {
      res.status(200).send(success("No Data", res.statusCode));
    } else {
      const VMAccount = {
        vm_id: process.env.VM_ID,
        vm_name: process.env.VM_NAME,
      };
      res.status(200).send(success("OK", { data: VMAccount }, res.statusCode));
    }
  } catch (ex) {
    next(ex);
  }
};
// WELCOME//
module.exports.WelcomeVendingMachine = async (req, res, next) => {
  try {
    const JsonData = {
      title: "New VM API",
      description: "New Service API for Vending Machine",
    };
    return res.json(JsonData);
  } catch (ex) {
    next(ex);
  }
};

// GET LIST Stock
module.exports.get_slot = async (req, res, next) => {
  try {
    var getData = countRowsAll("select * from slot order by no_slot asc");
    if (getData.length > 0) {
      res.status(200).send(success("OK", { data: getData }, res.statusCode));
    } else {
      res.status(200).send(success("No Data", res.statusCode));
    }
  } catch (ex) {
    next(ex);
  }
};

// GET LIST BANNER
module.exports.get_banner_image = async (req, res, next) => {
  try {
    var getData = countRowsAll(
      `select * from banner where banner_format = 'image' and active = 'Y'`
    );
    if (getData.length > 0) {
      res.status(200).send(success("OK", { data: getData }, res.statusCode));
    } else {
      res.status(200).send(success("No Data", res.statusCode));
    }
  } catch (ex) {
    next(ex);
  }
};

// GET LIST BANNER VIDEO
module.exports.get_banner_video = async (req, res, next) => {
  try {
    var getData = countRowsAll(
      `select * from banner where banner_format = 'video' and active = 'Y'`
    );
    if (getData.length > 0) {
      res.status(200).send(success("OK", { data: getData }, res.statusCode));
    } else {
      res.status(200).send(success("No Data", res.statusCode));
    }
  } catch (ex) {
    next(ex);
  }
};

var download = function (uri, filename, callback) {
  request.head(uri, function (err, res, body) {
    request(uri).pipe(fs.createWriteStream(filename)).on("close", callback);
  });
};

const downloadImageToUrl = (url, filename) => {
  let client = http;
  if (url.toString().indexOf("https") === 0) {
    client = https;
  }
  return new Promise((resolve, reject) => {
    client.get(url, (res) => {
      res
        .pipe(fs.createWriteStream(filename))
        .on("error", reject)
        .once("close", () => resolve(filename));
    });
  });
};
