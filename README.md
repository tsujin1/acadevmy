# Acadevmy 🎓

**Acadevmy** is an online learning platform connecting students with verified mentors. It features structured communication, session booking, real-time chat, and review gating to ensure trustworthy and effective mentorship.

## 🚀 Tech Stack

**Frontend:**
- React (Vite)
- TypeScript
- Tailwind CSS
- Socket.io Client

**Backend:**
- Node.js & Express
- TypeScript
- MongoDB (Mongoose)
- Socket.io (Real-time chat)
- JWT Authentication

---

## 🛠️ Setup & Installation

Since this project handles sensitive data (authentication, DB connections), you must configure your environment variables locally.

### 1. Clone the Repository
```bash
git clone https://github.com/tsujin1/acadevmy.git
cd acadevmy
```

### 2. Backend Setup (`/server`)

Navigate to the server folder and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory with the following variables:
```
PORT=5000
CLIENT_URL=http://localhost:5173
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRE=30d
EMAIL_USER=your_email@gmail.com
```

Start the server:
```bash
npm run dev
```

### 3. Frontend Setup (`/client`)

Open a new terminal, navigate to the client folder, and install dependencies:
```bash
cd client
npm install
```

Create a `.env` file in the `client/` directory with the following variables:
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```

---

## 🌟 Key Features

* **Mentor Verification**: Robust review and approval system for mentors.
* **Real-time Chat**: Instant messaging between students and mentors using Socket.io.
* **Session Booking**: Integrated scheduling for mentorship sessions.
* **Secure Auth**: JWT-based authentication with protected routes.

---

## 📝 Git Setup Instructions

### Initial Setup (First Time)
```bash
git init
git add .
git status
```

⚠️ **PAUSE AND VERIFY:**
- Check the list to ensure `.env` files are NOT included
- Ensure `README.md` IS there

### Commit and Push
```bash
git commit -m "Initial commit: MVP release with MERN stack architecture"
git branch -M main
git remote add origin https://github.com/tsujin1/acadevmy.git
git push -u origin main
```

---

## 🔒 Security Notes

- Never commit `.env` files to version control
- Keep your `JWT_SECRET` secure and unique
- Use environment-specific variables for production deployments
- Ensure MongoDB connection strings include appropriate access controls

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/tsujin1/acadevmy/issues).

---

## 👨‍💻 Author

**Acadevmy Team**

- GitHub: [@tsujin1](https://github.com/tsujin1)
