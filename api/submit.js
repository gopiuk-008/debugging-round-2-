import mongoose from 'mongoose';

// Define the Result Schema
const ResultSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rollNumber: { type: String, required: true },
    department: { type: String, required: true },
    uniqueId: { type: String, required: true, unique: true }, // System generated
    round: { type: Number, required: true },
    language: { type: String, required: true },
    timeSpentSeconds: { type: Number, required: true },
    attemptedCount: { type: Number, required: true },
    solvedCount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Use existing model or create new one with collection name 'result2'
const Result = mongoose.models.Result || mongoose.model('Result', ResultSchema, 'result2');

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        console.log('Using existing MongoDB connection');
        return;
    }
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('MONGODB_URI is missing from environment variables');
        throw new Error('MONGODB_URI is not defined');
    }
    console.log('Connecting to MongoDB...');
    return mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000, // 10s timeout
    });
};

const generateUniqueId = () => {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    return `DBG26-B-${randomDigits}`;
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { name, rollNumber, department, round, language, timeSpentSeconds, attemptedCount, solvedCount } = req.body;

    if (!name || !rollNumber || !department || !language || round === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        await connectDB();

        // Check if this user has already submitted for THIS SPECIFIC round
        const existingSubmission = await Result.findOne({ rollNumber, round });
        if (existingSubmission) {
            return res.status(400).json({
                error: `You have already submitted results for Round ${round}.`,
                uniqueId: existingSubmission.uniqueId
            });
        }

        // Generate a unique ID that doesn't exist yet
        let uniqueId;
        let isUnique = false;
        let attempts = 0;
        while (!isUnique && attempts < 10) {
            uniqueId = generateUniqueId();
            const collision = await Result.findOne({ uniqueId });
            if (!collision) {
                isUnique = true;
            }
            attempts++;
        }

        if (!isUnique) {
            throw new Error('Failed to generate a unique system ID after multiple attempts');
        }

        // Insert new result
        const newResult = new Result({
            name, rollNumber, department, uniqueId, round, language,
            timeSpentSeconds, attemptedCount, solvedCount
        });

        const savedResult = await newResult.save();
        console.log(`Saved result with uniqueId: ${uniqueId}`);

        return res.status(200).json({
            success: true,
            message: 'Result stored successfully',
            uniqueId: savedResult.uniqueId,
            id: savedResult._id
        });
    } catch (error) {
        console.error('Database Error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to store result',
            details: error.message
        });
    }
}
