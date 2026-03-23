const mongoose = require('mongoose');
const MONGODB_URI = "mongodb://localhost:27017/edu-core";

async function check() {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;
    
    console.log("--- CHECKING FEE INVOICES ---");
    const invoices = await db.collection('feeinvoices').find({}).toArray();
    invoices.forEach(inv => {
        console.log(`Invoice: ${inv._id}, StudentId: "${inv.studentId}", StudentName: "${inv.studentName}"`);
    });

    const badInvoices = invoices.filter(inv => !inv.studentId || inv.studentId === "undefined");
    console.log(`Count of bad invoices: ${badInvoices.length}`);

    await mongoose.disconnect();
}
check();
