import Project from '../models/Project.js';

export const createProject = async (req, res) => {
  const { title, description, skillsRequired } = req.body;
  try {
    const project = await Project.create({
      title,
      description,
      skillsRequired: Array.isArray(skillsRequired) ? skillsRequired : skillsRequired.split(',').map(s => s.trim()),
      owner: req.user._id,
      members: [req.user._id]
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const { skills, search } = req.query;
    let query = {};

    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim());
      query.skillsRequired = { $in: skillsArray.map(s => new RegExp(s, 'i')) };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const projects = await Project.find(query)
      .populate('owner', 'name email avatar bio')
      .populate('members', 'name email avatar bio');
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email avatar bio')
      .populate('members', 'name email avatar bio');
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { title, description, skillsRequired, status } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this project' });
    }

    if (title) project.title = title;
    if (description) project.description = description;
    if (skillsRequired) {
      project.skillsRequired = Array.isArray(skillsRequired) ? skillsRequired : skillsRequired.split(',').map(s => s.trim());
    }
    if (status) project.status = status;

    const updatedProject = await project.save();
    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }

    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const joinProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if already a member
    if (project.members.includes(req.user._id)) {
      return res.status(400).json({ message: 'You are already a member of this project' });
    }

    project.members.push(req.user._id);
    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate('owner', 'name email avatar bio')
      .populate('members', 'name email avatar bio');

    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
