<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/b3978154-7c31-4bd2-b386-f56d4c4aa687

## Deployment & Database Setup (Neon + Vercel)

This app is optimized for deployment on **Vercel** with **Neon PostgreSQL**.

### 1. Database Setup
1. Create a free account at [Neon.tech](https://neon.tech/).
2. Create a new project and database.
3. Run the following SQL command in the Neon Console to create the results table:

```sql
CREATE TABLE results (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    roll_number VARCHAR(50) NOT NULL,
    department VARCHAR(50),
    unique_code VARCHAR(50) UNIQUE,
    time_spent_seconds INT NOT NULL,
    solved_count INT NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Vercel Deployment
1. Push your code to GitHub.
2. Import the project into [Vercel](https://vercel.com/).
3. In the **Environment Variables** section, add:
   - `DATABASE_URL`: Your Neon connection string (e.g., `postgres://user:pass@host/db`).
4. Deploy!

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key (if needed for Java generation features).
3. Run the app:
   `npm run dev`
