# 🎓 EMSI Academic Platform

A full-stack MERN application for managing an engineering school's academic operations.

## 🚀 Features

### Student Features
- View enrolled modules
- Download course materials
- Submit assignments
- View grades and averages
- Receive notifications

### Professor Features
- Manage assigned modules
- Upload course materials
- Create and manage assignments
- Grade student submissions
- Send announcements

### Admin Features
- User management (CRUD)
- Module management
- Student enrollment
- Grade validation
- Data export

## 🛠️ Tech Stack

**Frontend:**
- React
- Tailwind CSS
- React Router
- Axios

**Backend:**
- Node.js
- Express
- MongoDB (Mongoose)
- JWT Authentication

## 📦 Installation

### Prerequisites
- Node.js (v16+)
- MongoDB

### Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/academic-platform
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```

Run backend:
```bash
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 👤 Default Users

Create users with the seed script:
```bash
cd backend
node createUsers.js
```

**Login credentials:**
- **Admin:** admin@emsi.ma / admin123
- **Student:** student@emsi.ma / student123
- **Professor:** prof@emsi.ma / prof123

## 📝 License

MIT

## 👨‍💻 Author

Your Name
