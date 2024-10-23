const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel'); // Adjust the path if necessary

// User sign up
router.post('/signUp', async (req, res) => {
  const { name, username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({
      name,
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();
    res.json({ success: true, message: 'User created successfully!' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error creating user' });
  }
});

// Get user details
router.post('/getUserDetails', async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching user details' });
  }
});

module.exports = router;
