const mongoose = require('mongoose');
const MONGODB_URI = "mongodb://localhost:27017/edu-core";

async function check() {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;
    
    console.log("--- ANALYZING GHOST INVOICES ---");
    const invoices = await db.collection('feeinvoices').find({}).toArray();
    const students = await db.collection('students').find({}).toArray();
    const studentIds = new Set(students.map(s => s._id.toString()));

    let ghostCount = 0;
    for (const inv of invoices) {
        if (!studentIds.has(inv.studentId)) {
            console.log(`GHOST INVOICE: ${inv._id}, Name: ${inv.studentName}, ID: ${inv.studentId}`);
            ghostCount++;
        }
    }
    console.log(`Total Invoices: ${invoices.length}`);
    console.log(`Ghost Invoices: ${ghostCount}`);

    await mongoose.disconnect();
}
check();
