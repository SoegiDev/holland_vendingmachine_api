const crypto = require("crypto");
const { toBase64 } = require("request/lib/helpers");
require("dotenv").config();
const axios = require("axios");
const intTrx = require("../init_trx");
const { db, getTrxNameTable, createifNotExists } = require("../services/db");
const { success, error, validation } = require("../model/responseApi");
const fs = require("fs");
const request = require("request");

const { GETDATA, POSTDATA, PUTDATA } = require("../model/Online");
const {
  countInsert,
  countRowsAll,
  countdeleteBulk,
  countRows,
  countUpdate,
  countUpdateItem,
} = require("../model/Offline");
let TESTING = true;

async function getBanner(req, res, next) {
  const vm_id = { vmcode: process.env.VM_ID };
  let url = process.env.VM_DOCK_URL;
  let path = process.env.PATH_BANNER_GET;
  let buff = new Buffer(JSON.stringify(vm_id));
  let base64data = buff.toString("base64");
  let jailbreak = base64data.substring(base64data.length - 5);
  let datakey = crypto.createHash("sha1").update(jailbreak).digest("hex");
  let post_string = "key=" + datakey + "&data=" + base64data;
  let paramUrl = url + path + post_string;
  const headers = {
    "Content-Type": "application/json",
  };
  GETDATA(paramUrl, headers).then((data) => {
    let countdata = 0;
    if (data.status === 200) {
      const slotServerList = data.data.data;
      let exists = false;
      const dataIs = data.data.data;
      dataLength = dataIs.length;
      let tempArrayExist = [];
      let tempArrayNew = [];
      let tempArrayLast = [];
      for (let i = 0; i < dataIs.length; i++) {
        var item = dataIs[i];
        countdata += 1;
        var query = `select * from banner where id_banner = '${item.id}' and banner_name = '${item.name}'`;
        var check = countRows(query);
        if (check === undefined) {
          var queryInsert =
            "INSERT INTO banner (id_banner,banner_name,banner_type,banner_format,fromdate,todate,banner_url,banner_local,active) values(?,?,?,?,?,?,?,?,?)";
          var dataInsert = [
            item.id,
            item.name,
            item.type,
            item.format,
            item.fromdate,
            item.todate,
            item.url,
            item.url,
            item.isactive,
          ];
          var iR = countInsert(queryInsert, dataInsert);
          console.log(iR);
          if (iR.lastInsertRowid > 0) tempArrayNew.push(item.id);
        } else {
          var queryUpdate =
            "UPDATE banner set id_banner = ?, banner_name = ?, banner_type = ?, banner_format = ?, fromdate = ?, todate = ?, banner_url = ?, banner_local = ? , active = ? where id_banner =? and banner_name = ? and banner_type = ? and fromdate=?";
          var dataUpdate = [
            item.id,
            item.name,
            item.type,
            item.format,
            item.fromdate,
            item.todate,
            item.url,
            item.url,
            item.isactive,
            item.id,
            item.name,
            item.type,
            item.fromdate,
          ];
          var iR = countUpdate(queryUpdate, dataUpdate);
          if (iR.changes > 0) tempArrayExist.push(item.id);
        }
        if (countdata === dataIs.length) {
          break;
        } else {
          continue;
        }
      }
      tempArrayLast = tempArrayNew.concat(tempArrayExist);
      console.log(tempArrayLast);
      var queryDelete = `delete from banner where id_banner not in (${tempArrayLast})`;
      var del = countdeleteBulk(queryDelete);
      if (del.changes > 0) {
        var getData = countRowsAll(
          "select * from banner where banner_format = 'image' and active = 'Y'"
        );
        if (getData.length > 0) {
          return true;
        } else {
          return true;
        }
      } else {
        var getData = countRowsAll(
          "select * from banner where banner_format = 'image' and active = 'Y'"
        );
        if (getData.length > 0) {
          return true;
        } else {
          return true;
        }
      }
    } else {
      return true;
    }
  });
  //res.status(200).send({ jumlah: count });
  return false;
}

