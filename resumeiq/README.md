# ResumeIQ — AI Resume Analyzer

An AI-powered full-stack app that analyzes your resume, gives an ATS score,
provides section-by-section feedback, rewrites weak bullet points, and matches
your resume to a job description.

**Tech stack:** React + Vite + Tailwind (frontend) · Node.js + Express (backend) · Groq Llama 3.3 70B · pdf-parse

---

## Project structure

```
resumeiq/
├── backend/
│   ├── server.js              # Express app entry
│   ├── routes/analyze.js      # /api/analyze, /api/match, /api/rewrite-bullet
│   ├── services/aiService.js  # All AI prompts
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── components/
    │   │   ├── UploadZone.jsx       # Drag & drop PDF upload
    │   │   └── ResultsDashboard.jsx # Score, feedback, rewrites
    │   └── services/api.js          # Axios calls to backend
    └── .env.example
```

---

## Quick start

### 1. Backend

```bash
cd backend
cp .env.example .env
# Add your GROQ_API_KEY to .env
npm install
npm run dev
# → Runs on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
# → Runs on http://localhost:5173
```

---

## API endpoints

| Method | Route                | Description                    |
|--------|----------------------|--------------------------------|
| POST   | /api/analyze         | Upload PDF → full ATS analysis |
| POST   | /api/match           | Resume text + JD → match score |
| POST   | /api/rewrite-bullet  | Single bullet → AI rewrite     |
| GET    | /health              | Health check                   |

---

## Features

- **ATS score (0–100)** with breakdown across 4 dimensions
- **Section-by-section feedback** (Summary, Experience, Skills, Education)
- **AI-rewritten bullet points** with one-click copy
- **Keyword gap analysis** — found vs missing keywords
- **Job description matching** — paste any JD for a match score + tailoring tips
- **Rate limiting** — 20 requests / 15 min per IP

---

## Deployment

**Frontend → Vercel**
```bash
cd frontend && npx vercel --prod
```

**Backend → Render**
- Create a new Web Service on render.com
- Connect your GitHub repo
- Set `root directory` to `backend`
- Add env vars: `GROQ_API_KEY`, `FRONTEND_URL`

---

## What to add next (stretch features)

- [ ] User authentication (save past analyses)
- [ ] PDF highlight export with suggestions inline
- [ ] LinkedIn profile analyzer
- [ ] Multi-resume comparison
- [ ] Chrome extension

---

Built as a portfolio project. Live demo: [your-url-here]
