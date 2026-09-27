import Developer from '../models/Developer.js';

export const getAllDevelopers = async (req, res) => {
  try {
    const { skills, search } = req.query;
    let query = {};

    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim());
      query.skills = { $in: skillsArray.map(s => new RegExp(s, 'i')) };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } }
      ];
    }

    // Don't return passwords
    const developers = await Developer.find(query).select('-password');
    res.status(200).json(developers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDeveloperById = async (req, res) => {
  try {
    const developer = await Developer.findById(req.params.id).select('-password');
    if (!developer) {
      return res.status(404).json({ message: 'Developer not found' });
    }
    res.status(200).json(developer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, bio, skills, github, linkedin, avatar } = req.body;
    const developer = await Developer.findById(req.user._id);

    if (!developer) {
      return res.status(404).json({ message: 'Developer not found' });
    }

    if (name) developer.name = name;
    if (bio !== undefined) developer.bio = bio;
    if (skills) {
      developer.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
    }
    if (github !== undefined) developer.github = github;
    if (linkedin !== undefined) developer.linkedin = linkedin;
    if (avatar !== undefined) developer.avatar = avatar;

    const updatedDeveloper = await developer.save();
    
    res.status(200).json({
      id: updatedDeveloper._id,
      name: updatedDeveloper.name,
      email: updatedDeveloper.email,
      bio: updatedDeveloper.bio,
      skills: updatedDeveloper.skills,
      github: updatedDeveloper.github,
      linkedin: updatedDeveloper.linkedin,
      avatar: updatedDeveloper.avatar,
      googleId: updatedDeveloper.googleId
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
