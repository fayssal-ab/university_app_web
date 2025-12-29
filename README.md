# EMSI Academic Platform

> A comprehensive full-stack MERN application designed for managing engineering school academic operations with role-based access control.

---

## Features

### Student Portal
- **Module Management** - View enrolled courses and access materials
- **Course Materials** - Download lecture notes, presentations, and resources
- **Assignment Submission** - Submit assignments with deadline tracking
- **Academic Performance** - View detailed grades and semester averages
- **Real-time Notifications** - Receive announcements and grade updates

### Professor Portal
- **Course Management** - Oversee assigned modules and student enrollment
- **Content Distribution** - Upload and organize course materials
- **Assignment Creation** - Design assignments with customizable parameters
- **Grade Management** - Evaluate submissions and manage student grades
- **Communication** - Send targeted announcements to students

### Administrative Dashboard
- **User Administration** - Complete CRUD operations for all user types
- **Academic Structure** - Manage branches, levels, and module assignments
- **Enrollment Control** - Handle student registration and course allocation
- **Grade Validation** - Review and approve grades before publication
- **Data Analytics** - Export reports and track institutional metrics

---

## Technology Stack

### Frontend Architecture
```
React 18.x          - Component-based UI framework
Tailwind CSS 3.x    - Utility-first styling
React Router 6.x    - Client-side routing
Axios               - HTTP client
Context API         - State management
```

### Backend Architecture
```
Node.js 16+         - JavaScript runtime
Express 4.x         - Web application framework
MongoDB 6.x         - NoSQL database
Mongoose 7.x        - ODM for MongoDB
JWT                 - Authentication tokens
Bcrypt              - Password hashing
```

---

## Installation Guide

### System Requirements
- Node.js version 16 or higher
- MongoDB version 6 or higher
- npm or yarn package manager

### Backend Configuration

**Step 1: Navigate to backend directory**
```bash
cd backend
```

**Step 2: Install dependencies**
```bash
npm install
```

**Step 3: Environment setup**

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/emsi_academic

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRE=30d

# Frontend URL
CLIENT_URL=http://localhost:5173
```

**Step 4: Start the backend server**
```bash
npm run dev
```

The server will start on `http://localhost:5000`

---

### Frontend Configuration

**Step 1: Navigate to frontend directory**
```bash
cd frontend
```

**Step 2: Install dependencies**
```bash
npm install
```

**Step 3: Start the development server**
```bash
npm run dev
```

The application will open at `http://localhost:5173`

---

## Database Seeding

To populate the database with sample users and data:

```bash
node backend/scripts/seed.js
```

This will create:
- Administrative accounts
- Sample student accounts
- Sample professor accounts
- Academic structure (branches, levels, modules)
- Sample grades and enrollments

---

## Project Structure

### Backend Structure
```
backend/
├── config/
│   └── db.js                      - Database connection
│
├── controllers/
│   ├── authController.js          - Authentication logic
│   ├── studentController.js       - Student operations
│   ├── professorController.js     - Professor operations
│   ├── adminController.js         - Admin operations
│   ├── moduleController.js        - Module management
│   ├── gradeController.js         - Grade operations
│   ├── branchController.js        - Branch management
│   └── notificationController.js  - Notification handling
│
├── middleware/
│   ├── authMiddleware.js          - JWT verification
│   └── errorMiddleware.js         - Error handling
│
├── models/
│   ├── User.js                    - User schema
│   ├── Student.js                 - Student profile schema
│   ├── Professor.js               - Professor profile schema
│   ├── Branch.js                  - Branch schema
│   ├── Level.js                   - Level/Class schema
│   ├── Module.js                  - Module schema
│   ├── Grade.js                   - Grade schema
│   └── Notification.js            - Notification schema
│
├── routes/
│   ├── authRoutes.js              - Authentication routes
│   ├── studentRoutes.js           - Student routes
│   ├── professorRoutes.js         - Professor routes
│   ├── adminRoutes.js             - Admin routes
│   ├── moduleRoutes.js            - Module routes
│   ├── gradeRoutes.js             - Grade routes
│   ├── branchRoutes.js            - Branch routes
│   └── notificationRoutes.js      - Notification routes
│
├── scripts/
│   └── seed.js                    - Database seeding script
│
├── uploads/                       - File uploads directory
│
├── utils/                         - Utility functions
│
├── .env                           - Environment variables
├── package.json                   - Dependencies
└── server.js                      - Entry point
```

