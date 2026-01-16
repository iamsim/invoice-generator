require('dotenv').config();
const { sequelize } = require('../config/database');
const { User } = require('../models');

async function createUser() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established.');

    // Sync models to ensure table exists
    await sequelize.sync({ alter: false });
    console.log('✅ Database models synchronized.');

    // Get user details from command line arguments or use defaults
    const args = process.argv.slice(2);
    const name = args[0] || 'Admin User';
    const email = args[1] || 'admin@example.com';
    const password = args[2] || 'admin123';
    const type = args[3] || 'superadmin';

    // Validate type
    if (!['clientadmin', 'superadmin'].includes(type)) {
      console.error('❌ Type must be either "clientadmin" or "superadmin"');
      process.exit(1);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.log(`⚠️  User with email ${email} already exists.`);
      process.exit(0);
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      type
    });

    console.log('✅ User created successfully!');
    console.log('\nUser Details:');
    console.log(`  ID: ${user.id}`);
    console.log(`  Name: ${user.name}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Type: ${user.type}`);
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
