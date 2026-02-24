import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const sql = neon(process.env.DATABASE_URL);

        // Fetch top 10 results ordered by solved_count (desc) and time_spent_seconds (asc)
        const results = await sql`
      SELECT name, roll_number, department, solved_count, time_spent_seconds, submitted_at
      FROM results
      ORDER BY solved_count DESC, time_spent_seconds ASC
      LIMIT 10
    `;

        return res.status(200).json(results);
    } catch (error) {
        console.error('Database Error:', error);
        return res.status(500).json({ error: 'Failed to fetch leaderboard', details: error.message });
    }
}
