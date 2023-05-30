const { CreateTrx } = require("../controllers/Api");
const {
  WelcomeVendingMachine,
  ListBanner,
  ListStock,
  ListStockOffline,
} = require("../controllers/Vending");
const {
  QrCodeShopee,
  PaymentShopee,
  CheckPaymentShopee,
} = require("../controllers/Shopee");
const router = require("express").Router();
router.get("/welcome", WelcomeVendingMachine);
router.get("/listbanner", ListBanner);
router.get("/liststock", ListStock);
router.get("/liststock_offline", ListStockOffline);
router.get("/qr-shopee", QrCodeShopee);
router.get("/payment-shopee", PaymentShopee);
router.post("/check-status-payment-shopee", CheckPaymentShopee);
router.get("/create-trx", CreateTrx);
module.exports = router;
