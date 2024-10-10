const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController");
const authenticateToken = require("../middleware/auth");
const specificPermissionAccess = require("../middleware/specificPermissionAccess");
const blacklistAccess = require("../middleware/blacklistAccess");

router.get(
  "/",
  authenticateToken,
  addressController.getAllAddresses
);
router.post("/", authenticateToken, addressController.createAddress);
router.get(
  "/:id",
  authenticateToken,
  blacklistAccess,
  specificPermissionAccess,
  addressController.getAddressById
);
router.put("/:id", authenticateToken, addressController.updateAddress);
router.delete("/:id", authenticateToken, addressController.deleteAddress);

module.exports = router;
