const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Professor = require('./models/Professor');
const Student = require('./models/Student');
const Branch = require('./models/Branch');
const Level = require('./models/Level');
const Module = require('./models/Module');

const MONGO_URI = 'mongodb://127.0.0.1:27017/academic-platform';

const connectDB = async () => {
  await mongoose.connect(MONGO_URI);
  console.log('✅ MongoDB Connected');
};

const seed = async () => {
  await connectDB();

  console.log('🗑️ Cleaning database...');
  await Promise.all([
    User.deleteMany({}),
    Professor.deleteMany({}),
    Student.deleteMany({}),
    Branch.deleteMany({}),
    Level.deleteMany({}),
    Module.deleteMany({})
  ]);

  // ================= ADMIN =================
  console.log('👑 Creating admin...');
  await User.create({
    email: 'admin@emsi.ma',
    password: 'admin123',
    role: 'admin',
    firstName: 'Admin',
    lastName: 'EMSI'
  });

  // ================= BRANCH =================
  const branch = await Branch.create({
    name: 'Génie Informatique',
    code: 'GI',
    description: 'Computer Engineering'
  });

  // ================= CLASSES (LEVELS) =================
  console.log('🎓 Creating 12 classes...');
  const levels = [];
  for (let i = 1; i <= 12; i++) {
    const level = await Level.create({
      name: `GI Class ${i}`,
      shortName: `GI${i}`,
      branch: branch._id,
      academicYear: '2024-2025',
      capacity: 10
    });
    levels.push(level);
  }

  // ================= PROFESSORS =================
  console.log('👨‍🏫 Creating 10 professors...');
  const professors = [];
  for (let i = 1; i <= 10; i++) {
    const user = await User.create({
      email: `prof${i}@emsi.ma`,
      password: '123456',
      role: 'professor',
      firstName: `Prof${i}`,
      lastName: 'EMSI'
    });

    const prof = await Professor.create({
      user: user._id,
      professorId: `PROF${String(i).padStart(3, '0')}`,
      department: 'Informatique',
      specialization: 'IT',
      branches: [branch._id],
      assignedModules: []
    });

    professors.push(prof);
  }

  // ================= MODULES =================
  console.log('📘 Creating modules...');
  const modules = [];

  let profIndex = 0;
  for (const level of levels) {
    for (let sem = 1; sem <= 2; sem++) {
      for (let m = 1; m <= 4; m++) {
        const prof = professors[profIndex % professors.length];

        const module = await Module.create({
          code: `MOD-${level.shortName}-S${sem}-${m}`,
          name: `Module ${m} - S${sem}`,
          level: level._id,
          field: 'Génie Informatique',
          semester: sem,
          coefficient: 2,
          academicYear: '2024-2025',
          professor: prof._id
        });

        prof.assignedModules.push({
          module: module._id,
          level: level._id,
          academicYear: '2024-2025'
        });

        modules.push(module);
        profIndex++;
      }
    }
  }

  for (const prof of professors) {
    await prof.save();
  }

  // ================= STUDENTS =================
  console.log('👨‍🎓 Creating 120 students...');
  let studentCount = 1;

  for (const level of levels) {
    for (let i = 1; i <= 10; i++) {
      const user = await User.create({
        email: `student${studentCount}@emsi.ma`,
        password: '123456',
        role: 'student',
        firstName: `Student${studentCount}`,
        lastName: 'EMSI'
      });

      await Student.create({
  user: user._id,
  email: `student${studentCount}@emsi.ma`, // ✅ EMAIL UNIQUE
  studentId: `STU${String(studentCount).padStart(4, '0')}`,
  level: level._id,
  field: 'Génie Informatique',
  semester: 1,
  academicYear: '2024-2025',
  enrolledModules: modules
    .filter(m => m.level.toString() === level._id.toString())
    .map(m => m._id)
});


      studentCount++;
    }
  }

  console.log('🎉 DATABASE SEEDED SUCCESSFULLY');
  process.exit();
};

seed();
