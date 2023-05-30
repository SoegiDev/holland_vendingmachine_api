const {
  ListStockOnline,
  ListBannerImageOnline,
  CreateTrx,
} = require("../controllers/Api");

const router = require("express").Router();
router.get("/get-slot", ListStockOnline);
router.get("/get-banner-image", ListBannerImageOnline);
router.get("/create-trx", CreateTrx);
module.exports = router;
