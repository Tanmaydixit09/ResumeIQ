import express from "express";
import multer from "multer";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import { analyzeResume, matchJobDescription, rewriteBullet } from "../services/aiService.js";

const router = express.Router();

// Store uploaded files in memory (no disk writes needed)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (_, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files are allowed"));
  },
});

// ── POST /api/analyze ────────────────────────────────────────────────────
// Upload a PDF → returns full ATS analysis
router.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No PDF uploaded" });

    // 1. Extract text from PDF
    const { text } = await pdfParse(req.file.buffer);
    if (!text || text.trim().length < 100) {
      return res.status(422).json({ error: "Could not extract enough text from PDF. Try a text-based PDF." });
    }

    // 2. Analyze with AI
    const analysis = await analyzeResume(text);

    res.json({ success: true, analysis, resumeText: text });
  } catch (err) {
    console.error("Analyze error:", err.message);
    res.status(500).json({ error: err.message || "Analysis failed" });
  }
});

// ── POST /api/match ──────────────────────────────────────────────────────
// Takes extracted resume text + job description → returns match score
router.post("/match", express.json(), async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;
    if (!resumeText || !jobDescription) {
      return res.status(400).json({ error: "resumeText and jobDescription are required" });
    }

    const match = await matchJobDescription(resumeText, jobDescription);
    res.json({ success: true, match });
  } catch (err) {
    console.error("Match error:", err.message);
    res.status(500).json({ error: err.message || "Match failed" });
  }
});

// ── POST /api/rewrite-bullet ─────────────────────────────────────────────
router.post("/rewrite-bullet", express.json(), async (req, res) => {
  try {
    const { bullet, jobTitle } = req.body;
    if (!bullet) return res.status(400).json({ error: "bullet text is required" });

    const result = await rewriteBullet(bullet, jobTitle);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: err.message || "Rewrite failed" });
  }
});

export default router;
