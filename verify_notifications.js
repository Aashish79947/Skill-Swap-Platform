import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Notification from './backend/src/models/notification.js';

dotenv.config({ path: 'c:/Users/Aashish S/Desktop/Aashish/Mini Project/Skill Trading Platform/backend/.env' });

const verifyDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB");

        const count = await Notification.countDocuments();
        console.log(`Total notifications in DB: ${count}`);

        const latest = await Notification.findOne().sort({ createdAt: -1 });
        if (latest) {
            console.log("Latest Notification:");
            console.log(`- Message: ${latest.message}`);
            console.log(`- Type: ${latest.type}`);
            console.log(`- CreatedAt: ${latest.createdAt}`);
        } else {
            console.log("No notifications found.");
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error("❌ Verification failed:", err.message);
    }
};

verifyDB();
