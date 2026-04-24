<div align="center">

<h1>🎬 SeeMedia</h1>

<p><b>A full-stack social media platform — posts, reels, stories, real-time chat, and more.</b></p>

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-see--media.vercel.app-6366f1?style=for-the-badge)](https://see-media.vercel.app)
[![Backend](https://img.shields.io/badge/⚙️%20Backend-seemedia.onrender.com-10b981?style=for-the-badge)](https://seemedia.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-yash9359%2FSeeMedia-181717?style=for-the-badge&logo=github)](https://github.com/yash9359/SeeMedia)

![JavaScript](https://img.shields.io/badge/JavaScript-98.8%25-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Express-6DA55F?style=flat-square&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-4ea94b?style=flat-square&logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Real--time-black?style=flat-square&logo=socket.io)

</div>

---

## 📸 Screenshots

<div align="center">
  <img src="https://github.com/user-attachments/assets/05288db3-8822-4c78-b7bb-43a2e7b465f8" width="100%" alt="SeeMedia Home Feed" />
  <br/><br/>
  <img src="https://github.com/user-attachments/assets/142f0505-656a-4160-ae6f-1ddab16b7cd2" width="100%" alt="SeeMedia Chat" />
</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 Auth | Register, login, logout with JWT + cookie-based auth |
| 👤 Profile | Edit profile, upload profile image via Cloudinary |
| 📸 Posts | Create, delete, like, comment, save/unsave posts |
| 🎬 Reels | Short video reels with likes and comments |
| 📖 Stories | 24h auto-expiry stories with viewers, likes, comments |
| 👥 Social | Follow/unfollow users, suggested users, explore feed |
| 💬 Chat | Real-time 1:1 messaging with text + image/video |
| 🔔 Notifications | Live follow/like notifications via Socket.IO |
| 🌐 Online Status | Real-time online users list |

---

## 🏗️ Architecture

```
Frontend (React + Vite)          Backend (Express + Node.js)
┌─────────────────────┐          ┌──────────────────────────┐
│  Redux Toolkit      │◄────────►│  REST API Routes         │
│  React Router       │  Axios   │  JWT + Cookie Auth       │
│  Tailwind CSS v4    │          │  Mongoose Models         │
│  Socket.IO Client   │◄────────►│  Socket.IO Server        │
│  Framer Motion      │ WS conn  │  Cloudinary Uploads      │
└─────────────────────┘          └──────────┬───────────────┘
                       │
                   ┌─────────▼──────────┐
                   │     MongoDB        │
                   │  Users, Posts,     │
                   │  Reels, Stories,   │
                   │  Messages          │
                   └────────────────────┘
```

---

## ⚙️ Backend — Request Flow

Every incoming HTTP request goes through these layers in order:

```mermaid
flowchart TD
  A[Incoming HTTP Request] --> B[index.js Entry Point]
  B --> C[Express Middleware Layer]
  C --> C1[cors — allow frontend origin]
  C --> C2[cookie-parser — parse JWT cookie]
  C --> C3[express.json — parse request body]
  C1 --> D[Router — match URL to route file]
  C2 --> D[Router — match URL to route file]
  C3 --> D[Router — match URL to route file]

  D --> E{Protected Route?}
  E -- Yes --> F[isAuthenticated Middleware]
  F --> F1{JWT valid?}
  F1 -- No --> F2[Return 401 Unauthorized]
  F1 -- Yes --> G[Controller Function]
  E -- No --> G

  G --> H{Media Upload?}
  H -- Yes --> I[Multer Middleware]
  I --> J[multer-storage-cloudinary]
  J --> K[Cloudinary CDN]
  K --> L[Returns mediaUrl]
  L --> G
  H -- No --> M[Mongoose Model]
  G --> M

  M --> N[MongoDB Atlas]
  N --> O[Document saved / fetched]
  O --> P{Socket event needed?}
  P -- Yes --> Q[socket.io emit to target userId]
  Q --> R[Real-time event on client]
  P -- No --> S[JSON Response to Frontend]
  R --> S
```

---

## 🔐 Auth Middleware — How JWT Works

```mermaid
flowchart LR
  A[Request hits protected route] --> B[isAuthenticated middleware]
  B --> C[Read token from cookie OR Authorization header]
  C --> D{Token found?}
  D -- No --> E[401 — No token provided]
  D -- Yes --> F[jwt.verify with JWT_SECRET]
  F --> G{Valid?}
  G -- No --> H[401 — Invalid token]
  G -- Yes --> I[Attach userId to req.user]
  I --> J[next — pass to controller]
```

> Cookie token takes priority. If not found, falls back to `Bearer` token in `Authorization` header.

---

## 📦 Data Flow — Creating a Post

```mermaid
sequenceDiagram
  autonumber
  actor U as User
  participant FE as Frontend
  participant MW as Middleware
  participant CT as PostController
  participant CL as Cloudinary
  participant DB as MongoDB
  participant SO as Socket.IO

  U->>FE: Select image/video + write caption
  FE->>MW: POST /api/posts/create (multipart form)
  MW->>MW: isAuthenticated — verify JWT
  MW->>MW: multer — parse file from request
  MW->>CL: Upload file buffer to Cloudinary
  CL-->>MW: Returns secure mediaUrl
  MW->>CT: req.file.path = mediaUrl, req.user = userId
  CT->>DB: Post.create — save post document
  DB-->>CT: Saved post with _id
  CT->>DB: User.findByIdAndUpdate — push post._id to user.posts
  DB-->>CT: User updated
  CT-->>FE: 201 — post object in JSON
  FE-->>U: Post appears in feed instantly
```

---

## 💬 Real-Time Layer — Socket.IO

```mermaid
flowchart TD
  A[Backend starts — index.js] --> B[HTTP server created]
  B --> C[Socket.IO attaches to HTTP server]
  C --> D[Client connects with userId in query]
  D --> E[userSocketMap stores userId → socketId]
  E --> F[Emit getOnlineUsers to all clients]

  G[User sends message] --> H[POST /api/messages/send]
  H --> I[Message saved in DB]
  I --> J[getReceiverSocketId — lookup socketId]
  J --> K{Receiver online?}
  K -- Yes --> L[io.to socketId .emit newMessage]
  L --> M[Receiver gets message instantly]
  K -- No --> N[Message saved, delivered on next login]

  O[User follows / likes] --> P[Controller creates notification]
  P --> Q[Emit notification event to target socketId]
  Q --> R[Target user sees live notification]
```

---

## 🔄 App Flow

```mermaid
flowchart TD
  A[User Opens App] --> B{Authenticated?}
  B -- No --> C[Login / Register]
  C --> D[JWT + Cookie Issued]
  D --> E[Load Home Feed]
  B -- Yes --> E[Load Home Feed]

  E --> F[Create / View Posts, Reels, Stories]
  F --> G[Upload Media to Cloudinary]
  G --> H[Save Metadata in MongoDB]
  H --> I[Serve Updated Feed]

  E --> J[Open Chat]
  J --> K[Socket.IO Connection]
  K --> L[Send / Receive Real-Time Messages]

  E --> M[Follow / Like / Comment]
  M --> N[Create Notification]
  N --> O[Real-Time Notification Event]
```

---

## 🔐 Auth + Chat Flow

```mermaid
sequenceDiagram
  autonumber
  actor U as User
  participant FE as Frontend (React)
  participant BE as Backend (Express)
  participant DB as MongoDB
  participant CL as Cloudinary
  participant SO as Socket.IO

  U->>FE: Login (email/password)
  FE->>BE: POST /api/users/login
  BE->>DB: Validate user + password hash
  DB-->>BE: User found
  BE-->>FE: JWT cookie + user payload
  FE-->>U: Redirect to Home Feed

  U->>FE: Send chat message (+optional media)
  alt Media attached
    FE->>CL: Upload media file
    CL-->>FE: mediaUrl
  end
  FE->>BE: POST /api/messages/send/:receiverId
  BE->>DB: Save message document
  DB-->>BE: Message saved
  BE->>SO: Emit newMessage to receiver socket
  SO-->>FE: newMessage event (real-time)
  FE-->>U: Message shown instantly
```

---

## 🗂️ Project Structure

```
SeeMedia/
├── backend/
│   ├── index.js
│   ├── config/           # Cloudinary & DB config
│   ├── controllers/      # Route logic
│   ├── db/               # MongoDB connection
│   ├── middleware/        # Auth & upload middleware
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   └── socket/           # Socket.IO logic
└── frontend/
    └── src/
        ├── components/   # Reusable UI components
        ├── pages/        # Route-level pages
        ├── redux/        # Store, slices, actions
        └── lib/          # Axios instance, utils
```

---

## 📡 API Reference

<details>
<summary><b>👤 User Routes</b></summary>

| Method | Endpoint | Description |
|---|---|---|
| POST | `/users/register` | Register new user |
| POST | `/users/login` | Login |
| GET | `/users/logout` | Logout |
| GET | `/users/profile` | Get own profile |
| GET | `/users/suggested/users` | Suggested users |
| GET | `/users/:id` | Get user by ID |
| POST | `/users/follow/:targetId` | Follow user |
| POST | `/users/unfollow/:targetId` | Unfollow user |
| GET | `/users/:id/followers` | Get followers |
| GET | `/users/:id/followings` | Get following |
| POST | `/users/upload-profile` | Upload profile image |
| PUT | `/users/update-profile` | Update profile |

</details>

<details>
<summary><b>📸 Post Routes</b></summary>

| Method | Endpoint | Description |
|---|---|---|
| POST | `/posts/create` | Create post |
| GET | `/posts/all` | Get all posts |
| GET | `/posts/:id` | Get post by ID |
| DELETE | `/posts/:id` | Delete post |
| PUT | `/posts/:id/like` | Like/unlike post |
| POST | `/posts/:id/comment` | Comment on post |
| PUT | `/posts/:postId/save` | Save/unsave post |

</details>

<details>
<summary><b>🎬 Reel Routes</b></summary>

| Method | Endpoint | Description |
|---|---|---|
| POST | `/reels/create` | Create reel |
| GET | `/reels/all` | Get all reels |
| GET | `/reels/:id` | Get reel by ID |
| DELETE | `/reels/:id` | Delete reel |
| PUT | `/reels/:id/like` | Like/unlike reel |
| POST | `/reels/:id/comment` | Comment on reel |

</details>

<details>
<summary><b>📖 Story Routes</b></summary>

| Method | Endpoint | Description |
|---|---|---|
| POST | `/stories/create` | Create story |
| GET | `/stories/all` | Get all stories |
| PUT | `/stories/:id/view` | Mark as viewed |
| DELETE | `/stories/:id` | Delete story |
| PUT | `/stories/:id/like` | Like story |
| POST | `/stories/:id/comment` | Comment on story |

</details>

<details>
<summary><b>💬 Message Routes</b></summary>

| Method | Endpoint | Description |
|---|---|---|
| GET | `/messages/users` | Get chat users |
| GET | `/messages/:receiverId` | Get conversation |
| POST | `/messages/send/:receiverId` | Send message |

</details>

---

## ⚡ Socket Events

| Direction | Event | Description |
|---|---|---|
| Server → Client | `getOnlineUsers` | List of currently online users |
| Server → Client | `newMessage` | Real-time incoming message |
| Server → Client | `notification` | Live follow/like notification |

> Socket connects with `query: { userId }` on client init.

---

## ⚙️ Environment Variables

**`backend/.env`**
```env
PORT=
MONGODB_URL=
JWT_SECRET=
CLIENT_URL=
NODE_ENV=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

**`frontend/.env`**
```env
VITE_API_BASE_URL=
VITE_BACKEND_URL=
```

---

## 🚀 Local Setup

```bash
# 1. Clone the repo
git clone https://github.com/yash9359/SeeMedia.git
cd SeeMedia

# 2. Start backend
cd backend
npm install
npm run dev
# Runs on http://localhost:8000

# 3. Start frontend
cd ../frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## 🔮 Roadmap

- [ ] Chat typing indicator & read receipts
- [ ] Infinite scroll / pagination
- [ ] Search users and posts by keywords
- [ ] Notification history & persistence
- [ ] Dark / light mode toggle

---

## 📄 License

Open source for learning and personal projects.

---

<div align="center">
  <b>Built with ❤️ by <a href="https://github.com/yash9359">Yash Gupta</a></b>
</div>