async function getSlot(req, res, next) {
  var tableTrx = createifNotExists();
  var vmTrx = false;
  const vm_id = { vmcode: process.env.VM_ID };
  let url = process.env.VM_DOCK_URL;
  let path = process.env.PATH_SYNC_STOCK_GET;
  let buff = new Buffer(JSON.stringify(vm_id));
  let base64data = buff.toString("base64");
  let jailbreak = base64data.substring(base64data.length - 5);
  let datakey = crypto.createHash("sha1").update(jailbreak).digest("hex");
  let post_string = "key=" + datakey + "&data=" + base64data;
  let paramUrl = url + path + post_string;
  const headers = {
    "Content-Type": "application/json",
  };
  var getData = countRowsAll(
    `select * from ${tableTrx} where issync = 0 or issync = 0.0`
  );
  if (getData.length > 0) vmTrx = true;
  if (vmTrx) {
    var download = function (uri, filename, callback) {
      request.head(uri, function (err, res, body) {
        request(uri).pipe(fs.createWriteStream(filename)).on("close", callback);
      });
    };
    GETDATA(paramUrl, headers).then((data) => {
      let countdata = 0;
      if (data.status === 200) {
        const slotServerList = data.data.data;
        let exists = false;
        const dataIs = data.data.data;
        dataLength = dataIs.length;
        let tempArrayExist = [];
        let tempArrayNew = [];
        let tempArrayLast = [];
        for (let i = 0; i < dataIs.length; i++) {
          var dataSlot = dataIs[i];
          console.log("DOWNLOAD ");
          try {
            if (
              fs.existsSync(`./public/images/` + dataSlot.sub_brand + `.jpg`)
            ) {
              //file exists
            } else {
              download(
                dataSlot.image,
                `./public/images/` + dataSlot.sub_brand + ".jpg",
                function () {
                  console.log("done");
                }
              );
            }
          } catch (err) {
            console.error(err);
          }

          if (TESTING) dataSlot.promo_price = 1;
          countdata += 1;
          var query = `select * from slot where no_slot = ${dataSlot.vm_slot}`;
          var check = countRows(query);
          if (check === undefined) {
            var queryInsert =
              "INSERT INTO slot (no_slot,kode_produk,name_produk,onhand,harga_jual,harga_promo,status_promo,image) values(?,?,?,?,?,?,?,?)";
            var dataInsert = [
              dataSlot.vm_slot,
              dataSlot.sku,
              dataSlot.sub_brand,
              dataSlot.qty,
              dataSlot.product_price,
              dataSlot.promo_price,
              dataSlot.promo_status,
              dataSlot.image,
            ];
            var iR = countInsert(queryInsert, dataInsert);
            if (iR.lastInsertRowid > 0) tempArrayNew.push(dataSlot.vm_slot);
          } else {
            var queryUpdate =
              "UPDATE slot set no_slot = ?,kode_produk = ?,name_produk = ?,onhand = ?,harga_jual = ?,harga_promo = ?,status_promo = ?,image = ? where name_produk =? and onhand = ? and harga_jual = ? and harga_promo = ?";
            var dataUpdate = [
              dataSlot.vm_slot,
              dataSlot.sku,
              dataSlot.sub_brand,
              dataSlot.qty,
              dataSlot.product_price,
              dataSlot.promo_price,
              dataSlot.promo_status,
              dataSlot.image,
              dataSlot.sub_brand,
              dataSlot.qty,
              dataSlot.product_price,
              dataSlot.promo_price,
            ];
            var iR = countUpdate(queryUpdate, dataUpdate);
            if (iR.changes > 0) tempArrayExist.push(dataSlot.vm_slot);
          }
          if (countdata === dataIs.length) {
            break;
          } else {
            continue;
          }
        }
        tempArrayLast = tempArrayNew.concat(tempArrayExist);
        var queryDelete = `delete from slot where no_slot not in (${tempArrayLast})`;
        var del = countdeleteBulk(queryDelete);
        if (del.changes > 0) {
          var getData = countRowsAll("select * from slot order by no_slot asc");
          if (getData.length > 0) {
            return true;
          } else {
            return true;
          }
        } else {
          var getData = countRowsAll("select * from slot order by no_slot asc");
          if (getData.length > 0) {
            return true;
          } else {
            return true;
          }
        }
      } else {
        return true;
      }
    });
  }
  return false;
}

async function RefresStock(req, res, next) {
  var getSlotStart = getSlot(req, res, next);
  if (getSlotStart) {
    var runBanner = getBanner(req, res, next);
    if (runBanner) {
      res.status(200).send(success("SUCCESS", res.statusCode));
    } else {
      res.status(200).send(success("SUCCESS", res.statusCode));
    }
  } else {
    res.status(200).send(success("SUCCESS", res.statusCode));
  }
}

