const express = require("express");
const {
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getEnquiry,
  getAllEnquiry,
} = require("../controllers/enquiryController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/add_Enquiry", createEnquiry);
router.put("/update_Enquiry/:id", authMiddleware, isAdmin, updateEnquiry);
router.delete("/delete_Enquiry/:id", authMiddleware, isAdmin, deleteEnquiry);
router.get("/getEnquiry/:id", getEnquiry);
router.get("/Enquiries", getAllEnquiry);

module.exports = router;
