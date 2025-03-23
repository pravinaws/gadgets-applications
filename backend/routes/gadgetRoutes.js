const express = require("express");
const router = express.Router();
const gadgetController = require("../controllers/gadgetController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/all", authMiddleware, gadgetController.getAllGadgets);
router.get("/details/:id", authMiddleware, gadgetController.getGadgetById);
router.post("/create", authMiddleware, gadgetController.createGadget);
router.put("/update/:id", authMiddleware, gadgetController.updateGadget);
router.delete("/delete/:id", authMiddleware, gadgetController.deleteGadget);

module.exports = router;
