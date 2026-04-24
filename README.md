# SeeMedia — Full-Stack Social Media Platform

SeeMedia is a full-stack social media app with posts, reels, stories, profile management, follow system, notifications, and real-time chat.

---

## Links

- Frontend (Vercel): https://see-media.vercel.app
- Backend (Render): https://seemedia.onrender.com

---

## What This App Does

### Core User Flows
- Register, login, logout with JWT + cookie auth.
- Edit profile and upload profile image.
- Follow/unfollow users.
- Create and delete posts/reels/stories.
- Like and comment on posts/reels/stories.
- Save/unsave posts.
- Explore feed, reels feed, profile pages, suggested users.
- 1:1 messaging with text + image/video messages.

### Real-Time Behavior
- Online users list via Socket.IO.
- Instant new message delivery in chat.
- Live follow/like notifications.

---

## Architecture At a Glance

- **Frontend:** React + Vite + Redux Toolkit + Tailwind CSS + Socket.IO client.
- **Backend:** Express + MongoDB (Mongoose) + Socket.IO + JWT + Cloudinary uploads.
- **Auth:** Cookie token + Bearer fallback.
- **Media:** Cloudinary through `multer-storage-cloudinary`.

---

## Tech Stack

### Frontend
- React 19
- Vite
- Redux Toolkit + React Redux
- React Router
- Tailwind CSS v4
- Axios
- Socket.IO Client
- Framer Motion
- Lucide Icons

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Socket.IO
- JWT (`jsonwebtoken`)
- `bcryptjs`
- Cloudinary + Multer
- CORS + Cookie Parser

---

## Project Structure

```text
SeeMedia/
├── backend/
│   ├── index.js
│   ├── config/
│   ├── controllers/
│   ├── db/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── socket/
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── redux/
    │   └── lib/
    └── vite.config.js
```

---

## Data Model Overview

- **User**: account, profile fields, followers/following, saved posts, user posts/reels/story refs.
- **Post**: user, mediaType/image-video, mediaUrl, caption, likes, comments.
- **Reel**: user, mediaUrl, caption, likes, comments.
- **Story**: user, mediaType, mediaUrl, viewers, likes, comments, auto-expiry (24h TTL).
- **Message**: sender, receiver, text, mediaType, mediaUrl, timestamps.

---

## API Overview

Base URL: `/api`

### User Routes
- `POST /users/register`
- `POST /users/login`
- `GET /users/logout`
- `GET /users/profile`
- `GET /users/suggested/users`
- `GET /users/:id`
- `POST /users/follow/:targetId`
- `POST /users/unfollow/:targetId`
- `GET /users/:id/followers`
- `GET /users/:id/followings`
- `POST /users/upload-profile`
- `PUT /users/update-profile`
- `GET /users/all`

### Post Routes
- `POST /posts/create`
- `GET /posts/all`
- `GET /posts/:id`
- `DELETE /posts/:id`
- `PUT /posts/:id/like`
- `POST /posts/:id/comment`
- `PUT /posts/:postId/save`

### Reel Routes
- `POST /reels/create`
- `GET /reels/all`
- `GET /reels/:id`
- `DELETE /reels/:id`
- `PUT /reels/:id/like`
- `POST /reels/:id/comment`

### Story Routes
- `POST /stories/create`
- `GET /stories/all`
- `PUT /stories/:id/view`
- `DELETE /stories/:id`
- `PUT /stories/:id/like`
- `POST /stories/:id/comment`

### Message Routes
- `GET /messages/users`
- `GET /messages/:receiverId`
- `POST /messages/send/:receiverId`

---

## Socket Events

### Server → Client
- `getOnlineUsers`
- `newMessage`
- `notification`

### Client Connection
- Socket is connected with `query: { userId }`.

---

## Environment Variables

Create `.env` in `backend/`:

- `PORT`
- `MONGODB_URL`
- `JWT_SECRET`
- `CLIENT_URL`
- `NODE_ENV`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Create `.env` in `frontend/` (optional if using defaults):

- `VITE_API_BASE_URL`
- `VITE_BACKEND_URL`

---

## Local Setup

### 1) Clone
```bash
git clone <your-repo-url>
cd SeeMedia
```

### 2) Backend setup
```bash
cd backend
npm install
npm run dev
```

Backend default local URL: `http://localhost:8000`

### 3) Frontend setup
```bash
cd ../frontend
npm install
npm run dev
```

Frontend default local URL: `http://localhost:5173`

---

## Deployment Notes

- Frontend is configured for Vercel.
- Backend supports CORS for localhost + production client URL.
- Keep `NODE_ENV=production` in production so cookie security (`secure`, `sameSite`) works correctly.
- Media uploads depend on valid Cloudinary credentials.

---

## Future Improvements

- Chat typing indicator and read receipts.
- Pagination/infinite scroll for large feeds.
- Better notification persistence/history.
- Search users/posts by keywords.

---

## License

Open source for learning and personal projects.