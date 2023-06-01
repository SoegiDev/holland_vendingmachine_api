const {
  ListStockOnline,
  ListBannerImageOnline,
  CreateTrx,
  VmStock,
  VmTrx,
} = require("../controllers/Api");

const router = require("express").Router();
router.get("/get-slot", ListStockOnline);
router.get("/get-banner-image", ListBannerImageOnline);
router.get("/create-trx", CreateTrx);
router.get("/vm-stock", VmStock);
router.get("/vm-trx", VmTrx);
module.exports = router;
