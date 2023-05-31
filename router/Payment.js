const {
  QrCodeShopee,
  PaymentShopee,
  CheckPaymentShopee,
} = require("../controllers/Shopee");
const router = require("express").Router();
router.get("/qr-shopee", QrCodeShopee);
router.get("/payment-shopee", PaymentShopee);
router.post("/check-status-payment-shopee", CheckPaymentShopee);
module.exports = router;
