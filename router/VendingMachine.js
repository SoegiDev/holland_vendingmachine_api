const {
  WelcomeVendingMachine,
  ListStockOffline,
  ListBannerImageOffline,
  ListBannerVideoOffline,
} = require("../controllers/Vending");
const router = require("express").Router();
router.get("/welcome", WelcomeVendingMachine);
router.get("/get-slot", ListStockOffline);
router.get("/get-banner-image", ListBannerImageOffline);
router.get("/get-banner-video", ListBannerVideoOffline);
module.exports = router;
