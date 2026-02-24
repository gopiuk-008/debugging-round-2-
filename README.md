<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/b3978154-7c31-4bd2-b386-f56d4c4aa687

## Deployment & Database Setup (MongoDB Atlas + Vercel)

This app is optimized for deployment on **Vercel** with **MongoDB Atlas**.

### 1. Database Setup
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
2. Create a new **Shared (Free)** cluster.
3. In **Database Access**: Create a user with **Read and Write** permissions. Remember your password!
4. In **Network Access**: Add IP `0.0.0.0/0` (Allow Access from Anywhere).
5. In **Database**: Click **Connect** -> **Drivers** -> **Node.js**.
6. Copy the connection string: `mongodb+srv://<username>:<password>@cluster0...`

### 2. Vercel Deployment
1. Push your code to GitHub.
2. Import the project into [Vercel](https://vercel.com/).
3. In the **Environment Variables** section, add:
   - `MONGODB_URI`: Your MongoDB connection string (replace `<password>` with your actual password).
4. Deploy!

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key (if needed for Java generation features).
3. Run the app:
   `npm run dev`
