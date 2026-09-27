import { useEffect, useRef, useState } from "react";
import { FileUpload } from "./components/FileUpload";
import { JobDescriptionInput } from "./components/JobDescriptionInput";
import { ResultsPanel } from "./components/ResultsPanel";
import { track } from "./lib/analytics";
import { analyzeResume, type AnalysisResult } from "./lib/scoring";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);

  // "/?role=<slug>" (linked from the role keyword pages) prefills a sample JD.
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("role");
    if (!slug) return;
    import("./data/roles").then(({ ROLES }) => {
      const role = ROLES.find((r) => r.slug === slug);
      if (role) setJobDescription((current) => current || role.sampleJD);
    });
  }, []);

  // Move focus to the results so keyboard/screen-reader users land on them.
  useEffect(() => {
    if (result) resultsHeadingRef.current?.focus();
  }, [result]);

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
    track("scan-started");

    try {
      const { parseResumeFile } = await import("./lib/parseResume");
      const parsed = await parseResumeFile(file);

      if (!parsed.text || parsed.text.trim().length < 30) {
        setError(
          "We couldn't extract readable text from that file. Try re-saving your resume as a standard PDF or DOCX (avoid scanned images)."
        );
        track("scan-unreadable");
        setIsAnalyzing(false);
        return;
      }

      const analysis = analyzeResume(parsed.text, jobDescription, parsed.warnings);
      setResult(analysis);
      track(`scan-completed-${Math.floor(analysis.overallScore / 20) * 20}`);
    } catch (err) {
      console.error(err);
      setError(
        "Something went wrong while reading that file. Please try a different PDF or DOCX export of your resume."
      );
      track("scan-error");
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
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <a className="brand" href="/">
          <img className="brand-mark" src="/favicon.svg" alt="" width="30" height="30" />
          ATS Score Check
        </a>
      </header>

      <main id="main">
        <div className="hero">
          <h1 className={result ? "sr-only" : undefined}>
            Is your resume actually getting past the ATS?
          </h1>
          {!result && (
            <p>
              Paste a job description, upload your resume, and get an instant match
              score with the exact keywords and formatting fixes to close the gap —
              free, no sign-up, and nothing leaves your browser.
            </p>
          )}
        </div>

        <section className="card" aria-label="Check your resume">
          <div className="input-grid">
            <FileUpload file={file} onFileSelected={setFile} />
            <JobDescriptionInput value={jobDescription} onChange={setJobDescription} />
          </div>

          {error && (
            <div className="error-banner" role="alert">
              {error}
            </div>
          )}

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
                aria-describedby={canAnalyze ? undefined : "analyze-hint"}
                onClick={handleAnalyze}
              >
                {isAnalyzing && <span className="spinner" aria-hidden="true" />}
                {isAnalyzing ? "Analyzing..." : "Check my ATS score"}
              </button>
            )}
          </div>
          {!result && !canAnalyze && !isAnalyzing && (
            <p className="privacy-note" id="analyze-hint">
              Upload a resume and paste a job description to continue.
            </p>
          )}
          <p className="privacy-note">
            Your resume is parsed entirely in your browser — it's never uploaded to a server.
          </p>
          <p className="sr-only" role="status">
            {isAnalyzing ? "Analyzing your resume…" : ""}
          </p>
        </section>

        {result && <ResultsPanel result={result} headingRef={resultsHeadingRef} />}
      </main>

      <footer className="site-footer">
        <nav aria-label="Resources">
          <a href="/ats-resume-keywords/">Resume keywords by job role</a>
          <a href="/ats-resume-keywords/software-engineer/">Software engineer keywords</a>
          <a href="/ats-resume-keywords/data-analyst/">Data analyst keywords</a>
        </nav>
        Built to help job seekers see their resume the way an ATS does.
      </footer>
    </div>
  );
}

export default App;
