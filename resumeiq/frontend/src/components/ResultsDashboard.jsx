import { useState } from "react";
import { matchJobDescription } from "../services/api";

const ratingColor = {
  Good: "bg-green-100 text-green-700",
  "Needs Work": "bg-yellow-100 text-yellow-700",
  Missing: "bg-red-100 text-red-700",
};

// Circular score gauge
function ScoreRing({ score }) {
  const radius = 52;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  const color = score >= 75 ? "#16a34a" : score >= 50 ? "#d97706" : "#dc2626";

  return (
    <svg width="140" height="140" className="block mx-auto">
      <circle cx="70" cy="70" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="10"/>
      <circle
        cx="70" cy="70" r={radius}
        fill="none" stroke={color} strokeWidth="10"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 70 70)"
        style={{ transition: "stroke-dashoffset 1s ease" }}
      />
      <text x="70" y="64" textAnchor="middle" fontSize="28" fontWeight="600" fill={color}>{score}</text>
      <text x="70" y="82" textAnchor="middle" fontSize="12" fill="#9ca3af">/ 100</text>
    </svg>
  );
}

export default function ResultsDashboard({ analysis, resumeText, onReset }) {
  const [jd, setJd] = useState("");
  const [matchResult, setMatchResult] = useState(null);
  const [matching, setMatching] = useState(false);
  const [copied, setCopied] = useState("");

  const handleMatch = async () => {
    if (!jd.trim()) return;
    setMatching(true);
    try {
      const { match } = await matchJobDescription(resumeText, jd);
      setMatchResult(match);
    } catch (e) {
      alert("Match failed: " + e.message);
    } finally {
      setMatching(false);
    }
  };

  const copyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">Analysis results</h2>
        <button onClick={onReset} className="text-sm text-indigo-600 hover:underline">
          ← Upload another
        </button>
      </div>

      {/* Score card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6 text-center shadow-sm">
        <ScoreRing score={analysis.ats_score} />
        <p className="mt-3 text-gray-500 text-sm font-medium uppercase tracking-wide">ATS Score</p>
        <p className="text-gray-700 mt-3 text-sm leading-relaxed max-w-md mx-auto">{analysis.summary}</p>

        {/* Score breakdown */}
        <div className="grid grid-cols-2 gap-3 mt-5 text-left">
          {Object.entries(analysis.score_breakdown).map(([key, val]) => (
            <div key={key} className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 capitalize mb-1">{key}</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                  <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${(val / 25) * 100}%` }}/>
                </div>
                <span className="text-xs font-medium text-gray-600">{val}/25</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick wins */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 mb-6">
        <h3 className="font-medium text-indigo-900 mb-3">⚡ Quick wins</h3>
        <ul className="space-y-2">
          {analysis.quick_wins.map((tip, i) => (
            <li key={i} className="flex gap-2 text-sm text-indigo-800">
              <span className="text-indigo-400 mt-0.5">→</span>{tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Section feedback */}
      <h3 className="font-semibold text-gray-800 mb-3">Section feedback</h3>
      <div className="space-y-4 mb-8">
        {analysis.sections.map((sec, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-medium text-gray-800">{sec.name}</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ratingColor[sec.rating] || "bg-gray-100 text-gray-600"}`}>
                {sec.rating}
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{sec.feedback}</p>

            {/* Improved bullets */}
            {sec.improved_bullets?.length > 0 && (
              <div className="mt-4 bg-green-50 rounded-xl p-4">
                <p className="text-xs font-medium text-green-700 mb-2 uppercase tracking-wide">
                  AI-rewritten bullets
                </p>
                <ul className="space-y-2">
                  {sec.improved_bullets.map((bullet, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-green-800">
                      <span className="text-green-400 mt-0.5 shrink-0">•</span>
                      <span className="flex-1">{bullet}</span>
                      <button
                        onClick={() => copyText(bullet, `${i}-${j}`)}
                        className="text-xs text-green-600 hover:text-green-800 shrink-0"
                      >
                        {copied === `${i}-${j}` ? "Copied!" : "Copy"}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Keywords */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h3 className="font-medium text-gray-800 mb-3 text-sm">✅ Keywords found</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.top_keywords_found.map((k, i) => (
              <span key={i} className="text-xs bg-green-50 text-green-700 border border-green-100 px-2 py-1 rounded-full">{k}</span>
            ))}
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h3 className="font-medium text-gray-800 mb-3 text-sm">❌ Missing keywords</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.missing_keywords.map((k, i) => (
              <span key={i} className="text-xs bg-red-50 text-red-600 border border-red-100 px-2 py-1 rounded-full">{k}</span>
            ))}
          </div>
        </div>
      </div>

      {/* JD Match feature */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-1">Job description match</h3>
        <p className="text-sm text-gray-500 mb-3">Paste a job description to see your fit score and tailoring tips.</p>
        <textarea
          value={jd}
          onChange={e => setJd(e.target.value)}
          placeholder="Paste the job description here..."
          rows={5}
          className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        <button
          onClick={handleMatch}
          disabled={!jd.trim() || matching}
          className="mt-3 w-full py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium
            hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {matching ? "Matching…" : "Check match →"}
        </button>

        {matchResult && (
          <div className="mt-5 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-semibold text-indigo-600">{matchResult.match_score}%</span>
              <span className="text-sm text-gray-500">match with this job</span>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Tailoring tips</p>
              <ul className="space-y-1.5">
                {matchResult.tailoring_tips.map((tip, i) => (
                  <li key={i} className="text-sm text-gray-700 flex gap-2">
                    <span className="text-indigo-400">→</span>{tip}
                  </li>
                ))}
              </ul>
            </div>
            {matchResult.tailored_summary && (
              <div className="bg-indigo-50 rounded-xl p-4">
                <p className="text-xs font-medium text-indigo-700 uppercase tracking-wide mb-2">Tailored summary for this role</p>
                <p className="text-sm text-indigo-900 leading-relaxed">{matchResult.tailored_summary}</p>
                <button onClick={() => copyText(matchResult.tailored_summary, "summary")}
                  className="text-xs text-indigo-600 mt-2 hover:underline">
                  {copied === "summary" ? "Copied!" : "Copy summary"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
