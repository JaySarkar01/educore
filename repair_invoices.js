const mongoose = require('mongoose');
const MONGODB_URI = "mongodb://localhost:27017/edu-core";

async function repair() {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;
    
    console.log("--- REPAIRING GHOST INVOICES ---");
    const invoices = await db.collection('feeinvoices').find({}).toArray();
    const students = await db.collection('students').find({}).toArray();

    for (const inv of invoices) {
        const student = students.find(s => s.name === inv.studentName);
        if (student) {
            console.log(`REPAIRING: Invoice ${inv._id} for "${inv.studentName}" -> New ID: ${student._id}`);
            await db.collection('feeinvoices').updateOne(
                { _id: inv._id },
                { $set: { studentId: student._id.toString() } }
            );
        } else {
            console.log(`UNABLE TO REPAIR: Invoice ${inv._id} for "${inv.studentName}" (No matching student found)`);
        }
    }

    await mongoose.disconnect();
}
repair();
