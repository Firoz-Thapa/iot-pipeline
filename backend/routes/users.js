const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

// Get User Details
router.post('/getUserDetails', async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ success: false, message: "Missing user ID" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching user details" });
  }
});

module.exports = router;
