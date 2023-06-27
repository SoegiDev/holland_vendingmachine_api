const crypto = require("crypto");
const { toBase64 } = require("request/lib/helpers");
require("dotenv").config();
const axios = require("axios");
const intTrx = require("../init_trx");
const { db, getTrxNameTable } = require("../services/db");

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

function countInsert(query, item) {
  // var params = item.join(", ");
  const stmt = db.prepare(query);
  const row = stmt.run(item);
  return row;
}

function countdeleteBulk(query) {
  console.log(query);
  const stmt = db.prepare(query);
  const row = stmt.run();
  return row;
}

function countUpdate(query, item) {
  // var params = item.join(", ");
  // console.log(params);
  console.log(item);
  const stmt = db.prepare(query);
  const row = stmt.run(item);
  console.log("UPDATE data", row);
  return row;
}

function countUpdateItem(query) {
  // var params = item.join(", ");
  // console.log(params);
  const stmt = db.prepare(query);
  const row = stmt.run();
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

module.exports = {
  countInsert,
  countRows,
  countRowsAll,
  countdeleteBulk,
  countUpdate,
  countUpdateItem,
};
