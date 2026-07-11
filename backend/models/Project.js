import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Developer',
    required: true
  },
  skillsRequired: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['searching', 'active', 'completed'],
    default: 'searching'
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Developer'
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Project = mongoose.model('Project', ProjectSchema);
export default Project;