### Frontend Structure
```
frontend/
├── public/
│   └── favicon.ico
│
├── src/
│   ├── assets/
│   │   ├── background/
│   │   │   └── back.png
│   │   └── logo/
│   │       └── logo.jpg
│   │
│   ├── components/
│   │   ├── admin/
│   │   │   ├── EnrollmentForm.jsx
│   │   │   ├── ModuleForm.jsx
│   │   │   └── UserTable.jsx
│   │   │
│   │   ├── common/
│   │   │   ├── Card.jsx
│   │   │   ├── FileUpload.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── MainLayout.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Table.jsx
│   │   │
│   │   ├── professor/
│   │   │   ├── GradeForm.jsx
│   │   │   ├── MaterialUpload.jsx
│   │   │   └── SubmissionTable.jsx
│   │   │
│   │   └── student/
│   │       ├── AssignmentCard.jsx
│   │       ├── GradeTable.jsx
│   │       ├── ModuleCard.jsx
│   │       └── NotificationPanel.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx        - Authentication context
│   │
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ManageBranches.jsx
│   │   │   ├── ManageClasses.jsx
│   │   │   ├── ClassStudents.jsx
│   │   │   ├── AddStudent.jsx
│   │   │   ├── EditStudent.jsx
│   │   │   ├── EnrollStudents.jsx
│   │   │   ├── ManageProfessors.jsx
│   │   │   ├── ManageModules.jsx
│   │   │   ├── ValidateGrades.jsx
│   │   │   └── ExportGrades.jsx
│   │   │
│   │   ├── professor/
│   │   │   ├── ProfessorDashboard.jsx
│   │   │   ├── MyModules.jsx
│   │   │   ├── ManageModule.jsx
│   │   │   ├── ManageGrades.jsx
│   │   │   ├── ViewSubmissions.jsx
│   │   │   └── Announcements.jsx
│   │   │
│   │   ├── student/
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── MyModules.jsx
│   │   │   ├── ModuleDetails.jsx
│   │   │   ├── MyGrades.jsx
│   │   │   ├── Notifications.jsx
│   │   │   └── SubmitAssignment.jsx
│   │   │
│   │   ├── Login.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── Profile.jsx
│   │   └── Settings.jsx
│   │
│   ├── services/
│   │   ├── api.js                 - Axios configuration
│   │   ├── authService.js         - Authentication API
│   │   ├── studentService.js      - Student API
│   │   ├── professorService.js    - Professor API
│   │   └── adminService.js        - Admin API
│   │
│   ├── utils/
│   │   ├── constants.js           - App constants
│   │   ├── ProtectedRoute.jsx     - Route protection
│   │   └── RoleRoute.jsx          - Role-based routing
│   │
│   ├── App.jsx                    - Main app component
│   ├── App.css                    - Global styles
│   ├── main.jsx                   - Entry point
│   └── index.css                  - Base styles
│
├── index.html                     - HTML template
├── vite.config.js                 - Vite configuration
└── package.json                   - Dependencies
```

---

## API Endpoints

### Authentication Routes
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - User login
GET    /api/auth/me                - Get current user
PUT    /api/auth/updateprofile     - Update user profile
PUT    /api/auth/updatepassword    - Change password
POST   /api/auth/logout            - Logout user
```

### Student Routes
```
GET    /api/student/dashboard      - Student dashboard data
GET    /api/student/modules        - Enrolled modules
GET    /api/student/modules/:id    - Module details
GET    /api/student/grades         - Student grades
GET    /api/student/notifications  - User notifications
PATCH  /api/student/notifications/:id - Mark notification as read
```

### Professor Routes
```
GET    /api/professor/dashboard           - Professor dashboard data
GET    /api/professor/modules             - Assigned modules
GET    /api/professor/modules/:id/students - Module students
POST   /api/professor/grades              - Add/update grades
GET    /api/professor/modules/:id/grades  - Module grades
POST   /api/professor/materials           - Upload materials
POST   /api/professor/announcements       - Send announcements
```

### Admin Routes
```
GET    /api/admin/dashboard        - Admin statistics
GET    /api/admin/branches         - All branches
POST   /api/admin/branches         - Create branch
PUT    /api/admin/branches/:id     - Update branch
DELETE /api/admin/branches/:id     - Delete branch
GET    /api/admin/levels           - All levels/classes
POST   /api/admin/levels           - Create level
PUT    /api/admin/levels/:id       - Update level
DELETE /api/admin/levels/:id       - Delete level
GET    /api/admin/students         - All students
POST   /api/admin/students         - Create student
PUT    /api/admin/students/:id     - Update student
DELETE /api/admin/students/:id     - Delete student
GET    /api/admin/professors       - All professors
POST   /api/admin/professors       - Create professor
PUT    /api/admin/professors/:id   - Update professor
DELETE /api/admin/professors/:id   - Delete professor
GET    /api/admin/modules          - All modules
POST   /api/admin/modules          - Create module
PUT    /api/admin/modules/:id      - Update module
DELETE /api/admin/modules/:id      - Delete module
GET    /api/admin/grades           - All grades
PATCH  /api/admin/grades/:id/validate - Validate grade
```

---

## Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt encryption for password storage
- **Role-Based Access** - Granular permission control (Admin, Professor, Student)
- **Protected Routes** - Frontend and backend route protection
- **Input Validation** - Server-side data validation
- **CORS Protection** - Cross-origin resource sharing controls
- **File Upload Security** - Secure file handling and validation

---

## Development Scripts

### Backend
```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
node scripts/seed.js # Seed database with sample data
```

### Frontend
```bash
npm run dev          # Start Vite development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

---

## Key Features Implementation

### Authentication System
- JWT-based authentication with refresh tokens
- Password reset functionality
- Profile picture upload and management
- User session management

### Grade Management
- Professor grade submission
- Admin validation workflow
- Grade publication system
- Automatic average calculation

### Notification System
- Real-time notifications for students
- Grade publication alerts
- Assignment announcements
- Mark as read functionality

### File Management
- Course material uploads
- Assignment submissions
- Profile picture uploads
- Secure file storage

---

## Deployment

### Backend Deployment
1. Set environment variables on hosting platform
2. Ensure MongoDB connection string is configured
3. Configure file upload directories
4. Set up CORS for production frontend URL
5. Deploy using platform-specific commands

### Frontend Deployment
```bash
npm run build
```
Deploy the `dist` folder to your hosting service (Vercel, Netlify, etc.)

---

## Environment Variables Reference

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/emsi_academic
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```

---

## Contributing

Contributions are welcome. Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

## Support

For issues, questions, or contributions, please open an issue on the GitHub repository.

---

## Acknowledgments

Built with modern web technologies and best practices for educational institution management.

Developed using React, Node.js, Express, MongoDB, and Tailwind CSS.
