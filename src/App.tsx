import { useState } from "react";
import { FileUpload } from "./components/FileUpload";
import { JobDescriptionInput } from "./components/JobDescriptionInput";
import { ResultsPanel } from "./components/ResultsPanel";
import { analyzeResume, type AnalysisResult } from "./lib/scoring";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const canAnalyze = !!file && jobDescription.trim().length > 40 && !isAnalyzing;

  async function handleAnalyze() {
    if (!file) {
      setError("Please upload a resume first.");
      return;
    }
    if (jobDescription.trim().length <= 40) {
      setError("Please paste a fuller job description (at least a few sentences).");
      return;
    }

    setError(null);
    setIsAnalyzing(true);
    setResult(null);

    try {
      const { parseResumeFile } = await import("./lib/parseResume");
      const parsed = await parseResumeFile(file);

      if (!parsed.text || parsed.text.trim().length < 30) {
        setError(
          "We couldn't extract readable text from that file. Try re-saving your resume as a standard PDF or DOCX (avoid scanned images)."
        );
        setIsAnalyzing(false);
        return;
      }

      const analysis = analyzeResume(parsed.text, jobDescription, parsed.warnings);
      setResult(analysis);
    } catch (err) {
      console.error(err);
      setError(
        "Something went wrong while reading that file. Please try a different PDF or DOCX export of your resume."
      );
    } finally {
      setIsAnalyzing(false);
    }
  }

  function handleReset() {
    setFile(null);
    setJobDescription("");
    setResult(null);
    setError(null);
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="brand">
          <span className="brand-mark">A</span>
          ATS Score Check
        </div>
      </header>

      {!result && (
        <div className="hero">
          <h1>Is your resume actually getting past the ATS?</h1>
          <p>
            Paste a job description, upload your resume, and get an instant match
            score with the exact keywords and formatting fixes to close the gap —
            free, no sign-up, and nothing leaves your browser.
          </p>
        </div>
      )}

      <div className="card">
        <div className="input-grid">
          <FileUpload file={file} onFileSelected={setFile} />
          <JobDescriptionInput value={jobDescription} onChange={setJobDescription} />
        </div>

        {error && <div className="error-banner">{error}</div>}

        <div className="actions-row">
          {result ? (
            <button type="button" className="btn-secondary" onClick={handleReset}>
              Check another resume
            </button>
          ) : (
            <button
              type="button"
              className="btn-primary"
              disabled={!canAnalyze}
              onClick={handleAnalyze}
            >
              {isAnalyzing && <span className="spinner" />}
              {isAnalyzing ? "Analyzing..." : "Check my ATS score"}
            </button>
          )}
        </div>
        <p className="privacy-note">
          Your resume is parsed entirely in your browser — it's never uploaded to a server.
        </p>
      </div>

      {result && <ResultsPanel result={result} />}

      <footer className="site-footer">
        Built to help job seekers see their resume the way an ATS does.
      </footer>
    </div>
  );
}

export default App;
