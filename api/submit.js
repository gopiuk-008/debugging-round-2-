import mongoose from 'mongoose';

const ResultSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rollNumber: { type: String, required: true },
    department: String,
    uniqueCode: { type: String, required: true, unique: true },
    timeSpentSeconds: { type: Number, required: true },
    solvedCount: { type: Number, required: true },
    submittedAt: { type: Date, default: Date.now }
});

const Result = mongoose.models.Result || mongoose.model('Result', ResultSchema);

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    return mongoose.connect(process.env.MONGODB_URI);
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { name, rollNumber, department, uniqueCode, timeSpentSeconds, solvedCount } = req.body;

    if (!process.env.MONGODB_URI) {
        return res.status(500).json({ error: 'Internal Server Error', details: 'MONGODB_URI is not defined in environment variables.' });
    }

    if (!name || !rollNumber || !uniqueCode) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        await connectDB();

        const newResult = new Result({
            name,
            rollNumber,
            department,
            uniqueCode,
            timeSpentSeconds,
            solvedCount
        });

        await newResult.save();

        return res.status(200).json({ message: 'Result stored successfully', id: newResult._id });
    } catch (error) {
        console.error('Database Error:', error);
        if (error.code === 11000) {
            return res.status(400).json({ error: 'You have already submitted your results.' });
        }
        return res.status(500).json({ error: 'Failed to store result', details: error.message });
    }
}
