const express = require('express');
const router = express.Router();
const Project = require('../models/projectModel');

// Route to create a new project
router.post('/createProject', async (req, res) => {
  const { title, userId } = req.body;

  // Validation
  if (!title || !userId) {
    return res.status(400).json({ success: false, message: "Title and userId are required" });
  }

  try {
    // Create a new project
    const newProject = new Project({ title, userId });
    const savedProject = await newProject.save();

    // Send back the created project's ID
    res.status(200).json({ success: true, projectId: savedProject._id });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ success: false, message: "Error creating project" });
  }
});

module.exports = router;
