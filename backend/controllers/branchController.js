const Branch = require('../models/Branch');


// GET all branches
exports.getAllBranches = async (req, res) => {
  try {
    const branches = await Branch.find().sort({ name: 1 });
    res.status(200).json(branches);
  } catch (error) {
    console.error('❌ getAllBranches:', error);
    res.status(500).json({ error: 'Failed to fetch branches' });
  }
};

// CREATE branch
exports.createBranch = async (req, res) => {
  try {
    const { name, code, description } = req.body;

    const exists = await Branch.findOne({ code });
    if (exists) {
      return res.status(400).json({ error: 'Branch already exists' });
    }

    const branch = await Branch.create({ name, code, description });
    res.status(201).json(branch);
  } catch (error) {
    console.error('❌ createBranch:', error);
    res.status(500).json({ error: 'Failed to create branch' });
  }
};

// UPDATE branch
exports.updateBranch = async (req, res) => {
  try {
    const branch = await Branch.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!branch) {
      return res.status(404).json({ error: 'Branch not found' });
    }

    res.status(200).json(branch);
  } catch (error) {
    console.error('❌ updateBranch:', error);
    res.status(500).json({ error: 'Failed to update branch' });
  }
};

// DELETE branch
exports.deleteBranch = async (req, res) => {
  try {
    const branch = await Branch.findByIdAndDelete(req.params.id);

    if (!branch) {
      return res.status(404).json({ error: 'Branch not found' });
    }

    res.status(200).json({ message: 'Branch deleted successfully' });
  } catch (error) {
    console.error('❌ deleteBranch:', error);
    res.status(500).json({ error: 'Failed to delete branch' });
  }
};
