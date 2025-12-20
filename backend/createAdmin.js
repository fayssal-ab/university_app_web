const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin exists
    const adminExists = await User.findOne({ email: 'admin@emsi.ma' });
    if (adminExists) {
      console.log('❌ Admin already exists!');
      console.log('📧 Email: admin@emsi.ma');
      console.log('🔑 Password: admin123');
      process.exit(0);
    }

    // Create admin
    const admin = await User.create({
      email: 'admin@emsi.ma',
      password: 'admin123',
      role: 'admin',
      firstName: 'Admin',
      lastName: 'EMSI',
      isActive: true
    });

    console.log('✅ Admin created successfully!');
    console.log('📧 Email: admin@emsi.ma');
    console.log('🔑 Password: admin123');
    console.log('👤 Name: Admin EMSI');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createAdmin();