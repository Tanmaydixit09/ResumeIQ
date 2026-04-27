import { useState } from "react";
import UploadZone from "./components/UploadZone";
import ResultsDashboard from "./components/ResultsDashboard";
import { analyzeResume } from "./services/api";

export default function App() {
  const [state, setState] = useState("upload"); // "upload" | "loading" | "results" | "error"
  const [results, setResults] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleAnalyze = async (file) => {
    setState("loading");
    setErrorMsg("");
    try {
      const data = await analyzeResume(file);
      setResults(data);
      setState("results");
    } catch (err) {
      const msg = err.response?.data?.error || err.message || "Something went wrong";
      setErrorMsg(msg);
      setState("error");
    }
  };

  const handleReset = () => {
    setResults(null);
    setErrorMsg("");
    setState("upload");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navbar */}
      <nav className="border-b border-gray-100 bg-white px-6 py-4 flex items-center gap-3">
        <span className="text-xl font-semibold text-gray-900">ResumeIQ</span>
        <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-medium">beta</span>
      </nav>

      {/* Content */}
      {state === "upload" && (
        <UploadZone onAnalyze={handleAnalyze} loading={false} />
      )}

      {state === "loading" && (
        <div className="flex flex-col items-center justify-center mt-32 gap-4">
          <svg className="animate-spin h-10 w-10 text-indigo-500" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
          <p className="text-gray-500 text-sm">AI is reading your resume…</p>
        </div>
      )}

      {state === "error" && (
        <div className="max-w-md mx-auto mt-24 text-center px-4">
          <p className="text-red-500 mb-4">{errorMsg}</p>
          <button onClick={handleReset} className="text-indigo-600 underline text-sm">Try again</button>
        </div>
      )}

      {state === "results" && results && (
        <ResultsDashboard
          analysis={results.analysis}
          resumeText={results.resumeText}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
