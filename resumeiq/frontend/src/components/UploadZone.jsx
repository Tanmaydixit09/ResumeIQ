import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

export default function UploadZone({ onAnalyze, loading }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const onDrop = useCallback((accepted, rejected) => {
    setError("");
    if (rejected.length > 0) {
      setError("Only PDF files are accepted (max 5MB).");
      return;
    }
    setFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  });

  const handleSubmit = () => {
    if (!file) return;
    onAnalyze(file);
  };

  return (
    <div className="max-w-xl mx-auto mt-16 px-4">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-semibold text-gray-900 mb-3">ResumeIQ</h1>
        <p className="text-gray-500 text-lg">
          Upload your resume and get an instant ATS score, section-by-section
          feedback, and AI-rewritten bullet points.
        </p>
      </div>

      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors
          ${isDragActive
            ? "border-indigo-400 bg-indigo-50"
            : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
          }`}
      >
        <input {...getInputProps()} />
        <div className="text-4xl mb-4">📄</div>
        {file ? (
          <p className="text-gray-800 font-medium">{file.name}</p>
        ) : isDragActive ? (
          <p className="text-indigo-600 font-medium">Drop it here!</p>
        ) : (
          <>
            <p className="text-gray-700 font-medium mb-1">Drag & drop your resume PDF</p>
            <p className="text-gray-400 text-sm">or click to browse — max 5MB</p>
          </>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}

      {/* Analyze button */}
      <button
        onClick={handleSubmit}
        disabled={!file || loading}
        className="w-full mt-5 py-3 rounded-xl bg-indigo-600 text-white font-medium text-base
          hover:bg-indigo-700 active:scale-[0.98] transition-all
          disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
            Analyzing…
          </span>
        ) : "Analyze my resume →"}
      </button>
    </div>
  );
}
