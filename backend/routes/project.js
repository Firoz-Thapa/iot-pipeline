const express = require('express');
const router = express.Router();
const Project = require('../models/projectModel'); // Adjust the path if necessary

// Create a new project
router.post('/createProject', async (req, res) => {
    const { title, userId } = req.body;

    try {
        const newProject = new Project({
            title,
            userId,
            date: new Date(), // Add current date
        });

        const savedProject = await newProject.save();
        res.json({ success: true, projectId: savedProject._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error creating project' });
    }
});

// Fetch all projects for a user
router.post('/getProjects', async (req, res) => {
    const { userId } = req.body;

    try {
        const projects = await Project.find({ userId });
        res.json({ success: true, projects });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching projects' });
    }
});

// Delete a project
router.delete('/deleteProject/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProject = await Project.findByIdAndDelete(id);
        if (!deletedProject) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }
        res.json({ success: true, message: 'Project deleted successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error deleting project' });
    }
});

module.exports = router;
