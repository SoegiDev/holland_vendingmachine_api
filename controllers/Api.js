const crypto = require("crypto");
const { toBase64 } = require("request/lib/helpers");
require("dotenv").config();
const axios = require("axios");
const intTrx = require("../init_trx");
const { db, getTrxNameTable, createifNotExists } = require("../services/db");
const { success, error, validation } = require("../model/responseApi");

const { GETDATA, POSTDATA } = require("../model/Online");
const {
  countInsert,
  countRowsAll,
  countdeleteBulk,
  countRows,
  countUpdate,
} = require("../model/Offline");
let TESTING = true;
ListStockOnline = async (req, res, next) => {
  try {
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
    var getData = countRowsAll(`select * from ${tableTrx} where issync = 0`);
    if (getData.length > 0) vmTrx = true;
    if (vmTrx) {
      var BaseUrl2 = "http://localhost:3000/api/";
      var PATH2 = "create-trx";
      let paramUrl2 = BaseUrl2 + PATH2;
      GETDATA(urlTrx, headers).then((data) => {
        if (data.status === 200) {
          vmTrx = true;
        } else {
          vmTrx = false;
        }
      });
    } else {
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
            var getData = countRowsAll(
              "select * from slot order by no_slot asc"
            );
            if (getData.length > 0) {
              res
                .status(200)
                .send(success("OK", { data: getData }, res.statusCode));
            } else {
              res.status(200).send(success("NO DATA", res.statusCode));
            }
          } else {
            var getData = countRowsAll(
              "select * from slot order by no_slot asc"
            );
            if (getData.length > 0) {
              res
                .status(200)
                .send(success("OK", { data: getData }, res.statusCode));
            } else {
              res.status(200).send(success("NO DATA", res.statusCode));
            }
          }
        } else {
          res
            .status(404)
            .send(success("OK", { info: "Data tidak ada" }, res.statusCode));
        }
      });
    }

    //res.status(200).send({ jumlah: count });
  } catch (ex) {
    next(ex);
  }
};

ListBannerImageOnline = async (req, res, next) => {
  try {
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
            res
              .status(200)
              .send(success("OK", { data: getData }, res.statusCode));
          } else {
            res.status(200).send(success("NO DATA", res.statusCode));
          }
        } else {
          var getData = countRowsAll(
            "select * from banner where banner_format = 'image' and active = 'Y'"
          );
          if (getData.length > 0) {
            res
              .status(200)
              .send(success("OK", { data: getData }, res.statusCode));
          } else {
            res.status(200).send(success("NO DATA", res.statusCode));
          }
        }
      } else {
        res
          .status(404)
          .send(success("OK", { info: "Data tidak ada" }, res.statusCode));
      }
    });
    //res.status(200).send({ jumlah: count });
  } catch (ex) {
    next(ex);
  }
};

CreateTrx = async (req, res, next) => {
  try {
    var tableTrx = createifNotExists();
    let url = process.env.VM_DOCK_URL;
    var VM_ID = process.env.VM_ID;
    var VM_NAME = process.env.VM_NAME;
    var PATH = process.env.PATH_TRANSAKSI_PUT;
    var body = { vm_code: VM_ID };
    const headers = {
      "Content-Type": "application/json",
      Accept: "*/*",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "accept-encoding": "gzip, deflate",
      "cache-control": "no-cache",
    };
    var getData = countRowsAll(`select * from ${tableTrx} where issync = 0`);
    console.log("DATA TRX", getData.length);
    if (getData.length > 0) {
      for (let i = 0; i < getData.length; i++) {
        var row = getData[i];
        $vx_params = {
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
        let buff = new Buffer(JSON.stringify($vx_params));
        let base64data = buff.toString("base64");
        let jailbreak = base64data.substring(base64data.length - 5);
        let datakey = crypto.createHash("sha1").update(jailbreak).digest("hex");
        //bagian data POSTnya
        var data_post = "key=" + dataKey + "&data=" + base64data;
        let paramUrl = url + PATH + data_post;
        var id = row.id;
        GETDATA(paramUrl, headers).then((data) => {
          if (!data.err) {
            let paramupdate = new Object();
            paramupdate.issync = 1;
            paramupdate.id = id;
            var iR = countUpdatTrx(paramupdate);
            if (iR.changes > 0) {
              console.log("UPdated");
            }
            res.status(200).send(success("SUCCESS", res.statusCode));
          } else {
            res.status(400).send(error("NO INTERNER", res.statusCode));
          }
        });
      }
    } else {
      res.status(200).send(success("NO TRANSACTION", res.statusCode));
    }
  } catch (ex) {
    next(ex);
  }
};

VmStock = async (req, res, next) => {
  try {
    var params = false;
    const { slot } = req.query;
    if (req.query === null || req.query === undefined) {
      params = true;
    }

    if (!params) {
      res.status(404).send(error("INVALID PARAMETER", res.statusCode));
    } else {
      var getData = countRowsAll(`select * from slot where slot = ${slot}`);
      if (getData.length > 0) {
        var stockArray = [];
        for (let i = 0; i < getData.length; i++) {
          const item = getData[i];
          var stock_onhand = item.onhand;
          stock_onhand = stock_onhand - 1;
          var update = countUpdate(
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
};

VmTrx = async (req, res, next) => {
  try {
    var tableTrx = createifNotExists();
    let url = process.env.VM_DOCK_URL;
    var VM_ID = process.env.VM_ID;
    var params = false;
    const { param } = req.query;
    if (req.query === null || req.query === undefined) {
      params = true;
    }
    if (!params) {
      res.status(404).send(error("INVALID PARAMETER", res.statusCode));
    } else {
      var jsonParam = JSON.parse(param);
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
      var query = `insert into ${tableTrx} (id_vm,documentno,no_slot,kode_produk,name_produk,rear_produk,timestamp,error_no,error_msg,payment_type,verify_no,harga,harga_jual,issync)`;
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
};

module.exports = {
  ListStockOnline,
  ListBannerImageOnline,
  CreateTrx,
  VmStock,
  VmTrx,
};
