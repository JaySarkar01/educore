const mongoose = require('mongoose');
const MONGODB_URI = "mongodb://localhost:27017/edu-core";

async function check() {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;
    const students = await db.collection('students').find({}).toArray();
    console.log("--- ALL STUDENTS ---");
    students.forEach(s => console.log(`Name: "${s.name}", Status: "${s.status}", ID: ${s._id}`));
    await mongoose.disconnect();
}
check();
