import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import analyzeRouter from "./routes/analyze.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || "http://localhost:5173",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ],
  credentials: true,
}));
app.use(express.json());

// Rate limit: 20 requests / 15 min per IP (OpenAI costs money!)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many requests, please try again later." },
});
app.use("/api", limiter);

// ── Routes ──────────────────────────────────────────────────────────────
app.use("/api", analyzeRouter);

app.get("/health", (_, res) => res.json({ status: "ok" }));

// ── Start ────────────────────────────────────────────────────────────────
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
