var sqlite3 = require("sqlite3").verbose();
var md5 = require("md5");

const DBSOURCE = "db_vm.sqlite";
let db = new sqlite3.Database(DBSOURCE, (err) => {
  const dt = new Date();
  const year = dt.getFullYear();
  const month = (dt.getMonth() + 1).toString().padStart(2, "0");
  const day = dt.getDate().toString().padStart(2, "0");
  console.log(year + "/" + month + "/" + day);
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
        if (err) {
          console.log("Table Banner Already Created");
        } else {
          db.run(`INSERT INTO banner (id_banner, banner_name, banner_type, banner_format, fromdate, todate, banner_url, banner_local, updated, active) VALUES
            (3, 'Diskon 15', 'Screen Saver', 'image', '2023-03-02 00:00:00', '2026-12-17 00:00:00', 'https://vm.hollandbakery.co.id/admin/asset/video/Slide-01.jpg', './assets/media/banner/image/diskon15.jpg', '2023-05-08 08:14:44', 'Y'),
            (4, 'Complain center', 'Screen Saver', 'image', '2023-03-09 00:00:00', '2023-12-24 00:00:00', 'https://vm.hollandbakery.co.id/admin/asset/video/Slide-03.jpg', './assets/media/banner/image/complaincenter.jpg', '2023-05-08 08:14:44', 'Y');`);
        }
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
        if (err) {
          console.log("Table Slot Already Created");
        } else {
          db.run(`INSERT INTO slot (no_slot, kode_produk, name_produk, onhand, harga_jual, harga_promo, status_promo, image, created, updated) VALUES
          (1, '1135', 'Roti Coklat Keju', 2, 12500, 10625, '1', './assets/media/product/1135.jpg', '2023-05-08 15:14:32', '2023-05-08 15:14:32'),
          (3, '1657', 'Korean Garlic Cream Cheese', 1, 14900, 12665, '1', './assets/media/product/1657.jpeg', '2023-05-08 15:14:32', '2023-05-08 15:14:32'),
          (5, '1159', 'Roti Mexican Coffee', 1, 13400, 11390, '1', './assets/media/product/1159.jpg', '2023-05-08 15:08:37', '2023-05-08 15:08:37'),
          (7, '1069', 'Roti Keju Coklat', 2, 10500, 8925, '1', './assets/media/product/1069.jpg', '2023-05-08 15:08:37', '2023-05-08 15:08:37'),
          (9, '1069', 'Roti Keju Coklat', 0, 10500, 8925, '1', './assets/media/product/1069.jpg', '2023-05-08 15:08:37', '2023-05-08 15:08:37'),
          (11, '1178', 'Roti Lady Finger Beef', 1, 16600, 14110, '1', './assets/media/product/1178.jpg', '2023-05-08 15:08:37', '2023-05-08 15:08:37'),
          (13, '1178', 'Roti Lady Finger Beef', 0, 16600, 14110, '1', './assets/media/product/1178.jpg', '2023-05-08 15:08:37', '2023-05-08 15:08:37'),
          (15, '1039', 'Roti Kacang Merah Special', 1, 9700, 8245, '1', './assets/media/product/1039.jpg', '2023-05-08 15:08:37', '2023-05-08 15:08:37'),
          (17, '1009', 'Roti Kelapa', 2, 9700, 8245, '1', './assets/media/product/1009.jpg', '2023-05-08 15:08:37', '2023-05-08 15:08:37'),
          (19, '1009', 'Roti Kelapa', 0, 9700, 8245, '1', './assets/media/product/1009.jpg', '2023-05-08 15:08:38', '2023-05-08 15:08:38'),
          (21, '1001', 'Roti Coklat', 2, 9700, 8245, '1', './assets/media/product/1001.jpg', '2023-05-08 15:08:38', '2023-05-08 15:08:38'),
          (23, '1001', 'Roti Coklat', 0, 9700, 8245, '1', './assets/media/product/1001.jpg', '2023-05-08 15:08:38', '2023-05-08 15:08:38'),
          (25, '2001', 'Donut Sate', 2, 9400, 7990, '1', './assets/media/product/2001.jpg', '2023-05-08 15:08:38', '2023-05-08 15:08:38'),
          (27, '1015', 'Roti Pisang Coklat', 2, 10500, 8925, '1', './assets/media/product/1015.jpg', '2023-05-08 15:08:38', '2023-05-08 15:08:38'),
          (29, '1015', 'Roti Pisang Coklat', 0, 10500, 8925, '1', './assets/media/product/1015.jpg', '2023-05-08 15:08:38', '2023-05-08 15:08:38'),
          (31, '1112', 'Roti Lemper Ayam', 1, 12900, 10965, '1', './assets/media/product/1112.jpg', '2023-05-08 15:08:38', '2023-05-08 15:08:38'),
          (33, '1143', 'Roti Abon Sapi Pedas', 2, 13400, 11390, '1', './assets/media/product/1143.jpg', '2023-05-08 15:08:38', '2023-05-08 15:08:38'),
          (35, '1143', 'Roti Abon Sapi Pedas', 0, 13400, 11390, '1', './assets/media/product/1143.jpg', '2023-05-08 15:08:39', '2023-05-08 15:08:39'),
          (37, '1021', 'Roti Bakso Sapi', 1, 13400, 11390, '1', './assets/media/product/1021.jpg', '2023-05-08 15:08:39', '2023-05-08 15:08:39'),
          (39, '1021', 'Roti Bakso Sapi', 0, 13400, 11390, '1', './assets/media/product/1021.jpg', '2023-05-08 15:08:39', '2023-05-08 15:08:39'),
          (41, '1439', 'Tuna Cheese Wheat Sandwich', 0, 18100, 15385, '1', './assets/media/product/1439.jpg', '2023-05-08 15:08:39', '2023-05-08 15:08:39'),
          (43, '4121', 'Danish Coklat Belepotan', 1, 15000, 12750, '1', './assets/media/product/4121.jpg', '2023-05-08 15:08:39', '2023-05-08 15:08:39'),
          (45, '4121', 'Danish Coklat Belepotan', 0, 15000, 12750, '1', './assets/media/product/4121.jpg', '2023-05-08 15:08:39', '2023-05-08 15:08:39'),
          (47, '1037', 'Roti Mahkota', 2, 13400, 11390, '1', './assets/media/product/1037.jpg', '2023-05-08 15:08:39', '2023-05-08 15:08:39'),
          (49, '4008', 'Chicken Pie', 2, 10500, 8925, '1', './assets/media/product/4008.jpg', '2023-05-08 15:08:40', '2023-05-08 15:08:40'),
          (51, '2005', 'Cheese John', 4, 12000, 10200, '1', './assets/media/product/2005.jpg', '2023-05-08 15:08:40', '2023-05-08 15:08:40'),
          (52, '5003', 'Onde Kacang Hijau', 2, 7400, 6290, '1', './assets/media/product/5003.jpg', '2023-05-08 15:08:40', '2023-05-08 15:08:40'),
          (53, '4017', 'Pastel Kari Sapi', 0, 9400, 7990, '1', './assets/media/product/4017.jpg', '2023-05-08 15:08:40', '2023-05-08 15:08:40'),
          (54, '3100', 'Kue Soes', 2, 8900, 7565, '1', './assets/media/product/3100.jpg', '2023-05-08 15:08:40', '2023-05-08 15:08:40'),
          (55, '4016', 'Pastel Ayam', 0, 9400, 7990, '1', './assets/media/product/4016.jpg', '2023-05-08 15:08:41', '2023-05-08 15:08:41'),
          (56, '5019', 'Bika Ambon Cup', 2, 7600, 6460, '1', './assets/media/product/5019.jpeg', '2023-05-08 15:08:41', '2023-05-08 15:08:41'),
          (57, '3180', 'Soes Marmer', 2, 9400, 7990, '1', './assets/media/product/3180.jpg', '2023-05-08 15:08:41', '2023-05-08 15:08:41'),
          (58, '2004', 'Chocolate John', 3, 9900, 8415, '1', './assets/media/product/2004.jpg', '2023-05-08 15:08:41', '2023-05-08 15:08:41'),
          (59, '4019', 'Risoles Ayam', 2, 8900, 7565, '1', './assets/media/product/4019.jpg', '2023-05-08 15:08:42', '2023-05-08 15:08:42'),
          (60, '5001', 'Lemper Ayam', 5, 9400, 7990, '1', './assets/media/product/5001.jpg', '2023-05-08 15:08:42', '2023-05-08 15:08:42');`);
        }
      }
    );
    db.run(
      `CREATE TABLE trx_2023_05 (
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
      ) `,
      (err) => {
        if (err) {
          console.log("Table trx_2023_05 Already Created");
        } else {
          db.run(`INSERT INTO trx_2023_05 (id, created, id_vm, documentno, no_slot, kode_produk, name_produk, rear_status, timestamp, error_no, error_msg, payment_type, verify_no, harga, harga_jual, issync, updated) VALUES
          (1, '2023-05-08 15:10:44', 'VM_PN_002', 'VM_PN_002-2305e37lmhzp6', '1', '1135', 'Roti Coklat Keju', '0', '1683533444563', '0,93,0,0,93,', 'Rear OK, Product Not Delivered', 'SHOPEEPAY', '1683533433', 12500, 1, '1', '2023-05-08 10:14:13'),
          (2, '2023-05-08 15:10:55', 'VM_PN_002', 'VM_PN_002-2305e37lmhzp6', '3', '1657', 'Korean Garlic Cream Cheese', '0', '1683533455371', '0,93,0,0,93,', 'Rear OK, Product Not Delivered', 'SHOPEEPAY', '1683533433', 14900, 1, '1', '2023-05-08 10:14:13');`);
        }
      }
    );
  }
});

module.exports = db;
