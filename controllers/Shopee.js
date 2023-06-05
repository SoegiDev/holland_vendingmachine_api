const crypto = require("crypto");
const { toBase64 } = require("request/lib/helpers");
require("dotenv").config();
const axios = require("axios");
const { db, getTrxNameTable } = require("../services/db");
var qs = require("querystring");
var microtime = require("microtime");
const { fail } = require("assert");
const { success, error } = require("../model/responseApi");
const { POSTDATA, GETDATA } = require("../model/Online");
// WELCOME//
QrCodeShopee = async (req, res, next) => {
  try {
    var params = false;
    const { trx_code, product_name, qty_product, amount } = req.query;
    console.log(req.query);
    if (req.query !== null || req.query !== undefined) {
      params = true;
    }

    if (!params) {
      res.status(404).send(error("NO CP", res.statusCode));
    } else {
      let url = process.env.VM_DOCK_URL;
      var VM_ID = process.env.VM_ID;
      var VM_NAME = process.env.VM_NAME;
      var PATH = process.env.PATH_SHOPEE_IMAGE_QR_GET;

      var productNameParam = "product_name=" + product_name;
      var amountParam = "amount=" + amount;
      var dateParam = "postbill_datetime=" + microtime.now();
      var trxCodeParam = "trx_code=" + trx_code;
      var vmIdParam = "vm_code=" + VM_ID;
      var validTimeParam = "validTime=120";
      var dr_qr_url = "dr_url=-";
      var data_post =
        url +
        PATH +
        productNameParam +
        "&" +
        amountParam +
        "&" +
        dateParam +
        "&" +
        trxCodeParam +
        "&" +
        vmIdParam +
        "&" +
        validTimeParam +
        "&" +
        dr_qr_url;
      const headers = {
        "Content-Type": "application/json",
        Accept: "*/*",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "accept-encoding": "gzip, deflate",
        "cache-control": "no-cache",
      };
      GETDATA(data_post, headers)
        .then((data) => {
          console.log("Get DATA", data);
          if (data.data.errcode !== null) {
            if (data.data.errcode === 0 && data.data.qr_content !== null) {
              var qrcode = data.data.qr_content;
              res
                .status(200)
                .send(success("SUCCESS", { qrcode }, res.statusCode));
            } else {
              if (data.data.errcode === 0) {
                res.status(200).send(success("NO QR", res.statusCode));
              } else {
                res.status(200).send(success("NO RF", res.statusCode));
              }
            }
          } else {
            res.status(200).send(success("NO_RF_API", res.statusCode));
          }
        })
        .catch((err) => {
          // console.log("ERROR", err);
          res.status(400).send(error(err.message, res.statusCode));
        });
    }
  } catch (ex) {
    next(ex);
  }
};

PaymentShopee = async (req, res, next) => {
  try {
    var params = false;
    const { trx_code } = req.query;
    if (req.query !== null || req.query !== undefined) {
      params = true;
    }
    if (!params) {
      res.status(404).send(error("FAILED", res.statusCode));
    } else {
      let buff = new Buffer(trx_code);
      let base64data = buff.toString("base64");
      var trxCodeParam = base64data;
      let url = process.env.VM_DOCK_URL;
      var VM_ID = process.env.VM_ID;
      var VM_NAME = process.env.VM_NAME;
      var PATH = process.env.PATH_ORDER_PAYMENT_GET;

      var trxCod = "trx_code=" + trxCodeParam;
      var data_post = url + PATH + trxCod;
      const headers = {
        "Content-Type": "application/json",
        Accept: "*/*",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "accept-encoding": "gzip, deflate",
        "cache-control": "no-cache",
      };
      GETDATA(data_post, headers).then((data) => {
        console.log(data.data.status);
        if (data.data.status !== null) {
          console.log(data.data.status);
          if (data.data.status === "1") {
            res.status(200).send(success("SUCCESS", res.statusCode));
          } else {
            res.status(200).send(success("FAILED", res.statusCode));
          }
        } else {
          res.status(400).send(error("API FAILED", res.statusCode));
        }
      });
    }
  } catch (ex) {
    next(ex);
  }
};

CheckPaymentShopee = async (req, res, next) => {
  try {
    var url = process.env.VM_DOCK_URL;
    var VM_ID = process.env.VM_ID;
    var VM_NAME = process.env.VM_NAME;
    var PATH = process.env.PATH_SHOPEE_STATUS_CHECK_POST;
    var params = false;
    const { trx_code } = req.query;
    if (req.query !== null || req.query !== undefined) {
      params = true;
    }
    var datapost = { id: trx_code };
    if (!params) {
      res.status(404).send(error("FAILED", res.statusCode));
    } else {
      //  var data_post = url + trxCod;
      var data_post = url + PATH;
      const headers = {
        "Content-Type": "application/json",
        Accept: "*/*",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "accept-encoding": "gzip, deflate",
        "cache-control": "no-cache",
      };
      POSTDATA(data_post, datapost, headers).then((data) => {
        console.log("Status", data);
        if (data.data !== null) {
          if (data.data === "Pembayaran Sukses") {
            res.status(200).send(success("SUCCESS", res.statusCode));
          } else {
            res.status(200).send(success("FAILED", res.statusCode));
          }
        } else {
          res.status(400).send(error("API FAILED", res.statusCode));
        }
      });
    }
  } catch (ex) {
    next(ex);
  }
};

module.exports = { QrCodeShopee, PaymentShopee, CheckPaymentShopee };
