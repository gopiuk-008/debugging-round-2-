import mongoose from 'mongoose';

// Define the Result Schema
const ResultSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rollNumber: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    uniqueCode: { type: String, required: true },
    language: { type: String, required: true },
    timeSpentSeconds: { type: Number, required: true },
    attemptedCount: { type: Number, required: true },
    solvedCount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Use existing model or create new one
const Result = mongoose.models.Result || mongoose.model('Result', ResultSchema);

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is not defined in .env.local');
    }
    return mongoose.connect(process.env.MONGODB_URI);
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { name, rollNumber, department, uniqueCode, language, timeSpentSeconds, attemptedCount, solvedCount } = req.body;

    if (!name || !rollNumber || !uniqueCode || !language) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        await connectDB();

        // Check for existing roll number
        const existingUser = await Result.findOne({ rollNumber });
        if (existingUser) {
            return res.status(400).json({ error: 'This Roll Number has already submitted the test.' });
        }

        // Insert new result
        const newResult = new Result({
            name, rollNumber, department, uniqueCode, language,
            timeSpentSeconds, attemptedCount, solvedCount
        });

        const savedResult = await newResult.save();

        return res.status(200).json({
            message: 'Result stored successfully',
            id: savedResult._id
        });
    } catch (error) {
        console.error('Database Error:', error);
        return res.status(500).json({ error: 'Failed to store result', details: error.message });
    }
}
