import jwt from 'jsonwebtoken';
import Developer from '../models/Developer.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretjwtkeydevsync', {
    expiresIn: '30d'
  });
};

export const registerDeveloper = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await Developer.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Developer with this email already exists' });
    }

    const developer = await Developer.create({ name, email, password });
    res.status(201).json({
      token: generateToken(developer._id),
      developer: {
        id: developer._id,
        name: developer.name,
        email: developer.email,
        bio: developer.bio,
        skills: developer.skills,
        github: developer.github,
        linkedin: developer.linkedin,
        avatar: developer.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginDeveloper = async (req, res) => {
  const { email, password } = req.body;
  try {
    const developer = await Developer.findOne({ email });
    if (!developer || !(await developer.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({
      token: generateToken(developer._id),
      developer: {
        id: developer._id,
        name: developer.name,
        email: developer.email,
        bio: developer.bio,
        skills: developer.skills,
        github: developer.github,
        linkedin: developer.linkedin,
        avatar: developer.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    res.status(200).json({
      developer: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        bio: req.user.bio,
        skills: req.user.skills,
        github: req.user.github,
        linkedin: req.user.linkedin,
        avatar: req.user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
