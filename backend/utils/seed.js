const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');


dotenv.config();


const Tenant = require('../models/Tenant');
const User = require('../models/User');


const connectDB = require('../config/db');
connectDB();

const importData = async () => {
  try {
    
    await Tenant.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed...');

    const hashedPassword = await bcrypt.hash('password', 10);

    
    const acme = await Tenant.create({
      name: 'Acme',
      slug: 'acme',
    });

    await User.create([
      {
        email: 'admin@acme.test',
        password: hashedPassword,
        role: 'ADMIN',
        tenantId: acme._id,
      },
      {
        email: 'user@acme.test',
        password: hashedPassword,
        role: 'MEMBER',
        tenantId: acme._id,
      },
    ]);

    
    const globex = await Tenant.create({
      name: 'Globex',
      slug: 'globex',
    });

    await User.create([
      {
        email: 'admin@globex.test',
        password: hashedPassword,
        role: 'ADMIN',
        tenantId: globex._id,
      },
      {
        email: 'user@globex.test',
        password: hashedPassword,
        role: 'MEMBER',
        tenantId: globex._id,
      },
    ]);

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};


const destroyData = async () => {
  try {
    await Tenant.deleteMany();
    await User.deleteMany();
    console.log('Data Destroyed Successfully!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  destroyData();
}