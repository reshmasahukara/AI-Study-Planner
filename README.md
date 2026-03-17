# AI Study Planner

An intelligent, modern study planning application designed specifically for B.Tech students. It helps users organize their study topics, prioritize difficult subjects, and automatically generate optimal study schedules with built-in break intervals.

## 🚀 Features

*   **Smart Scheduling**: Automatically generates study plans based on available hours and topic difficulty.
*   **Topic Management**: Add, categorize, and prioritize study topics (Easy, Medium, Hard).
*   **Progress Tracking**: Mark topics as completed and track time spent.
*   **Modern UI**: Beautiful, responsive layout with glassmorphism effects, dynamic gradients, and smooth animations.
*   **Comprehensive Dashboard**: View today's schedule, weekly progress, and upcoming goals at a glance.
*   **Analytics & Goals**: Visual representations of study metrics and goal tracking.

## 🛠️ Tech Stack

### Frontend
*   Vanilla **HTML5**, **CSS3**, **JavaScript**
*   Custom CSS properties for theming (Light/Dark mode ready)
*   Responsive Flexbox and CSS Grid layouts
*   No heavy frontend frameworks—keeping it lightweight and blazingly fast.

### Backend & API
*   **Node.js** (Serverless Functions)
*   Deployed on **Vercel** (`vercel.json` specified routes)
*   **PostgreSQL** database (via Neon Tech)
*   `pg` library for database connections

## 📁 Project Structure

```
AI Study Planner/
├── api/                   # Vercel Serverless backend API functions
│   ├── add-topic.js       # API to add new study topics
│   ├── generate-plan.js   # AI scheduling algorithm
│   ├── get-dashboard.js   # Fetches user summary data
│   ├── get-plan.js        # Retrieves existing study plans
│   └── update-progress.js # Updates topic completion status
├── public/                # Frontend assets and HTML pages
│   ├── index.html         # Landing page
│   ├── dashboard.html     # Main user dashboard
│   ├── planner.html       # Study plan manager
│   ├── css/               # Modular CSS stylesheets
│   ├── js/                # Client-side JavaScript
│   └── components/        # Reusable UI components
├── utils/                 # Shared utilities
│   └── db.js              # Database connection helper
├── package.json           # Node.js dependencies and scripts
└── vercel.json            # Vercel deployment configuration
```

## ⚙️ Setup & Local Development

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd "AI Study Planner"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up the Database:**
   *   Create a PostgreSQL database (e.g., using Neon.tech).
   *   Run the SQL scripts in `db-init.sql` to create the required tables (`Users`, `Study_Topics`, `Study_Plan`, `Progress`).
   *   Create a `.env` file in the root directory and add your database connection string:
       ```env
       DATABASE_URL="postgres://user:password@hostname/dbname"
       ```

4. **Run locally using Vercel Dev:**
   Since the backend uses Vercel Serverless Functions, the easiest way to run the full stack locally is with the Vercel CLI.
   ```bash
   npm install -g vercel
   npm run start
   # or `vercel dev`
   ```

5. **Start exploring!**
   Open `http://localhost:3000` (or the port Vercel provides) in your web browser.

## 🧠 How the AI Scheduling Works

When calling the `/api/generate-plan` endpoint, the system:
1.  Retrieves all pending topics for the user.
2.  Sorts them prioritizing **Hard** -> **Medium** -> **Easy** topics, and by oldest added.
3.  Allocates topics into 45-minute focus blocks.
4.  Optionally interleaves 15-minute breaks between study sessions to prevent burnout.
5.  Saves the generated plan constraint within the user's available time budget.

## 📄 License
This project is open-source and available under the MIT License.
