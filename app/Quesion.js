"use client";

import React, { useEffect, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.entry";

const PdfTextExtractor = () => {
  const [text, setText] = useState("Loading text from PDF...");

  useEffect(() => {
    const fetchPdfText = async () => {
      const pdfUrl =
        "https://test1.indiaicpc.in/api/v4/contests/1/problems/36/statement?strict=false";

      try {
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;

        let fullText = "";

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const content = await page.getTextContent();

          const strings = content.items.map((item) => item.str);
          fullText += strings.join(" ") + "\n\n";
        }

        setText(fullText);
      } catch (error) {
        console.error("Error reading PDF:", error);
        setText("Failed to extract text.");
      }
    };
    fetchPdfText();
  }, []);

  return (
    <div style={{ whiteSpace: "pre-wrap", padding: "1rem" }}>
      <h2>PDF Text Content</h2>
      <p>{text}</p>
    </div>
  );
};

export default PdfTextExtractor;
