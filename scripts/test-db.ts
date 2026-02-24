import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error("❌ MONGODB_URI not found in .env.local");
    process.exit(1);
}

console.log("🔍 Attempting to connect to MongoDB...");
console.log(`URI: ${uri.replace(/:([^@]+)@/, ':****@')}`); // Hide password

async function testConnection() {
    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000 // 5 seconds timeout
        });
        console.log("✅ SUCCESSFULLY CONNECTED to MongoDB Atlas!");

        // Check if we can reach the specific database
        const dbName = mongoose.connection.db.databaseName;
        console.log(`📡 Linked to Database: ${dbName}`);

        await mongoose.disconnect();
        console.log("🔒 Disconnected safely.");
        process.exit(0);
    } catch (error) {
        console.error("❌ CONNECTION FAILED!");
        console.error("Error Details:", error.message);
        process.exit(1);
    }
}

testConnection();
