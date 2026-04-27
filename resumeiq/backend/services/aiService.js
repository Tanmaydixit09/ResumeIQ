import "dotenv/config";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ── Shared helper ────────────────────────────────────────────────────────
async function chat(systemPrompt, userContent) {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user",   content: userContent  },
    ],
  });
  return JSON.parse(response.choices[0].message.content);
}

// ── 1. Score & full analysis ─────────────────────────────────────────────
export async function analyzeResume(resumeText) {
  const system = `
You are an expert ATS (Applicant Tracking System) and career coach.
Analyze the resume and return ONLY valid JSON with this exact shape:
{
  "ats_score": <number 0-100>,
  "score_breakdown": {
    "formatting":   <0-25>,
    "keywords":     <0-25>,
    "achievements": <0-25>,
    "clarity":      <0-25>
  },
  "summary": "<2-sentence overall assessment>",
  "sections": [
    {
      "name": "<section name>",
      "rating": "<Good|Needs Work|Missing>",
      "feedback": "<specific, actionable advice>",
      "improved_bullets": ["<rewritten bullet>", ...]
    }
  ],
  "top_keywords_found": ["keyword1", "keyword2"],
  "missing_keywords":   ["keyword3", "keyword4"],
  "quick_wins": ["<short tip 1>", "<short tip 2>", "<short tip 3>"]
}
`.trim();

  return await chat(system, `Resume:\n\n${resumeText}`);
}

// ── 2. Job description match ─────────────────────────────────────────────
export async function matchJobDescription(resumeText, jobDescription) {
  const system = `
You are a recruiter scoring how well a resume matches a job description.
Return ONLY valid JSON:
{
  "match_score": <number 0-100>,
  "matched_skills":   ["skill1", ...],
  "missing_skills":   ["skill1", ...],
  "tailoring_tips":   ["<specific change to make>", ...],
  "tailored_summary": "<rewritten resume summary optimized for this JD>"
}
`.trim();

  return await chat(system, `Resume:\n\n${resumeText}\n\n---\nJob Description:\n\n${jobDescription}`);
}

// ── 3. Rewrite a single bullet ───────────────────────────────────────────
export async function rewriteBullet(bullet, jobTitle = "") {
  const system = `
You are a resume writing expert. Rewrite bullet points to be achievement-focused,
start with a strong action verb, include metrics where possible, and be ATS-friendly.
Return ONLY valid JSON: { "original": "...", "rewritten": "...", "explanation": "..." }
`.trim();

  return await chat(system, `Job title context: ${jobTitle || "not specified"}\n\nBullet: ${bullet}`);
}
