var sqlite3 = require("sqlite3").verbose();
const DBSOURCE = "db_vm.db";
let isExists = false;
module.exports = function () {
  checkIfExists(function (err, isExists) {
    let is = false;
    console.log(err, isExists);
    if (isExists !== undefined) {
      console.log("ADA");
      is = true;
    } else {
      is = false;
    }
  });
};

function checkIfExists(callback) {
  var db = new sqlite3.Database(DBSOURCE);
  const prefixName = "trx";
  const dt = new Date();
  const year = dt.getFullYear();
  const month = (dt.getMonth() + 1).toString().padStart(2, "0");
  const day = dt.getDate().toString().padStart(2, "0");
  let tableName = prefixName + "_" + year + "_" + month;
  console.log(tableName);
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

  db.get(
    `SELECT name FROM sqlite_master WHERE type='table' AND name="${tableName}"`,
    function (err, row) {
      console.log(row);
      if (row !== undefined) {
        console.log(
          `table ${tableName} . cleaning existing records ${row.length}`
        );
        callback(err, row);
      } else {
        console.log("creating table");
        db.run(createTable, (err) => {
          console.log("Table TRX Already Created");
        });
        callback(null, null);
      }
    }
  );
}
