const {
  WelcomeVendingMachine,
  get_slot,
  get_banner_image,
  get_banner_video,
  getVMAccount,
} = require("../controllers/Vending");
const router = require("express").Router();
router.get("/welcome", WelcomeVendingMachine);
router.get("/get-slot", get_slot);
router.get("/get-banner-image", get_banner_image);
router.get("/get-banner-video", get_banner_video);
router.get("/get-vm", getVMAccount);

module.exports = router;
