# 🎉 WishCraft — Custom Greetings & Wishes App

A production-ready full-stack application for creating, personalizing, and sharing greeting cards.

## 🧱 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React.js + Vite + Tailwind CSS v4 |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (Access + Refresh tokens, HTTP-only cookies) |
| Image Processing | Sharp (server-side merging) + HTML Canvas (live preview) |
| File Storage | Multer (local uploads) |
| State Management | Zustand (with persist) |

---

## 📁 Project Structure

```
ClassPlus/
├── server/                   # Express Backend
│   ├── config/db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── templateController.js
│   │   ├── imageController.js
│   │   └── subscriptionController.js
│   ├── middleware/authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Template.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── templateRoutes.js
│   │   ├── imageRoutes.js
│   │   └── subscriptionRoutes.js
│   ├── utils/generateToken.js
│   ├── uploads/              # Generated & uploaded images
│   ├── .env
│   └── server.js
│
└── client/                   # React Frontend
    └── src/
        ├── components/
        │   ├── Navbar.jsx
        │   ├── TemplateCard.jsx
        │   ├── PremiumModal.jsx
        │   └── PreviewCanvas.jsx
        ├── pages/
        │   ├── Home.jsx
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── Profile.jsx
        │   └── Preview.jsx
        ├── services/api.js
        ├── store/authStore.js
        ├── App.jsx
        ├── main.jsx
        └── index.css
```

---

## ⚙️ Setup Instructions

### Prerequisites
- **Node.js** v18+
- **MongoDB** running locally (`mongodb://127.0.0.1:27017`) or use MongoDB Atlas

### 1. Clone / Open the project
```bash
cd ClassPlus
```

### 2. Setup Backend

```bash
cd server
# .env is already configured for local dev
npm install
npm run dev
```

Backend runs at **http://localhost:5000**

### 3. Seed Templates (REQUIRED on first run)

```bash
curl -X POST http://localhost:5000/api/templates/seed
```
Or open in browser: `http://localhost:5000/api/templates/seed` (POST via Postman/Thunder Client)

### 4. Setup Frontend

```bash
cd ../client
npm install
npm run dev
```

Frontend runs at **http://localhost:5173**

---

## 🔐 Environment Variables (`server/.env`)

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/greetings-app
JWT_SECRET=supersecretjwtkeyforgreetingsapp
JWT_REFRESH_SECRET=supersecretjwtrefreshkeyforgreetingsapp
NODE_ENV=development
```

---

## 🚀 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register with email/password |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/guest` | Guest login |
| POST | `/api/auth/logout` | Logout (clears cookie) |
| GET | `/api/auth/refresh` | Refresh access token |
| GET | `/api/auth/me` | Get current user |

### User
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/profile` | Get profile |
| PUT | `/api/user/profile` | Update name + photo |

### Templates
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/templates` | All templates (optional `?category=Birthday`) |
| GET | `/api/templates/:id` | Single template |
| POST | `/api/templates/seed` | Seed sample templates |

### Image
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/image/generate` | Merge template + user photo + name |

### Subscription
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/subscription/subscribe` | Activate premium (30 days) |
| GET | `/api/subscription/status` | Check subscription status |

---

## ✨ Features

- 🔐 Email/Password auth + Guest login
- 👤 Profile management with photo upload
- 🎨 Browse templates by category (Birthday, Wedding, Festival, etc.)
- 🖼️ Live HTML Canvas preview with name + photo overlay
- ⚡ Server-side image generation with Sharp
- 📤 Download, WhatsApp share, Email share, Copy link
- 💎 Premium subscription system with modal
- 🌙 Dark mode design with glassmorphism
