import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import Developer from '../models/Developer.js';

const client = new OAuth2Client();

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
        avatar: developer.avatar,
        googleId: developer.googleId
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
        avatar: developer.avatar,
        googleId: developer.googleId
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
        avatar: req.user.avatar,
        googleId: req.user.googleId
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const googleAuth = async (req, res) => {
  const { credential, demo } = req.body;
  try {
    let googleUser = null;
    const configuredClientId = process.env.GOOGLE_CLIENT_ID;

    if (credential) {
      try {
        if (configuredClientId) {
          const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: configuredClientId,
          });
          const payload = ticket.getPayload();
          googleUser = {
            googleId: payload.sub,
            email: payload.email,
            name: payload.name || payload.email.split('@')[0],
            avatar: payload.picture || ''
          };
        } else {
          // If GOOGLE_CLIENT_ID is not yet configured, verify with Google tokeninfo
          const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
          if (!verifyRes.ok) {
            return res.status(401).json({ message: 'Invalid or expired Google token' });
          }
          const payload = await verifyRes.json();
          googleUser = {
            googleId: payload.sub,
            email: payload.email,
            name: payload.name || payload.email.split('@')[0],
            avatar: payload.picture || ''
          };
        }
      } catch (tokenErr) {
        return res.status(401).json({ message: 'Google token verification failed: ' + tokenErr.message });
      }
    } else if (demo) {
      // Demo fallback mode when Google credentials are not yet configured in .env
      googleUser = {
        googleId: 'demo-google-' + (demo.email ? demo.email.replace(/[^a-zA-Z0-9]/g, '') : 'user'),
        email: demo.email || 'developer.google@devsync.io',
        name: demo.name || 'Alex Rivera (Google)',
        avatar: demo.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'
      };
    } else {
      return res.status(400).json({ message: 'Google credential or demo payload is required' });
    }

    if (!googleUser || !googleUser.email) {
      return res.status(400).json({ message: 'Unable to retrieve user information from Google' });
    }

    const normalizedEmail = googleUser.email.toLowerCase().trim();

    // Find developer by googleId or email
    let developer = await Developer.findOne({
      $or: [
        { googleId: googleUser.googleId },
        { email: normalizedEmail }
      ]
    });

    if (developer) {
      let updated = false;
      if (!developer.googleId) {
        developer.googleId = googleUser.googleId;
        updated = true;
      }
      if (!developer.avatar && googleUser.avatar) {
        developer.avatar = googleUser.avatar;
        updated = true;
      }
      if (updated) {
        await developer.save();
      }
    } else {
      developer = await Developer.create({
        name: googleUser.name,
        email: normalizedEmail,
        googleId: googleUser.googleId,
        avatar: googleUser.avatar || '',
        bio: 'Developer building cool projects on DevSync.'
      });
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
        avatar: developer.avatar,
        googleId: developer.googleId
      }
    });
  } catch (error) {
    console.error('Google Auth Controller Error:', error);
    res.status(500).json({ message: error.message || 'Server error during Google authentication' });
  }
};

