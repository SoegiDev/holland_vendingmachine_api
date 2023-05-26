const {
  WelcomeVendingMachine,
  ListBanner,
  CheckTrxTable,
  ListStock,
} = require("../controllers/VendingMachine");
const router = require("express").Router();
router.get("/welcome", WelcomeVendingMachine);
router.get("/checktabletrx", CheckTrxTable);
router.get("/listbanner", ListBanner);
router.get("/liststock", ListStock);
module.exports = router;
