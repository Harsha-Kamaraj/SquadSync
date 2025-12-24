# SquadSync 🎮

A modern team-finding web application that helps users connect with teammates for events, games, and activities. Built with the MERN stack (MongoDB, Express.js, React, Node.js).

![SquadSync](https://img.shields.io/badge/Status-In%20Development-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [API Endpoints](#-api-endpoints)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- **User Authentication** - Secure signup and login with JWT tokens
- **User Profiles** - Customizable user profiles
- **Post Creation** - Create posts to find teammates for events
- **Event Selection** - Choose from various event types
- **Email Invitations** - Send team invites via email using SendGrid
- **Responsive Design** - Modern UI built with Tailwind CSS

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **SendGrid/Nodemailer** - Email service

## 📁 Project Structure

```
SquadSync/
├── backend/                 # Express.js backend
│   ├── config/
│   │   ├── db.js           # MongoDB connection
│   │   └── mail.js         # Email configuration
│   ├── models/
│   │   ├── Post.js         # Post schema
│   │   └── User.js         # User schema
│   ├── routes/
│   │   ├── authRoutes.js   # Authentication routes
│   │   ├── inviteRoutes.js # Invitation routes
│   │   ├── postRoutes.js   # Post CRUD routes
│   │   └── userRoutes.js   # User routes
│   ├── .env                # Environment variables (not committed)
│   ├── package.json
│   └── server.js           # Entry point
│
├── squad-sync-frontend/     # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthCard.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── EventSelector.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MessageCard.jsx
│   │   │   ├── MessageList.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Signup.jsx
│   │   ├── services/
│   │   │   └── api.js      # API service functions
│   │   ├── styles/
│   │   │   └── index.css   # Global styles
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── .env                # Environment variables (not committed)
│   ├── package.json
│   ├── tailwind.config.cjs
│   └── vite.config.js
│
├── SCREENSHOTS/            # Application screenshots
├── .gitignore
└── README.md
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git**

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/SquadSync.git
   cd SquadSync
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../squad-sync-frontend
   npm install
   ```

## 🔐 Environment Variables

### Backend (`backend/.env`)

Create a `.env` file in the `backend` directory:

```env
# MongoDB
MONGO_URI=mongodb://localhost:27017/squadsyncAppDB
MAIL_DB_URI=mongodb://localhost:27017/mailLogsDB

# JWT Secret (generate a strong random string)
JWT_SECRET=your_jwt_secret_here

# SendGrid Email Configuration
SENDGRID_API_KEY=your_sendgrid_api_key
SENDER_EMAIL=your_verified_sender_email@example.com

# Server Configuration
PORT=5000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (`squad-sync-frontend/.env`)

Create a `.env` file in the `squad-sync-frontend` directory:

```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api
```

## 🏃 Running the Application

### Development Mode

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on `http://localhost:5000`

3. **Start the frontend development server** (in a new terminal)
   ```bash
   cd squad-sync-frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

### Production Build

```bash
# Build frontend
cd squad-sync-frontend
npm run build

# Start backend in production
cd ../backend
npm start
```

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/:id` | Get user by ID |
| PUT | `/api/users/:id` | Update user profile |

### Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | Get all posts |
| POST | `/api/posts` | Create a new post |
| PUT | `/api/posts/:id` | Update a post |
| DELETE | `/api/posts/:id` | Delete a post |

### Invitations
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/invite` | Send team invitation |

### Email
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/send-email` | Send email notification |

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

