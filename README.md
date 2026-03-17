# AI Study Planner for B.Tech Students

A complete full-stack serverless web application that generates personalized AI-powered daily study schedules. It balances Academic Subjects, DSA Practice, Skill Development, and Exam preparation (e.g., CAT/GATE). 

## Tech Stack
- **Frontend**: Vanilla HTML / CSS / JavaScript with modern glassmorphic aesthetics.
- **Backend / API**: Node.js Serverless Functions (`/api/*`).
- **Database**: Neon PostgreSQL.
- **Hosting**: Vercel (Ready for deployment).

## Features
- **Smart Scheduling Algorithm**: Distributes study hours dynamically, prioritizing harder topics first.
- **Pomodoro Break Support**: Automatically inserts short breaks into long study sessions.
- **Dynamic Adjustments**: Schedules update automatically as you complete tasks.
- **Progress Tracking**: View your completed topics, total hours studied, and remaining tasks.
- **Rich User Interface**: Stunning dark/light mode toggle with smooth animations and responsive design.

## Required Setup

### 1. Database (Neon PostgreSQL)
You must set up a PostgreSQL database (Neon is recommended for serverless).
1. Create a Neon account and copy your connection string (e.g., `postgres://user:password@hostname/database?sslmode=require`).
2. Open your database SQL Editor and execute the table schema found in `db-init.sql` (located in the project root).

### 2. Local Environment
Create a `.env` file in the project root and add your database URL:
```env
DATABASE_URL=your_neon_postgres_connection_string
```

### 3. Running Locally
This project uses Vercel CLI for local development to handle serverless endpoints.
```bash
npm install -g vercel
npm install
vercel dev
```
Open `http://localhost:3000` to view the application.

## Vercel Deployment Guide

1. Push this code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) and click "Add New Project".
3. Import your GitHub repository.
4. Expand the **Environment Variables** section. Add `DATABASE_URL` as the key and paste your Neon connection string as the value.
5. Click **Deploy**. Vercel will automatically configure the routing defined in `vercel.json` to handle the `/api` backend endpoints and serve the frontend files from `/public`.
