const mongoose = require('mongoose');
const MONGODB_URI = "mongodb://localhost:27017/edu-core";

async function check() {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;
    const invoices = await db.collection('feeinvoices').find({}).toArray();
    invoices.forEach(inv => console.log(`INV Name: "${inv.studentName}", ID: ${inv.studentId}`));
    
    const students = await db.collection('students').find({}).toArray();
    students.forEach(s => console.log(`STU Name: "${s.name}", ID: ${s._id}`));

    await mongoose.disconnect();
}
check();
