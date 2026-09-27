import * as pdfjsLib from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import mammoth from "mammoth";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

export interface ParsedResume {
  text: string;
  fileType: "pdf" | "docx" | "doc" | "txt" | "unknown";
  fileName: string;
  /** Number of distinct "columns" heuristically detected on the first page (PDF only). */
  warnings: string[];
}

function getExtension(fileName: string): string {
  const parts = fileName.toLowerCase().split(".");
  return parts.length > 1 ? parts[parts.length - 1] : "";
}

async function extractFromPdf(file: File): Promise<{ text: string; warnings: string[] }> {
  const warnings: string[] = [];
  const buffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: buffer });
  const pdf = await loadingTask.promise;

  let fullText = "";
  let sawMultiColumnHint = false;

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();

    // Heuristic: cluster text items by x-position to detect possible multi-column
    // layouts, which many ATS parsers read out of order.
    if (pageNum === 1 && content.items.length > 0) {
      const xPositions = content.items
        .map((item) => ("transform" in item ? (item as { transform: number[] }).transform[4] : null))
        .filter((x): x is number => x !== null);
      const leftCluster = xPositions.filter((x) => x < 250).length;
      const rightCluster = xPositions.filter((x) => x > 320).length;
      if (leftCluster > 15 && rightCluster > 15) {
        sawMultiColumnHint = true;
      }
    }

    // Reconstruct line breaks from vertical position. pdf.js text items are
    // just positioned glyph runs with no inherent newlines, so naively
    // joining them with spaces collapses an entire page into one line —
    // which then breaks every line-based heuristic (bullets, quantified
    // achievements) downstream. Grouping by y-position approximates the
    // visual line structure instead.
    let pageText = "";
    let lastY: number | null = null;
    for (const item of content.items) {
      if (!("str" in item)) continue;
      const str = (item as { str: string }).str;
      const y = "transform" in item ? (item as { transform: number[] }).transform[5] : null;

      if (lastY !== null && y !== null && Math.abs(y - lastY) > 2) {
        pageText += "\n";
      } else if (pageText.length > 0 && !pageText.endsWith("\n")) {
        pageText += " ";
      }
      pageText += str;
      if (y !== null) lastY = y;
    }
    fullText += pageText + "\n";
  }

  if (sawMultiColumnHint) {
    warnings.push(
      "This resume may use a multi-column layout. Many ATS parsers read columns out of order, which can scramble your work history — a single-column layout is safer."
    );
  }

  if (pdf.numPages > 2) {
    warnings.push(
      `This resume is ${pdf.numPages} pages long. Most ATS-friendly resumes are kept to 1-2 pages.`
    );
  }

  return { text: fullText, warnings };
}

async function extractFromDocx(file: File): Promise<{ text: string; warnings: string[] }> {
  const buffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer: buffer });
  const warnings: string[] = [];
  if (result.messages.length > 0) {
    const hasImages = result.messages.some((m) => m.message.toLowerCase().includes("image"));
    if (hasImages) {
      warnings.push(
        "Your resume contains images. Text inside images (like a logo with your name, or an icon-based skills chart) is invisible to most ATS software."
      );
    }
  }
  return { text: result.value, warnings };
}

export async function parseResumeFile(file: File): Promise<ParsedResume> {
  const ext = getExtension(file.name);

  if (ext === "pdf") {
    const { text, warnings } = await extractFromPdf(file);
    return { text, fileType: "pdf", fileName: file.name, warnings };
  }

  if (ext === "docx") {
    const { text, warnings } = await extractFromDocx(file);
    return { text, fileType: "docx", fileName: file.name, warnings };
  }

  if (ext === "doc") {
    return {
      text: "",
      fileType: "doc",
      fileName: file.name,
      warnings: [
        "Legacy .doc files can't be parsed in-browser. Please save your resume as .docx or .pdf and re-upload.",
      ],
    };
  }

  if (ext === "txt") {
    const text = await file.text();
    return { text, fileType: "txt", fileName: file.name, warnings: [] };
  }

  return {
    text: "",
    fileType: "unknown",
    fileName: file.name,
    warnings: ["Unsupported file type. Please upload a PDF or DOCX resume."],
  };
}
