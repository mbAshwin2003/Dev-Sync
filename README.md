# DevSync

DevSync is a full-stack platform designed to connect developers with suitable project partners. Users can create developer profiles, list their tech stacks, post project ideas, and find peers with matching skill sets.

## Repository Structure

```text
devsync/
├── backend/
│   ├── config/             # DB and passport configurations
│   ├── controllers/        # Request handling logic
│   ├── models/             # Mongoose schemas (Developer, Project)
│   ├── routes/             # Express API endpoints
│   ├── middleware/         # JWT auth & validation guards
│   └── server.js           # App entry point
├── frontend/
│   ├── public/             # Static assets
│   └── src/
│       ├── assets/         # Images and icons
│       ├── components/     # Reusable UI (Navbar, Card, SearchBar)
│       ├── context/        # Global state (Auth/Theme)
│       ├── pages/          # Dashboard, Profile, FindPartners
│       ├── App.jsx         # App routing
│       └── main.jsx        # React DOM render
├── .gitignore              # Hides node_modules and env files
├── README.md               # Setup guide and project overview
└── package.json            # Root dependency manager
```

## Getting Started

### Prerequisites

- Node.js (v16.0.0 or higher recommended)
- MongoDB (running locally or a remote MongoDB Atlas URI)

### Quick Start (Dev Environment)

1. Clone or navigate to the repository directory.
2. Install all dependencies for both frontend and backend projects from the root:
   ```bash
   npm run install-all
   ```
3. Create a `.env` file in the `backend/` directory with the following variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/devsync
   JWT_SECRET=supersecretjwtkeydevsync
   ```
4. Start both the backend and frontend development servers concurrently:
   ```bash
   npm run dev
   ```

The frontend will run on [http://localhost:5173](http://localhost:5173) and the backend api will run on [http://localhost:5000](http://localhost:5000).
