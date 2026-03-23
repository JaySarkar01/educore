const mongoose = require('mongoose');
const MONGODB_URI = "mongodb://localhost:27017/edu-core";

async function check() {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;
    const invs = await db.collection('feeinvoices').find({}).toArray();
    
    for (const inv of invs) {
        const idStr = inv.studentId ? inv.studentId.toString() : "";
        const isHex = /^[0-9a-fA-F]{24}$/.test(idStr);
        console.log(`Invoice ${inv._id}: StudentId "${idStr}", valid hex: ${isHex}`);
        
        if (!isHex) {
            console.log(`Searching for student named "${inv.studentName}" to fix ID...`);
            const student = await db.collection('students').findOne({ name: inv.studentName });
            if (student) {
                await db.collection('feeinvoices').updateOne({ _id: inv._id }, { $set: { studentId: student._id.toString() } });
                console.log(`FIXED: Updated invoice ${inv._id} with student ID ${student._id}`);
            } else {
                console.log(`NOT FOUND: No student named "${inv.studentName}" found.`);
            }
        }
    }

    await mongoose.disconnect();
}
check();
