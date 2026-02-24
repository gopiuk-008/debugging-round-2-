import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { name, rollNumber, department, uniqueCode, language, timeSpentSeconds, attemptedCount, solvedCount } = req.body;

    if (!process.env.DATABASE_URL) {
        return res.status(500).json({ error: 'Internal Server Error', details: 'DATABASE_URL is not defined.' });
    }

    if (!name || !rollNumber || !uniqueCode || !language) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const sql = neon(process.env.DATABASE_URL);

    try {
        // Check for existing roll number
        const existingUser = await sql`SELECT roll_number FROM results WHERE roll_number = ${rollNumber} LIMIT 1`;
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'This Roll Number has already submitted the test.' });
        }

        // Insert new result
        const result = await sql`
            INSERT INTO results (
                name, roll_number, department, unique_code, language, time_spent_seconds, attempted_count, solved_count
            ) VALUES (
                ${name}, ${rollNumber}, ${department}, ${uniqueCode}, ${language}, ${timeSpentSeconds}, ${attemptedCount}, ${solvedCount}
            ) RETURNING id
        `;

        return res.status(200).json({ message: 'Result stored successfully', id: result[0].id });
    } catch (error) {
        console.error('Database Error:', error);
        return res.status(500).json({ error: 'Failed to store result', details: error.message });
    }
}
