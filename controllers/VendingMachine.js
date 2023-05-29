const crypto = require("crypto");
const { toBase64 } = require("request/lib/helpers");
require("dotenv").config();
const axios = require("axios");
const intTrx = require("../init_trx");
const { db, getTrxNameTable } = require("../services/db");
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

module.exports.CheckTrxTable = async (req, res, next) => {
  try {
    let sql = `SELECT *
           FROM ${getTrxNameTable()}
           WHERE issync  = ?`;
    let isSync = 0;

    // first row only
    const data = db.get(sql, [isSync], (err, row) => {
      if (err) {
        return console.error(err.message);
      }
      return row
        ? console.log(row.id, row.name)
        : console.log(`No Data Transaction found with the Status ${isSync}`);
    });
    return res.send(data);
  } catch (ex) {
    next(ex);
  }
};

// GET LIST BANNER
module.exports.ListBanner = async (req, res, next) => {
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
    let date_time = new Date();
    GETDATA(paramUrl, headers).then((data) => {
      let dataIs = [];
      console.log("BANNER", data.data.data);
      let countdata = 0;
      if (data.status === "OK") {
        let exists = false;
        dataIs = data.data.data;
        dataLength = dataIs.length;
        let tempArrayExist = [];
        let tempArrayNew = [];
        let tempArrayLast = [];
        for (let i = 0; i < dataIs.length; i++) {
          var dataBanner = dataIs[i];
          countdata += 1;
          var query = `select * from banner where id_banner = '${dataBanner.id}' and banner_name = '${dataBanner.name}' `;
          var check = countRows(query);
          if (check === undefined) {
            var iR = countInserBanner(dataBanner);
            if (iR.lastInsertRowid > 0) tempArrayNew.push(dataBanner);
          } else {
            var iR = countUpdateBanner(dataBanner);
            if (iR.changes > 0) tempArrayExist.push(dataBanner);
          }
          if (countdata === dataIs.length) {
            break;
          } else {
            continue;
          }
        }
        // tempArrayLast = tempArrayNew.concat(tempArrayExist);
        // var del = deleteBannerBulk(tempArrayLast);
        // if (del.changes > 0) console.log("Sukses Deleted");
        var lastData = countRowsAll(
          `select * from banner where banner_format = 'image' and active = 'Y'`
        );
        console.log(lastData);
        const resData = {
          status: "OK",
          statusDescription: "Successfully Get Data",
          data: lastData,
        };
        res.status(200).send(resData);
      } else {
        const resData = {
          status: "OK",
          statusDescription: "NO DATA",
          data: null,
        };
        res.status(200).send(resData);
      }
    });
    //res.json(dataRet);
  } catch (ex) {
    next(ex);
  }
};

// GET LIST Stock
module.exports.ListStockOffline = async (req, res, next) => {
  try {
    var lastData = countRowsAll("select * from slot order by no_slot asc");
    if (lastData !== undefined) {
      const resData = {
        status: "OK",
        statusDescription: "Successfully Get Data",
        data: lastData,
      };
      res.status(200).send(resData);
    } else {
      const resData = {
        status: "OK",
        statusDescription: "Data is Empty",
        data: null,
      };
      res.status(200).send(resData);
    }
  } catch (ex) {
    next(ex);
  }
};

// GET LIST Stock
module.exports.ListStock = async (req, res, next) => {
  try {
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
    GETDATA(paramUrl, headers).then((data) => {
      let countdata = 0;
      if (data.status === "OK") {
        const slotServerList = data.data.data;
        let exists = false;
        const dataIs = data.data.data;
        dataLength = dataIs.length;
        let tempArrayExist = [];
        let tempArrayNew = [];
        let tempArrayLast = [];
        for (let i = 0; i < dataIs.length; i++) {
          var dataSlot = dataIs[i];
          countdata += 1;
          var query = `select * from slot where no_slot = ${dataSlot.vm_slot}`;
          var check = countRows(query);
          if (check === undefined) {
            var iR = countInsertSlot(dataSlot);
            if (iR.lastInsertRowid > 0) tempArrayNew.push(dataSlot);
          } else {
            var iR = countUpdateSlot(dataSlot);
            if (iR.changes > 0) tempArrayExist.push(dataSlot);
          }
          if (countdata === dataIs.length) {
            break;
          } else {
            continue;
          }
        }
        tempArrayLast = tempArrayNew.concat(tempArrayExist);
        var del = deleteSlotBulk(tempArrayLast);
        if (del.changes > 0) console.log("Sukses Deleted");
        var lastData = countRowsAll("select * from slot order by no_slot asc");
        const resData = {
          status: "OK",
          statusDescription: "Successfully Get Data",
          data: lastData,
        };
        res.status(200).send(resData);
      } else {
        const resData = {
          status: "OK",
          statusDescription: "NO DATA",
          data: null,
        };
        res.status(200).send(resData);
      }
    });
    //res.status(200).send({ jumlah: count });
  } catch (ex) {
    next(ex);
  }
};

