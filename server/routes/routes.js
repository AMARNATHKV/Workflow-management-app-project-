const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");
const verifyToken = require("../middleware/authMiddleware");
const Feedback = require("../models/Feedback");
const { default: mongoose } = require("mongoose");


//*Creation Of Project
router.post('/projects', verifyToken, async (req, res) => {
  try {
    const { name, description, invitestaff } = req.body;

    // Validate input
    if (!name || !description || !Array.isArray(invitestaff)) {
      return res.status(400).json({ error: 'Invalid data' });
    }

    const users = await User.find({ username: { $in: invitestaff } });


    if (users.length !== invitestaff.length) {
      const invalidUsernames = invitestaff.filter(username => !users.some(user => user.username === username));
      return res.status(400).json({ error: `User(s) not found: ${invalidUsernames.join(', ')}` });
    }

    // Create a new project
    const newProject = new Project({
      name,
      description,
      invitestaff: invitestaff.map(username => ({
        username,
        createdAt: new Date(),
      })),
    });

    // Save the project to the database
    await newProject.save();

    res.status(201).json({ message: 'Project created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});



//*View Projects for manager
router.get("/projects", verifyToken, async (req, res) => {
  if (req.userType !== "manager") return res.status(403).json({ error: "Access denied" });

  try {
    const projects = await Project.find({ manager: req.username });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

  
//to show all projectdetails
router.get('/projects/id/:projectId', verifyToken, async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findOne({ _id: projectId });
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Delete project
router.delete("/projects/:projectId", verifyToken, async (req, res) => {
  if (req.userType !== "manager") return res.status(403).json({ error: "Access denied" });

  const { projectId } = req.params;
  try {
    const project = await Project.findByIdAndDelete(projectId);
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete project" });
  }
});



router.post('/tasks', verifyToken, async (req, res) => {
  try {
    const { title, description, dueDate, assignedTo, status, projectId } = req.body;

    
    if (req.userType !== 'manager') {
      return res.status(403).json({ error: 'Access denied' });
    }
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Create the new task
    const newTask = new Task({
      title,
      description,
      dueDate,
      assignedTo,
      status,
      projectId: project._id,
    });

    
    await newTask.save();

    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Server error' });
  }
});



router.get('/tasks/user', verifyToken, async (req, res) => {
  
  try {

    
    const user=await User.findOne({_id:req.userId})

    const tasks = await Task.find({ assignedTo:user.username });
  
    if (tasks.length === 0) {
      return res.status(404).json({ message: 'No tasks found for this user' });
    }
       
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



router.get('/projects/:projectId', verifyToken, async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }


    res.status(200).json(project.invitestaff);
  } catch (error) {
    console.error('Error fetching project details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update task status
router.put("/tasks/:taskId", verifyToken, async (req, res) => {
  if (req.userType !== "staff") return res.status(403).json({ error: "Access denied" });

  const { taskId } = req.params;
  const { status } = req.body;
  try {
    const task = await Task.findByIdAndUpdate(taskId, { status }, { new: true });
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to update task status" });
  }
});


router.get('/projects/:id/name', verifyToken,async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (project) {
      res.json({ name: project.name });
    } else {
      res.status(404).json({ error: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


// *Sort staff by task status
router.get('/:projectId/sorted-staff',verifyToken, async (req, res) => {
  const { projectId } = req.params;
  const { status } = req.query;

  try {
    // If status is not provided or invalid, return an error
    if (!status || !['pending', 'in-progress', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Find tasks by projectId and status
    const tasks = await Task.find({ projectId, status });

    // Get unique staff usernames from the tasks
    const staff = [...new Set(tasks.map(task => task.assignedTo))];

    res.json(staff);
  } catch (error) {
    console.error('Error fetching sorted staff:', error);
    res.status(500).json({ error: 'Failed to fetch sorted staff' });
  }
});


router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password'); // Exclude password from response
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      username: user.username,
      email: user.email,
      userType: user.userType,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
});



router.put('/tasks/:taskId/status', verifyToken, async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  try {
    const task = await Task.findByIdAndUpdate(
      taskId,
      { status },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json({ message: 'Task status updated successfully', task });
  } catch (error) {
    console.error('Error updating task status:', error);
    res.status(500).json({ error: 'Failed to update task status' });
  }
});



router.put('/projects/:projectId/status',verifyToken, async (req, res) => {
  const { projectId } = req.params;
  const { status } = req.body;

  try {
    const project = await Project.findByIdAndUpdate(
      projectId,
      { status },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.status(200).json({ message: 'Project status updated successfully', project });
  } catch (error) {
    console.error('Error updating project status:', error);
    res.status(500).json({ error: 'Failed to update project status' });
  }
});


router.get('/projects/:projectId/tasks', verifyToken, async (req, res) => {
  const { projectId } = req.params;
  console.log(projectId);
  try {
    const tasks = await Task.find({ projectId });
    console.log(tasks);
    
    if (!tasks) {
      return res.status(404).json({ error: 'No tasks found for this project' });
    }
    

    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});



router.get('/tasks/:taskId',verifyToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

//*create feedback 
router.post('/tasks/:taskId/feedback',verifyToken, async (req, res) => {
  try {
    const { taskId } = req.params;
    const { feedback, status } = req.body;
    console.log(req.params);
    
 
    if (!feedback || !status) {
      return res.status(400).json({ error: 'Feedback and status are required' });
    }
   
    const newFeedback = await Feedback.create({ taskId, feedback, status });

    const updatedTask = await Task.findByIdAndUpdate(taskId, { status }, { new: true });

    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json({ message: 'Feedback and status updated successfully', feedback: newFeedback });
  } catch (error) {
    console.error('Error submitting feedback and updating status:', error);
    res.status(500).json({ error: 'Failed to submit feedback and update status' });
  }
});

router.get('/feedback/user', verifyToken, async (req, res) => {
  try {
    // Fetch the logged-in user
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch tasks assigned to the logged-in user
    const tasks = await Task.find({ assignedTo: user.username });
    
    if (tasks.length === 0) {
      return res.status(404).json({ message: 'No tasks found for this user' });
    }

    // Extract task IDs from the tasks
    const taskIds = tasks.map(task => task._id);

    // Fetch feedbacks for these task IDs
    const feedbacks = await Feedback.find({ taskId: { $in: taskIds } }).select('-taskId');

    if (feedbacks.length === 0) {
      return res.status(404).json({ message: 'No feedback found for this user' });
    }

    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/projects/:projectId/monthly-report', verifyToken, async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const tasks = await Task.find({ projectId });

    if (!tasks) {
      return res.status(404).json({ error: 'No tasks found for this project' });
    }

    const statusCounts = {
      pending: 0,
      'in-progress': 0,
      completed: 0,
    };

    tasks.forEach(task => {
      statusCounts[task.status]++;
    });

    res.status(200).json(statusCounts);
  } catch (error) {
    console.error('Error fetching monthly report:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
