import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { name, rollNumber, department, uniqueCode, timeSpentSeconds, solvedCount } = req.body;

    // Basic validation
    if (!name || !rollNumber || !uniqueCode) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const sql = neon(process.env.DATABASE_URL);

        const result = await sql`
      INSERT INTO results (name, roll_number, department, unique_code, time_spent_seconds, solved_count)
      VALUES (${name}, ${rollNumber}, ${department}, ${uniqueCode}, ${timeSpentSeconds}, ${solvedCount})
      RETURNING id
    `;

        return res.status(200).json({ message: 'Result stored successfully', id: result[0].id });
    } catch (error) {
        console.error('Database Error:', error);
        return res.status(500).json({ error: 'Failed to store result', details: error.message });
    }
}
