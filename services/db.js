//const sqlite3 = require("sqlite3").verbose();
const dbName = process.env.DB_NAME;
var Database = require("better-sqlite3");
const db = new Database(dbName, { verbose: console.log });
db.pragma("journal_mode = WAL");
const path = require("path");

const createTableBanner = `create table IF NOT EXISTS banner(
  id_banner int(11) NOT NULL,
  banner_name varchar(255) NOT NULL,
  banner_type varchar(50) NOT NULL,
  banner_format varchar(25) NOT NULL,
  fromdate datetime NOT NULL,
  todate datetime NOT NULL,
  banner_url text NOT NULL,
  banner_local text NOT NULL,
  updated DATETIME DEFAULT CURRENT_TIMESTAMP,
  active char(1) NOT NULL
)
`;

const createTableSlot = `CREATE TABLE  IF NOT EXISTS slot (
  no_slot int(4) NOT NULL,
  kode_produk varchar(15) NOT NULL,
  name_produk varchar(60) NOT NULL,
  onhand int(10) DEFAULT NULL,
  harga_jual double NOT NULL,
  harga_promo double NOT NULL,
  status_promo char(1) DEFAULT NULL,
  image varchar(255) NOT NULL,
  created DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated DATETIME DEFAULT CURRENT_TIMESTAMP
)`;

const createTableTranx = `CREATE TABLE IF NOT EXISTS ${getTrxNameTable()} (
  id int(10) NOT NULL,
  created DATETIME DEFAULT CURRENT_TIMESTAMP,
  id_vm varchar(100) NOT NULL,
  documentno varchar(60) NOT NULL,
  no_slot varchar(10) NOT NULL,
  kode_produk varchar(15) NOT NULL,
  name_produk varchar(60) NOT NULL,
  rear_status varchar(1) NOT NULL,
  timestamp varchar(100) NOT NULL,
  error_no varchar(30) NOT NULL,
  error_msg varchar(255) NOT NULL,
  payment_type varchar(150) NOT NULL,
  verify_no longtext NOT NULL,
  harga double NOT NULL,
  harga_jual double NOT NULL,
  issync char(1) NOT NULL,
  updated DATETIME DEFAULT CURRENT_TIMESTAMP
)`;

db.exec(createTableBanner);
db.exec(createTableSlot);
db.exec(createTableTranx);

function getTrxNameTable() {
  const prefixName = "trx";
  const dt = new Date();
  const year = dt.getFullYear();
  const month = (dt.getMonth() + 1).toString().padStart(2, "0");
  const day = dt.getDate().toString().padStart(2, "0");
  let tableName = prefixName + "_" + year + "_" + month;
  return tableName;
}

module.exports = { db, getTrxNameTable };
