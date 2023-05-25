const {
  WelcomeVendingMachine,
  ListBanner,
  CheckTrxTable,
} = require("../controllers/VendingMachine");
const router = require("express").Router();
router.get("/welcome", WelcomeVendingMachine);
router.get("/checktabletrx", CheckTrxTable);
router.get("/listbanner", ListBanner);
module.exports = router;
