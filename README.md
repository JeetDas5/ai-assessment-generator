# AI Assessment Generator

Welcome to the AI Assessment Generator. This is a platform designed to dynamically generate and manage assignments, quizzes, and assessments using advanced Artificial Intelligence. It features a Next.js frontend, an Express.js backend with Redis-backed queue worker processing, and a shared packages layer.

---

## Tech Stack & Architecture

This project is organized as a monorepo powered by Bun Workspaces for fast package management, building, and running.

### Frontend (/frontend)
- **Framework**: Next.js 16 (App Router)
- **Library**: React 19
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **State Management**: Zustand
- **Form Handling**: React Hook Form with @hookform/resolvers
- **HTTP Client**: Axios
- **Notifications**: Sonner for toast notifications

### Backend (/backend)
- **Runtime**: Bun
- **Framework**: Express.js (v5)
- **Database**: MongoDB (via Mongoose)
- **Queue & Background Jobs**: Redis-backed BullMQ for offline tasks (such as processing PDFs and generating AI questions)
- **AI Engine**: OpenAI Node SDK
- **Real-time**: Socket.io for live updates
- **Security & Auth**: JWT (JSON Web Tokens), Argon2 for password hashing, and Zod for schema validation
- **File Uploads**: Multer for handling file uploads (PDFs, docs)

### Shared Workspace (/packages/shared)
- A shared utility and type definition package utilized by both the frontend and backend to guarantee end-to-end type safety.

---

## Project Structure & Pages

Here is a structural overview of the workspace:

```
├── backend/                  # Express server, controllers, models, and BullMQ workers
├── frontend/                 # Next.js App Router application
│   ├── app/
│   │   ├── favicon.ico
│   │   ├── globals.css       # Design variables and styles
│   │   ├── layout.tsx        # Base application layout
│   │   ├── page.tsx          # Landing / Hub page (Active)
│   │   ├── school/
│   │   │   └── page.tsx      # School/Institution dashboard (Active)
│   │   ├── signin/
│   │   │   └── page.tsx      # Authentication Sign-In page (Active)
│   │   └── signup/
│   │       └── page.tsx      # Authentication Sign-Up page (Active)
│   ├── components/           # Reusable UI elements (Buttons, Forms, Cards)
│   └── store/                # Zustand global stores (Auth state, assessment state)
└── packages/
    └── shared/               # Shared TS types, Zod schemas, & utility functions
```

### Dummy Pages
The following dummy/placeholder routes are defined in the application:
1. **`/assessment/create`** - The interactive wizard to generate assignments using AI (with options for file upload, text prompt, difficulty, and tone).
2. **`/assessment/[id]`** - Detailed view of a generated assessment, enabling teachers to review, edit, or regenerate specific questions.
3. **`/assessment/[id]/take`** - Student portal view for taking the generated quiz with a timer.
4. **`/analytics`** - Dashboards showcasing performance metrics, question-wise correctness, and grading summaries.
5. **`/settings`** - Profile, institution settings, and API token configurations.

---

## How to Start the App

Ensure you have Bun installed globally on your machine. If not, install it using:
```bash
powershell -c "irm bun.sh/install.ps1 | iex"
```

### 1. Configure Environment Variables
Copy and configure environment variables in `/backend/.env`. Key keys required:
- `PORT` (e.g. 5000)
- `MONGO_URI` (your MongoDB connection string)
- `REDIS_HOST` & `REDIS_PORT` (for BullMQ queue processing)
- `OPENAI_API_KEY` (for AI question generation)
- `JWT_SECRET` (for user sessions)

### 2. Install Dependencies
Run the following at the root of the workspace to install dependencies across the monorepo:
```bash
bun install
```

### 3. Run the Development Server
To launch both the Next.js frontend and Express backend concurrently, run:
```bash
bun run dev
```

This uses `concurrently` to boot up:
- **Frontend** on http://localhost:3000
- **Backend** on the port configured in `.env` (default is http://localhost:5000)

---

Built with 💝 by [Jeet Das](https://github.com/JeetDas5) for Veda AI
