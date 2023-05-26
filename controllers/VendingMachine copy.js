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
    //res.json(dataRet);
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

    // CHECK ISSYNC
    let query_check_issync = `SELECT *
    FROM ${getTrxNameTable()}
    WHERE issync  = ?`;
    let isSync = 0;

    let trx_count = `SELECT count(*) as count
    FROM ${getTrxNameTable()}`;

    // first row only
    db.get(trx_cond, [isSync], (err, row) => {
      if (err) {
        console.log("Error List Stock");
        return console.error(err.message);
        const resData = {
          status: "Error",
          statusDescription: err.message,
        };
        res.status(404).send(resData);
      }
      if (row) {
        console.log("GET DATA FROM SERVER");
        GETDATA(paramUrl, headers).then((data) => {
          const slotServerList = data.data.data;
          if (data.status === "OK") {
            res.status(200).send(data);
          } else {
            res.status(500).send(data);
          }
        });
      } else {
        console.log("Synchronize Data");
        db.all(trx_count, [], (err, results) => {
          var len = results[0].count;
          if (len === 0) {
            GETDATA(paramUrl, headers).then((data) => {
              if (data.status === "OK") {
                let paramslot = [];
                let insertData = [];
                const arrayList = data.data.data;
                arrayList.map((item, index) => {
                  paramslot.push(item.id_slot);
                  let insert_slot = `INSERT INTO slot (no_slot,kode_produk,name_produk,onhand,harga_jual,harga_promo,status_promo,image) values(?,?,?,?,?,?,?,?)`;
                  db.run(
                    insert_slot,
                    [
                      item.vm_slot,
                      item.sku,
                      item.sub_brand,
                      item.qty,
                      item.product_price,
                      item.promo_price,
                      item.promo_status,
                      item.image,
                    ],
                    (err) => {
                      if (err) {
                        return console.log(err.message);
                      }
                      console.log("Row was added to the table: ${this.lastID}");
                    }
                  );
                });
                res.status(200).send(data);
              } else {
                res.status(500).send(data);
              }
            });
          } else {
            const resData = {
              status: "OK",
              statusDescription: "The Latest Item",
              totalRow: len,
            };
            res.status(200).send(resData);
          }
        });
      }
    });
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
        data: response.data,
      };
      return resData;
    });
  return datas;
}

function countRows(sqlQuery) {
  rowData = [];
  db.all(sqlQuery, (error, rows) => {
    rows.forEach((row) => {
      rowData.push(row);
    });
  });
  return rowData;
}
