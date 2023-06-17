const {
  qrcode_shopee,
  payment_shopee,
  check_status_payment_shopee,
} = require("../controllers/Shopee");
const router = require("express").Router();
router.get("/qr-shopee", qrcode_shopee);
router.get("/payment-shopee", payment_shopee);
router.get("/check-status-payment-shopee", check_status_payment_shopee);
module.exports = router;
