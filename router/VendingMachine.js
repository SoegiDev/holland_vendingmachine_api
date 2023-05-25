const {
  WelcomeVendingMachine,
  ListBanner,
} = require("../controllers/VendingMachine");
const router = require("express").Router();
router.get("/welcome", WelcomeVendingMachine);
router.get("/listbanner", ListBanner);
module.exports = router;
