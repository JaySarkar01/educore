const mongoose = require('mongoose');
const MONGODB_URI = "mongodb://localhost:27017/edu-core";

async function purge() {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;
    
    console.log("--- PURGING GHOST INVOICES ---");
    const invoices = await db.collection('feeinvoices').find({}).toArray();
    const students = await db.collection('students').find({}).toArray();
    const studentIds = new Set(students.map(s => s._id.toString()));

    let deletedCount = 0;
    for (const inv of invoices) {
        if (!studentIds.has(inv.studentId)) {
            console.log(`DELETING GHOST: ${inv._id} (${inv.studentName})`);
            await db.collection('feeinvoices').deleteOne({ _id: inv._id });
            deletedCount++;
        }
    }
    console.log(`Successfully purged ${deletedCount} ghost invoices.`);

    await mongoose.disconnect();
}
purge();
