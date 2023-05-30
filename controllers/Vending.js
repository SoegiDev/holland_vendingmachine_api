const crypto = require("crypto");
const { success, error, validation } = require("../model/responseApi");
const {
  countRowsAll,
  countRows,
  countdeleteBulk,
  countInsert,
} = require("../model/Offline");
let TESTING = true;
// WELCOME//
module.exports.WelcomeVendingMachine = async (req, res, next) => {
  try {
    const JsonData = {
      title: "New VM API",
      description: "New Service API for Vending Machine",
      dbName: getTrxNameTable(),
    };
    return res.json(JsonData);
  } catch (ex) {
    next(ex);
  }
};

// GET LIST Stock
module.exports.ListStockOffline = async (req, res, next) => {
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
module.exports.ListBannerImageOffline = async (req, res, next) => {
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
module.exports.ListBannerVideoOffline = async (req, res, next) => {
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
