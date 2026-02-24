import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    if (!process.env.DATABASE_URL) {
        return res.status(500).json({ error: 'Internal Server Error', details: 'DATABASE_URL is not defined.' });
    }

    const sql = neon(process.env.DATABASE_URL);

    try {
        const data = await sql`
            SELECT name, roll_number, solved_count, time_spent_seconds 
            FROM results 
            ORDER BY solved_count DESC, time_spent_seconds ASC 
            LIMIT 50
        `;

        // Normalize field names if necessary (sql results use snake_case by default based on schema)
        const formattedData = data.map(row => ({
            name: row.name,
            roll_number: row.roll_number,
            solved_count: row.solved_count,
            time_spent_seconds: row.time_spent_seconds
        }));

        return res.status(200).json(formattedData);
    } catch (error) {
        console.error('Database Error:', error);
        return res.status(500).json({ error: 'Failed to fetch leaderboard', details: error.message });
    }
}
