"use client";

import React, { useEffect, useState, use } from "react";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter/dist/cjs/prism";
// import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function SubmissionCodePage({ params }) {
 const { contestId, submissionId } = use(params);

  const [codeData, setCodeData] = useState(null);


  const username = "pooja";
  const password = "pooja@justuju.in";
  const token = btoa(`${username}:${password}`);

  useEffect(() => {
    const fetchCode = async () => {
      try {
        const res = await fetch(
          `/api/proxy/contests/${contestId}/submissions/${submissionId}/source-code?strict=false`,
          { headers: { Authorization: `Basic ${token}` } }
        );
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const decoded = atob(data[0].source);
          setCodeData({
            filename: data[0].filename,
            code: decoded,
          });
        }
      } catch (err) {
        console.error("Error fetching source code:", err);
      }
    };

    fetchCode();
  }, [contestId, submissionId]);

  if (!codeData) return <p className="p-4">Loading source code...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">📄 {codeData.filename}</h2>
      <SyntaxHighlighter language="cpp" style={vscDarkPlus} showLineNumbers>
        {codeData.code}
      </SyntaxHighlighter>
    </div>
  );
}
