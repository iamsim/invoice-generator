require('dotenv').config();
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');
const { User } = require('../models');

async function createUser() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established.');

    // Sync models to ensure table exists
    await sequelize.sync({ alter: true });
    console.log('✅ Database models synchronized.');

    // Get user details from command line arguments or use defaults
    const args = process.argv.slice(2);
    const name = args[0] || 'admin';
    const email = args[1] || 'admin@example.com';
    const password = args[2] || 'admin123';
    const role = args[3] || 'superadmin';
    const isActive = args[4] !== undefined ? args[4] === 'true' : true;

    // Validate role
    if (!['client_admin', 'superadmin'].includes(role)) {
      console.error('❌ Role must be either "client_admin" or "superadmin"');
      process.exit(1);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      where: { 
        [Op.or]: [
          { email },
          { name }
        ]
      } 
    });
    if (existingUser) {
      console.log(`⚠️  User with email ${email} or name ${name} already exists.`);
      process.exit(0);
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password_hash: password,
      role,
      is_active: isActive
    });

    console.log('✅ User created successfully!');
    console.log('\nUser Details:');
    console.log(`  User ID: ${user.user_id}`);
    console.log(`  Name: ${user.name}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Role: ${user.role}`);
    console.log(`  Is Active: ${user.is_active}`);
    console.log(`\nYou can now login with:`);
    console.log(`  Email: ${email}`);
    console.log(`  Password: ${password}`);

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating user:', error);
    await sequelize.close();
    process.exit(1);
  }
}

createUser();
