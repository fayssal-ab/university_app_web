const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Student = require('../models/Student');
const Professor = require('../models/Professor');
const Branch = require('../models/Branch');
const Level = require('../models/Level');
const Module = require('../models/Module');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Error:', error.message);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Student.deleteMany({}),
      Professor.deleteMany({}),
      Branch.deleteMany({}),
      Level.deleteMany({}),
      Module.deleteMany({})
    ]);
    console.log('🗑️ Cleared existing data');

    // ==================== CREATE BRANCHES ====================
    console.log('\n📚 Creating Branches...');
    const branches = await Branch.create([
      {
        name: 'Génie Informatique',
        code: 'INFO',
        description: 'Programme en informatique et développement logiciel'
      },
      {
        name: 'Réseaux et Sécurité',
        code: 'RESEAU',
        description: 'Spécialisation en réseaux informatiques et cybersécurité'
      },
      {
        name: 'Data Science',
        code: 'DATA',
        description: 'Programme axé sur l\'analyse de données et machine learning'
      }
    ]);
    console.log(`✅ Created ${branches.length} branches`);

    // ==================== CREATE LEVELS ====================
    console.log('\n🎓 Creating Levels...');
    const levels = await Level.create([
      // Info Branch - 5 years
      { name: '1ère Année Prépa Info', shortName: '1A-PREP', branch: branches[0]._id, academicYear: '2024-2025', capacity: 30 },
      { name: '2ème Année Prépa Info', shortName: '2A-PREP', branch: branches[0]._id, academicYear: '2024-2025', capacity: 30 },
      { name: '1ère Année Tronc Commun', shortName: '1TC', branch: branches[0]._id, academicYear: '2024-2025', capacity: 50 },
      { name: '2ème Année Ing Info', shortName: '2ING-INFO', branch: branches[0]._id, academicYear: '2024-2025', capacity: 25 },
      { name: '3ème Année Ing Info', shortName: '3ING-INFO', branch: branches[0]._id, academicYear: '2024-2025', capacity: 25 },
      
      // Reseaux Branch
      { name: '1ère Année Prépa Réseaux', shortName: '1A-RES', branch: branches[1]._id, academicYear: '2024-2025', capacity: 20 },
      { name: '2ème Année Ing Réseaux', shortName: '2ING-RES', branch: branches[1]._id, academicYear: '2024-2025', capacity: 20 },
      { name: '3ème Année Ing Réseaux', shortName: '3ING-RES', branch: branches[1]._id, academicYear: '2024-2025', capacity: 20 },
      
      // Data Branch
      { name: '1ère Année Data Science', shortName: '1DATA', branch: branches[2]._id, academicYear: '2024-2025', capacity: 25 },
      { name: '2ème Année Data Science', shortName: '2DATA', branch: branches[2]._id, academicYear: '2024-2025', capacity: 25 }
    ]);
    console.log(`✅ Created ${levels.length} levels`);

    // ==================== CREATE PROFESSORS ====================
    console.log('\n👨‍🏫 Creating Professors...');
    const profUsers = await User.create([
      { email: 'prof.ahmed@emsi.ma', password: 'prof123456', role: 'professor', firstName: 'Ahmed', lastName: 'Bennani' },
      { email: 'prof.fatima@emsi.ma', password: 'prof123456', role: 'professor', firstName: 'Fatima', lastName: 'Alaoui' },
      { email: 'prof.karim@emsi.ma', password: 'prof123456', role: 'professor', firstName: 'Karim', lastName: 'Mansouri' },
      { email: 'prof.souad@emsi.ma', password: 'prof123456', role: 'professor', firstName: 'Souad', lastName: 'Roussi' },
      { email: 'prof.hassan@emsi.ma', password: 'prof123456', role: 'professor', firstName: 'Hassan', lastName: 'Idrissi' }
    ]);

    const professors = await Professor.create([
      { user: profUsers[0]._id, professorId: 'PROF001', department: 'Informatique', specialization: 'Programmation', branches: [branches[0]._id] },
      { user: profUsers[1]._id, professorId: 'PROF002', department: 'Informatique', specialization: 'Réseaux', branches: [branches[1]._id] },
      { user: profUsers[2]._id, professorId: 'PROF003', department: 'Informatique', specialization: 'Data Science', branches: [branches[2]._id] },
      { user: profUsers[3]._id, professorId: 'PROF004', department: 'Informatique', specialization: 'Sécurité', branches: [branches[0]._id, branches[1]._id] },
      { user: profUsers[4]._id, professorId: 'PROF005', department: 'Informatique', specialization: 'Bases de Données', branches: [branches[0]._id, branches[2]._id] }
    ]);
    console.log(`✅ Created ${professors.length} professors`);

    // ==================== CREATE MODULES ====================
    console.log('\n📖 Creating Modules...');
    const modules = await Module.create([
      // Info Branch Modules
      { code: 'INF101', name: 'Programmation C', semester: 1, level: levels[0]._id, field: 'Informatique', professor: professors[0]._id, coefficient: 2, academicYear: '2024-2025' },
      { code: 'INF102', name: 'Algorithmique', semester: 1, level: levels[0]._id, field: 'Informatique', professor: professors[0]._id, coefficient: 2, academicYear: '2024-2025' },
      { code: 'INF103', name: 'Mathématiques Discrètes', semester: 1, level: levels[0]._id, field: 'Informatique', professor: professors[4]._id, coefficient: 1, academicYear: '2024-2025' },
      { code: 'INF201', name: 'POO Java', semester: 2, level: levels[0]._id, field: 'Informatique', professor: professors[0]._id, coefficient: 2, academicYear: '2024-2025' },
      
      { code: 'INF301', name: 'Développement Web', semester: 1, level: levels[1]._id, field: 'Informatique', professor: professors[0]._id, coefficient: 2, academicYear: '2024-2025' },
      { code: 'INF302', name: 'Bases de Données', semester: 1, level: levels[1]._id, field: 'Informatique', professor: professors[4]._id, coefficient: 2, academicYear: '2024-2025' },
      { code: 'INF303', name: 'Systèmes d\'Exploitation', semester: 2, level: levels[1]._id, field: 'Informatique', professor: professors[3]._id, coefficient: 1, academicYear: '2024-2025' },
      
      { code: 'INF401', name: 'Programmation Avancée', semester: 1, level: levels[2]._id, field: 'Informatique', professor: professors[0]._id, coefficient: 2, academicYear: '2024-2025' },
      { code: 'INF402', name: 'Structures de Données', semester: 1, level: levels[2]._id, field: 'Informatique', professor: professors[4]._id, coefficient: 2, academicYear: '2024-2025' },
      { code: 'INF403', name: 'Réseaux Informatiques', semester: 2, level: levels[2]._id, field: 'Informatique', professor: professors[1]._id, coefficient: 1, academicYear: '2024-2025' },
      
      // Reseaux Branch Modules
      { code: 'RES101', name: 'Introduction Réseaux', semester: 1, level: levels[5]._id, field: 'Réseaux', professor: professors[1]._id, coefficient: 2, academicYear: '2024-2025' },
      { code: 'RES102', name: 'Protocoles TCP/IP', semester: 1, level: levels[5]._id, field: 'Réseaux', professor: professors[1]._id, coefficient: 2, academicYear: '2024-2025' },
      { code: 'RES201', name: 'Sécurité Réseaux', semester: 1, level: levels[6]._id, field: 'Réseaux', professor: professors[3]._id, coefficient: 2, academicYear: '2024-2025' },
      { code: 'RES202', name: 'Administration Systèmes', semester: 2, level: levels[6]._id, field: 'Réseaux', professor: professors[3]._id, coefficient: 2, academicYear: '2024-2025' },
      
      // Data Branch Modules
      { code: 'DATA101', name: 'Statistiques', semester: 1, level: levels[8]._id, field: 'Data', professor: professors[2]._id, coefficient: 2, academicYear: '2024-2025' },
      { code: 'DATA102', name: 'Python Data', semester: 1, level: levels[8]._id, field: 'Data', professor: professors[2]._id, coefficient: 2, academicYear: '2024-2025' },
      { code: 'DATA201', name: 'Machine Learning', semester: 1, level: levels[9]._id, field: 'Data', professor: professors[2]._id, coefficient: 2, academicYear: '2024-2025' },
      { code: 'DATA202', name: 'Big Data', semester: 2, level: levels[9]._id, field: 'Data', professor: professors[2]._id, coefficient: 2, academicYear: '2024-2025' }
    ]);
    console.log(`✅ Created ${modules.length} modules`);

    // ==================== CREATE 50 STUDENTS ====================
    console.log('\n👨‍🎓 Creating 50 Students...');
    const firstNames = ['Ali', 'Mohamed', 'Fatima', 'Ayoub', 'Noor', 'Hassan', 'Layla', 'Omar', 'Aisha', 'Ibrahim'];
    const lastNames = ['Bennani', 'Alaoui', 'Mansouri', 'Idrissi', 'Roussi', 'Fassi', 'Zahra', 'El Qadi', 'Tajine', 'Salmi'];
    
    const studentUsers = [];
    const studentsData = [];

    for (let i = 1; i <= 50; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      
      const user = await User.create({
        email: `student${i}@emsi.ma`,
        password: 'student123456',
        role: 'student',
        firstName: `${firstName}${i}`,
        lastName: lastName
      });
      
      // Distribute students across levels
      let levelIndex;
      if (i <= 15) levelIndex = 0; // 1A-PREP
      else if (i <= 30) levelIndex = 1; // 2A-PREP
      else if (i <= 40) levelIndex = 5; // 1A-RES
      else levelIndex = 8; // 1DATA

      const levelObj = levels[levelIndex];
      const levelModules = modules.filter(m => m.level.toString() === levelObj._id.toString());
      
      studentsData.push({
        user: user._id,
        studentId: `STU2024${String(i).padStart(3, '0')}`,
        level: levelObj._id,
        field: branches[levelIndex < 5 ? 0 : levelIndex < 8 ? 1 : 2].name,
        enrolledModules: levelModules.map(m => m._id),
        semester: 1,
        academicYear: '2024-2025'
      });
    }

    await Student.create(studentsData);
    console.log(`✅ Created 50 students`);

    // ==================== SUMMARY ====================
    console.log('\n' + '='.repeat(50));
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(50));
    console.log('\n📊 Summary:');
    console.log(`  📚 Branches: ${branches.length}`);
    console.log(`  🎓 Levels: ${levels.length}`);
    console.log(`  👨‍🏫 Professors: ${professors.length}`);
    console.log(`  📖 Modules: ${modules.length}`);
    console.log(`  👨‍🎓 Students: 50`);
    console.log('\n🔐 Test Credentials:');
    console.log('  📧 Students: student1@emsi.ma - student50@emsi.ma (password: student123456)');
    console.log('  📧 Professors: prof.ahmed@emsi.ma, prof.fatima@emsi.ma, etc. (password: prof123456)');
    console.log('\n' + '='.repeat(50) + '\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeding
connectDB().then(() => seedDatabase());