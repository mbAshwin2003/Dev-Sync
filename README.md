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
3. Configure environment variables:
   - In `backend/.env`:
     ```env
     PORT=5000
     MONGO_URI=mongodb://localhost:27017/devsync
     JWT_SECRET=supersecretjwtkeydevsync
     GOOGLE_CLIENT_ID=your_google_oauth_client_id_here.apps.googleusercontent.com
     ```
   - In `frontend/.env`:
     ```env
     VITE_API_URL=http://localhost:5000/api
     VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id_here.apps.googleusercontent.com
     ```
4. Start both the backend and frontend development servers concurrently:
   ```bash
   npm run dev
   ```

The frontend runs on [http://localhost:5173](http://localhost:5173) and the backend API runs on [http://localhost:5000](http://localhost:5000).

## Google OAuth 2.0 Setup

DevSync supports Single Sign-On with Google using Google Identity Services:

1. Visit [Google Cloud Console - Credentials](https://console.cloud.google.com/apis/credentials).
2. Configure the **OAuth consent screen** (User Type: External, specify App Name and Developer Contact).
3. Create Credentials &rarr; **OAuth client ID** &rarr; Application type: **Web application**.
4. Under **Authorized JavaScript origins**, add:
   - `http://localhost:5173` (for local development)
   - Your production domain (e.g., `https://your-domain.vercel.app`)
5. Copy the generated **Client ID** and paste it into:
   - `backend/.env` as `GOOGLE_CLIENT_ID`
   - `frontend/.env` as `VITE_GOOGLE_CLIENT_ID`
6. *(Optional)* If testing without Google credentials, click the **"Continue with Google"** button on the Sign-In page to use the built-in **Demo Google Account** mode.

