var sqlite3 = require("sqlite3").verbose();
const DBSOURCE = "db_vm.db";
let isExists = false;
module.exports = function () {
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

  let checkdb = new sqlite3.Database(DBSOURCE, (err) => {
    checkdb.run(createTable, (err) => {
      if (err) {
        return false;
      } else {
        return true;
      }
    });
  });
  return checkdb;
};
