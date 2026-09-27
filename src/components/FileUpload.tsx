import { useCallback, useRef, useState } from "react";

interface FileUploadProps {
  file: File | null;
  onFileSelected: (file: File | null) => void;
}

const ACCEPTED_EXTENSIONS = [".pdf", ".docx"];

function isAcceptedFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext));
}

export function FileUpload({ file, onFileSelected }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const candidate = files[0];
      if (isAcceptedFile(candidate)) {
        onFileSelected(candidate);
      } else {
        onFileSelected(candidate); // let parent surface a friendly error via parsing
      }
    },
    [onFileSelected]
  );

  return (
    <div>
      <label className="field-label" htmlFor="resume-upload">
        Your resume
      </label>
      {file ? (
        <div
          className="dropzone"
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
        >
          <div className="dropzone-icon">📄</div>
          <div className="file-chip">
            {file.name}
            <button
              type="button"
              aria-label="Remove file"
              onClick={(e) => {
                e.stopPropagation();
                onFileSelected(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
            >
              ✕
            </button>
          </div>
          <div className="dropzone-subtitle">Click to choose a different file</div>
        </div>
      ) : (
        <div
          className={`dropzone ${isDragging ? "dragging" : ""}`}
          onClick={() => inputRef.current?.click()}
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
        >
          <div className="dropzone-icon">⬆️</div>
          <div className="dropzone-title">Drop your resume here or click to upload</div>
          <div className="dropzone-subtitle">PDF or DOCX · nothing is uploaded to a server</div>
        </div>
      )}
      <input
        ref={inputRef}
        id="resume-upload"
        type="file"
        accept=".pdf,.docx"
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
