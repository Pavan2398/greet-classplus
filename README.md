# WishCraft Greetings 🎨✨

WishCraft is a production-grade full-stack SaaS application that allows users to browse, personalize, and generate high-quality greeting cards for any occasion. Built with a modern tech stack, it features real-time canvas-based image processing, secure authentication, and a subscription-based premium system.

## 🌟 Key Features

- **Personalized Greetings**: Customize templates with your name and profile photo in real-time.
- **Dynamic Image Generation**: Server-side image processing using **Sharp** to generate high-resolution cards.
- **Authentication**: Secure JWT-based authentication with Access and Refresh tokens (HTTP-only cookies).
- **Google OAuth**: One-click login using Google accounts.
- **Subscription System**: Premium templates unlockable via a subscription layer.
- **Cloud Assets**: High-quality, reliable template images powered by Unsplash.
- **Responsive Design**: Modern, premium UI built with React.js and Tailwind CSS.

## 🛠️ Technology Stack

- **Frontend**: React.js (Vite), Tailwind CSS, Axios, Lucide Icons.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose).
- **Processing**: Sharp (for server-side image manipulation).
- **Security**: JWT, bcrypt.js, Cookie-parser, CORS.

## 📁 Project Structure

```text
├── client/          # React.js frontend (Vite)
├── server/          # Node.js Express backend
└── README.md
```

## ⚙️ Local Setup Instructions

### 1. Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local or Atlas)
- Google Cloud Console Project (for Google Login)

### 2. Clone the Repository
```bash
git clone https://github.com/Pavan2398/greet-classplus.git
cd greet-classplus
```

### 3. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
GOOGLE_CLIENT_ID=your_google_client_id
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```
Start the server:
```bash
npm run dev
```

### 4. Frontend Setup
```bash
cd ../client
npm install
```
Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```
Start the client:
```bash
npm run dev
```

## 📜 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and get tokens |
| `GET` | `/api/templates` | Fetch all greeting templates |
| `POST` | `/api/image/generate`| Generate a personalized image |
| `PUT` | `/api/user/profile` | Update user name or photo |

## 🤝 Contributing
Feel free to fork this project and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

---
**Happy Greet-ing!** 🥂🚀
