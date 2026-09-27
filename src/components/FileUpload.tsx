import { useRef, useState, type KeyboardEvent } from "react";

interface FileUploadProps {
  file: File | null;
  onFileSelected: (file: File | null) => void;
}

export function FileUpload({ file, onFileSelected }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Unsupported types are passed through; parsing surfaces a friendly error.
  const handleFiles = (files: FileList | null) => {
    if (files && files.length > 0) onFileSelected(files[0]);
  };

  const openPicker = () => inputRef.current?.click();

  // role="button" divs don't get native keyboard activation.
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openPicker();
    }
  };

  return (
    <div>
      <span className="field-label" id="resume-label">
        Your resume
      </span>
      {file ? (
        // Not a role="button" wrapper: that would hide the nested buttons
        // from screen readers.
        <div className="dropzone" aria-labelledby="resume-label" role="group">
          <div className="dropzone-icon" aria-hidden="true">📄</div>
          <div className="file-chip">
            {file.name}
            <button
              type="button"
              aria-label={`Remove ${file.name}`}
              onClick={() => {
                onFileSelected(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
            >
              <span aria-hidden="true">✕</span>
            </button>
          </div>
          <button type="button" className="link-button" onClick={openPicker}>
            Choose a different file
          </button>
        </div>
      ) : (
        <div
          className={`dropzone ${isDragging ? "dragging" : ""}`}
          onClick={openPicker}
          onKeyDown={onKeyDown}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
          role="button"
          tabIndex={0}
          aria-labelledby="resume-label"
          aria-describedby="resume-upload-hint"
        >
          <div className="dropzone-icon" aria-hidden="true">⬆️</div>
          <div className="dropzone-title">Drop your resume here or click to upload</div>
          <div className="dropzone-subtitle" id="resume-upload-hint">
            PDF or DOCX · nothing is uploaded to a server
          </div>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx"
        hidden
        tabIndex={-1}
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
