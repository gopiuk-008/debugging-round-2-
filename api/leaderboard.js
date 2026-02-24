import mongoose from 'mongoose';

const ResultSchema = new mongoose.Schema({
    name: String,
    rollNumber: String,
    department: String,
    uniqueCode: String,
    timeSpentSeconds: Number,
    solvedCount: Number,
    submittedAt: Date
});

const Result = mongoose.models.Result || mongoose.model('Result', ResultSchema);

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    return mongoose.connect(process.env.MONGODB_URI);
};

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        await connectDB();

        // Fetch top 10 results ordered by solvedCount (desc) and timeSpentSeconds (asc)
        const results = await Result.find()
            .sort({ solvedCount: -1, timeSpentSeconds: 1 })
            .limit(10)
            .select('name rollNumber department solvedCount timeSpentSeconds submittedAt');

        // Transform for UI consistency (camelCase to snake_case if needed, or keep for frontend fix)
        const transformedResults = results.map(r => ({
            name: r.name,
            roll_number: r.rollNumber,
            department: r.department,
            solved_count: r.solvedCount,
            time_spent_seconds: r.timeSpentSeconds,
            submitted_at: r.submittedAt
        }));

        return res.status(200).json(transformedResults);
    } catch (error) {
        console.error('Database Error:', error);
        return res.status(500).json({ error: 'Failed to fetch leaderboard', details: error.message });
    }
}
