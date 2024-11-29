const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController");
const authenticateToken = require("../middleware/auth");

router.get("/", authenticateToken, addressController.getAddressById);
router.get("/states", authenticateToken, addressController.getStates);
router.get("/cities", authenticateToken, addressController.getCities);
router.get("/districts", authenticateToken, addressController.getDistricts);
router.get("/villages", authenticateToken, addressController.getVillages);
// router.post("/", authenticateToken, addressController.createAddress);
router.get(
  "/:id",
  authenticateToken,
  addressController.getAddressById
);
// router.put("/:id", authenticateToken, addressController.updateAddress);
// router.delete("/:id", authenticateToken, addressController.deleteAddress);

module.exports = router;
