const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function updatePermissions() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected.');
  await mongoose.connection.collection('roles').updateOne(
    { name: 'ACCOUNTANT' },
    { $addToSet: { permissions: 'fees.manage' } }
  );
  console.log('Permission fees.manage added to ACCOUNTANT.');
  process.exit(0);
}
updatePermissions();