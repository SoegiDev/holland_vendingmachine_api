const sqlite = require("sqlite3");
const path = require("path");
const db = new sqlite.Database("db_vm.db", { fileMustExist: true });

function query(sql, params) {
  return db.prepare(sql).all(params);
}

module.exports = {
  query,
};
