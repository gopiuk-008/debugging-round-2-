import mongoose from 'mongoose';

// Define the Result Schema (should be consistent with submit.js)
const ResultSchema = new mongoose.Schema({
    name: String,
    rollNumber: String,
    department: String,
    uniqueCode: String,
    round: Number,
    language: String,
    timeSpentSeconds: Number,
    attemptedCount: Number,
    solvedCount: Number,
    createdAt: { type: Date, default: Date.now }
});

const Result = mongoose.models.Result || mongoose.model('Result', ResultSchema, 'result2');

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is not defined in .env.local');
    }
    return mongoose.connect(process.env.MONGODB_URI);
};

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        await connectDB();

        const data = await Result.find()
            .select('name rollNumber solvedCount timeSpentSeconds round')
            .sort({ solvedCount: -1, timeSpentSeconds: 1 })
            .limit(50);

        // Normalize field names to match what the frontend expects (snake_case from previous SQL version)
        const formattedData = data.map(row => ({
            name: row.name,
            roll_number: row.rollNumber,
            solved_count: row.solvedCount,
            time_spent_seconds: row.timeSpentSeconds,
            round: row.round
        }));

        return res.status(200).json(formattedData);
    } catch (error) {
        console.error('Database Error:', error);
        return res.status(500).json({ error: 'Failed to fetch leaderboard', details: error.message });
    }
}
