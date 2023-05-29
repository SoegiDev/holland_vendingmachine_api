const {
  WelcomeVendingMachine,
  ListBanner,
  CheckTrxTable,
  ListStock,
  ListStockOffline,
} = require("../controllers/VendingMachine");
const router = require("express").Router();
router.get("/welcome", WelcomeVendingMachine);
router.get("/checktabletrx", CheckTrxTable);
router.get("/listbanner", ListBanner);
router.get("/liststock", ListStock);
router.get("/liststock_offline", ListStockOffline);
module.exports = router;
