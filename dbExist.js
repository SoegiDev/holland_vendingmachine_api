var sqlite3 = require("sqlite3").verbose();
const createTable = `CREATE TABLE trx_2023_07 (
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

const DBSOURCE = "db_vm.sqlite";
let checkdb = new sqlite3.Database(DBSOURCE, (err) => {
  checkdb.run(createTable, (err) => {
    if (err) {
      console.log("Table Banner Already Created");
      return false;
    } else {
      return true;
    }
  });
});