async function CreateTrx(req, res, next) {
  try {
    var tableTrx = createifNotExists();
    let url = process.env.VM_DOCK_URL;
    var VM_ID = process.env.VM_ID;
    var VM_NAME = process.env.VM_NAME;
    var PATH = process.env.PATH_TRANSAKSI_GET;
    var body = { vm_code: VM_ID };
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "*/*",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "accept-encoding": "gzip, deflate",
      "cache-control": "no-cache",
    };
    var getData = countRowsAll(
      `select * from ${tableTrx} where issync = 0 or issync = 0.0`
    );

    PUTDATA(
      "https://vm.hollandbakery.co.id/confirm/Dataprogres/",
      body,
      headers
    ).then((data) => {
      console.log("Status", data);
    });
    var jumlahData = 0;
    console.log("DATA TRX", getData.length);
    if (getData.length > 0) {
      for (let i = 0; i < getData.length; i++) {
        var row = getData[i];
        var vx_params = {
          vm_code: row.id_vm,
          transactionId: row.documentno,
          slot: row.no_slot,
          product_code: row.kode_produk,
          product_name: row.name_produk,
          redeem_status: row.rear_status,
          timestamp: row.timestamp,
          error_code: row.error_no,
          error_msg: row.error_msg,
          payment_method: row.payment_type,
          verify_no: row.verify_no,
          harga: row.harga,
          harga_jual: row.harga_jual,
        };
        let buff = new Buffer(JSON.stringify(vx_params));
        let base64data = buff.toString("base64");
        let jailbreak = base64data.substring(base64data.length - 5);
        let dataKey = crypto.createHash("sha1").update(jailbreak).digest("hex");
        //bagian data POSTnya
        var data_post = "key=" + dataKey + "&data=" + base64data;
        let paramUrl = url + PATH + data_post;
        var id = row.id;
        GETDATA(paramUrl, headers).then((data) => {
          if (!data.err) {
            jumlahData++;
            let paramupdate = new Object();
            paramupdate.issync = 1;
            paramupdate.id = id;
            var update = countUpdateItem(
              `update ${tableTrx} set issync = 1 where id =${row.id}`
            );
            if (update.changes > 0) {
              console.log("UPdated");
            }
          } else {
            res.status(400).send(error("NO INTERNET", res.statusCode));
          }
        });
      }
      res.status(200).send(success("SUCCESS", res.statusCode));
    } else {
      res.status(200).send(success("NO TRANSACTION", res.statusCode));
    }
  } catch (ex) {
    next(ex);
  }
}

async function VmStock(req, res, next) {
  try {
    var params = false;
    const { slot } = req.query;
    if (slot != null || slot != undefined) {
      params = true;
    }

    if (!params) {
      res.status(404).send(error("INVALID PARAMETER", res.statusCode));
    } else {
      var getData = countRowsAll(`select * from slot where no_slot = ${slot}`);
      if (getData.length > 0) {
        var stockArray = [];
        for (let i = 0; i < getData.length; i++) {
          const item = getData[i];
          var stock_onhand = item.onhand;
          stock_onhand = stock_onhand - 1;
          var update = countUpdateItem(
            `update slot set onhand = ${stock_onhand} where no_slot =${slot}`
          );
          if (update.changes > 0) {
            res.status(200).send(success("OK", res.statusCode));
          } else {
            res.status(200).send(success("FAILED STOCK", res.statusCode));
          }
        }
      } else {
        res.status(200).send(success("NO DATA", res.statusCode));
      }
    }
  } catch (ex) {
    next(ex);
  }
}

async function VmTrax(req, res, next) {
  try {
    var tableTrx = createifNotExists();
    let url = process.env.VM_DOCK_URL;
    var VM_ID = process.env.VM_ID;
    var params = false;
    const { param } = req.query;
    console.log("QUERY ", param);
    if (param != null || param != undefined) {
      params = true;
    }
    if (params === false) {
      res.status(404).send(error("INVALID PARAMETER", res.statusCode));
    } else {
      console.log("PARAMS ", params);
      var jsonParam = JSON.parse(param);
      console.log("PARAM", jsonParam);
      var datainsert = [
        VM_ID,
        jsonParam["documentno"],
        jsonParam["no_slot"],
        jsonParam["kode_produk"],

        jsonParam["name_produk"],
        jsonParam["rear_status"],
        jsonParam["timestamp"],
        jsonParam["error_no"],
        jsonParam["error_msg"],
        jsonParam["payment_type"],
        jsonParam["verify_no"],
        jsonParam["harga"],
        jsonParam["harga_jual"],
        0,
      ];
      var query = `insert into ${tableTrx} (id_vm,
        documentno,
        no_slot,
        kode_produk,
        name_produk,
        rear_status,
        timestamp,
        error_no,
        error_msg,
        payment_type,
        verify_no,
        harga,
        harga_jual,
        issync) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
      var insertData = countInsert(query, datainsert);
      if (insertData.lastInsertRowid > 0) {
        res.status(200).send(success("SUCCESS", res.statusCode));
      } else {
        res.status(200).send(success("FAILED", res.statusCode));
      }
    }
  } catch (ex) {
    next(ex);
  }
}

module.exports = {
  RefresStock,
  CreateTrx,
  VmStock,
  VmTrax,
};