// Create Transaction
async function GETDATA(paramUrl, head) {
  let datas = await axios
    .get(paramUrl, {
      headers: head,
    })
    .then((response) => {
      const resData = {
        status: "OK",
        statusDescription: "The Latest Item",
        data: response.data,
      };
      return resData;
    })
    .catch((err) => {
      // Handle errors
      const resData = {
        status: "ERROR",
        statusDescription: err.message,
        data: response.data,
      };
      return resData;
    });
  return datas;
}

// CREA
async function POSTDATA(paramUrl, head, body, messageSuccess, messageError) {
  let trx = await axios
    .post(paramUrl, body, {
      headers: head,
    })
    .then((response) => {
      const resData = {
        status: "OK",
        statusDescription: messageSuccess,
        data: response.data,
      };
      return resData;
    })
    .catch((err) => {
      // Handle errors
      const resData = {
        status: "ERROR",
        statusDescription: err.message,
        data: null,
      };
      return resData;
    });
  return datas;
}

function countRows(sqlQuery) {
  const stmt = db.prepare(sqlQuery);
  const row = stmt.get();
  return row;
}
function countRowsAll(sqlQuery) {
  const stmt = db.prepare(sqlQuery);
  const row = stmt.all();
  console.log("GetAll", row);
  return row;
}

function deleteSlotBulk(itemLast) {
  let arr = [];
  for (let index = 0; index < itemLast.length; index++) {
    const element = itemLast[index];
    arr.push(element.vm_slot);
  }

  var params = arr.join(", ");
  console.log("ASD", params);
  const stmt = db.prepare("delete from slot where no_slot in (?)");
  const row = stmt.run(params);
  console.log(row);
  return row;
}

function deleteBannerBulk(itemLast) {
  let arr = [];
  for (let index = 0; index < itemLast.length; index++) {
    const element = itemLast[index];
    arr.push(element.name);
  }

  var params = arr.join(", ");
  console.log("ASD", params);
  const stmt = db.prepare("delete from banner where banner_name in (?)");
  const row = stmt.run(params);
  console.log(row);
  return row;
}

function countInsertSlot(item) {
  const stmt = db.prepare(
    "INSERT INTO slot (no_slot,kode_produk,name_produk,onhand,harga_jual,harga_promo,status_promo,image) values(?,?,?,?,?,?,?,?)"
  );
  const info = stmt.run(
    item.vm_slot,
    item.sku,
    item.sub_brand,
    item.qty,
    item.product_price,
    item.promo_price,
    item.promo_status,
    item.image
  );
  console.log("Insert data", info);
  return info;
}

function countUpdateSlot(item) {
  const stmt = db.prepare(
    "UPDATE slot set no_slot = ?,kode_produk = ?,name_produk = ?,onhand = ?,harga_jual = ?,harga_promo = ?,status_promo = ?,image = ? where name_produk =? and onhand = ? and harga_jual = ? and harga_promo=?"
  );
  const info = stmt.run(
    item.vm_slot,
    item.sku,
    item.sub_brand,
    item.qty,
    item.product_price,
    item.promo_price,
    item.promo_status,
    item.image,
    item.sub_brand,
    item.qty,
    item.product_price,
    item.promo_price
  );
  console.log("UPDATE data", info);
  return info;
}

function countInserBanner(item) {
  const stmt = db.prepare(
    "INSERT INTO banner (id_banner,banner_name,banner_type,banner_format,fromdate,todate,banner_url,banner_local,active) values(?,?,?,?,?,?,?,?,?)"
  );

  const info = stmt.run(
    item.id,
    item.name,
    item.type,
    item.format,
    item.fromdate,
    item.todate,
    item.url,
    item.url,
    item.isactive
  );
  console.log("Insert Banner", info);
  return info;
}

function countUpdateBanner(item) {
  const stmt = db.prepare(
    "UPDATE banner set id_banner = ?, banner_name = ?, banner_type = ?, banner_format = ?, fromdate = ?, todate = ?, banner_url = ?, banner_local = ? , active = ? where id_banner =? and banner_name = ? and banner_type = ? and fromdate=?"
  );
  const info = stmt.run(
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
    item.fromdate
  );
  console.log("UPDATE data", info);
  return info;
}

function RefreshBanner() {
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
  axios
    .get(paramUrl, {
      headers: headers,
    })
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      // Handle errors
      console.error(err);
    });
}
