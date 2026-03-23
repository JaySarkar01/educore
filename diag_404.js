const mongoose = require('mongoose');
const MONGODB_URI = "mongodb://localhost:27017/edu-core";

async function check() {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;
    
    const targetId = "69c13cc6983a356361b2bf06";
    console.log(`--- CHECKING STUDENT ${targetId} ---`);
    const student = await db.collection('students').findOne({ _id: new mongoose.Types.ObjectId(targetId) });
    
    if (student) {
        console.log(`FOUND: ${student.name}, SchoolId: ${student.schoolId}`);
    } else {
        console.log(`NOT FOUND in 'students' collection.`);
        // Try searching by string ID just in case
        const studentStr = await db.collection('students').findOne({ _id: targetId });
        if (studentStr) {
            console.log(`FOUND (String ID): ${studentStr.name}, SchoolId: ${studentStr.schoolId}`);
        } else {
             console.log(`DEFINITELY NOT FOUND.`);
             const all = await db.collection('students').find({}).limit(5).toArray();
             console.log("Sample Students:");
             all.forEach(s => console.log(`- ${s.name} (${s._id})` ));
        }
    }

    console.log("\n--- CHECKING SESSIONS ---");
    const sessions = await db.collection('sessions').find({}).toArray();
    sessions.forEach(s => console.log(`Session SchoolId: ${s.schoolId}`));

    await mongoose.disconnect();
}
check();
