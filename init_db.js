var sqlite3 = require("sqlite3").verbose();
var md5 = require("md5");

const DBSOURCE = "db_vm.db";
let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.log(err.message);
    throw err;
  } else {
    console.log("Connected to the SQLITE DATABASE");
    db.run(
      `create table banner(
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
    `,
      (err) => {
        console.log("Table Banner Already Created");
      }
    );
    db.run(
      `CREATE TABLE slot (
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
      )`,
      (err) => {
        console.log("Table Slot Already Created");
      }
    );
    const prefixName = "trx";
    const dt = new Date();
    const year = dt.getFullYear();
    const month = (dt.getMonth() + 1).toString().padStart(2, "0");
    const day = dt.getDate().toString().padStart(2, "0");
    let tableName = prefixName + "_" + year + "_" + month;
    const createTable = `CREATE TABLE ${tableName} (
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
    db.run(createTable, (err) => {
      console.log("Table TRX Already Created");
    });
  }
});

module.exports = db;
