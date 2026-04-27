import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 60000, // AI calls can be slow
});

// Upload resume PDF → full analysis
export async function analyzeResume(file) {
  const formData = new FormData();
  formData.append("resume", file);
  const { data } = await api.post("/analyze", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

// Match resume against a job description
export async function matchJobDescription(resumeText, jobDescription) {
  const { data } = await api.post("/match", { resumeText, jobDescription });
  return data;
}

// Rewrite a single bullet point
export async function rewriteBullet(bullet, jobTitle = "") {
  const { data } = await api.post("/rewrite-bullet", { bullet, jobTitle });
  return data;
}
