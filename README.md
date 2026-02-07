# CodeCanon

Unified canonical coding-progress platform with verified solve tracking.

## Structure
- `server` — Express + MongoDB API
- `extension` — Chrome MV3 content scripts
- `src` — React (Vite) frontend

## Local Setup
1. Install dependencies
   - Frontend: `npm install`
   - Backend: `cd server && npm install`
2. Configure env
   - `server/.env` based on `server/.env.example`
3. Seed canonical questions
   - `cd server && npm run seed`
4. Start apps
   - Backend: `cd server && npm run dev`
   - Frontend: `npm run dev`

## Extension
1. Open Chrome → `chrome://extensions`
2. Enable Developer Mode
3. Load unpacked → select `extension` folder
4. Solve a problem on LeetCode, GFG, or HackerRank

The extension posts to `http://localhost:5000/api/solve`. Ensure the backend is running.
The extension attempts to map solves to a user by matching the platform handle you entered during signup.

## API
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/questions`
- `GET /api/questions/with-solves` (auth)
- `POST /api/solve` (extension)
- `POST /api/solve/manual` (auth)
- `GET /api/users/me` (auth)
- `GET /api/users/:username`
