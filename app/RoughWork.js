
//  This is PDF converting into text formate 


// 'use client';

// import React, { useEffect, useState } from 'react';
// import * as pdfjsLib from 'pdfjs-dist';
// import 'pdfjs-dist/build/pdf.worker.entry';

// const LanguageSelector = () => {
//   const [pdfText, setPdfText] = useState('Loading...');

//   useEffect(() => {
//     fetch('https://judge.csbasics.in/api/v4/contests/1/problems/1/statement?strict=false')
//       .then(response => response.blob())
//       .then(blob => {
//         const reader = new FileReader();
//         reader.onload = async () => {
//           const typedArray = new Uint8Array(reader.result);
//           const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;

//           let text = '';
//           for (let i = 1; i <= pdf.numPages; i++) {
//             const page = await pdf.getPage(i);
//             const content = await page.getTextContent();
//             const pageText = content.items.map(item => item.str).join(' ');
//             text += `Page ${i}:\n${pageText}\n\n`; // ✅ fixed template string
//           }

//           setPdfText(text);
//         };
//         reader.readAsArrayBuffer(blob);
//       })
//       .catch(error => {
//         console.error('Error extracting text:', error);
//         setPdfText('Failed to load PDF content.');
//       });
//   }, []);

//   return (
//     <div>
//       <h2>Problem Statement (Text)</h2>
//       <pre style={{ whiteSpace: 'pre-wrap' }}>{pdfText}</pre>
//     </div>
//   );
// };

// export default LanguageSelector;






// "use client";

// import React, { useEffect, useState } from "react";
// import * as pdfjsLib from "pdfjs-dist";
// import "pdfjs-dist/build/pdf.worker.entry";

// const SimplePdfTextViewer = () => {
//   const [pdfText, setPdfText] = useState("Loading...");

//   useEffect(() => {
//     const pdfUrl =
//       "https://judge.csbasics.in/api/v4/contests/1/problems/4/statement?strict=false";

//     fetch(pdfUrl)
//       .then((res) => res.arrayBuffer())
//       .then((buffer) => pdfjsLib.getDocument({ data: buffer }).promise)
//       .then((pdf) => {
//         let totalText = "";
//         let pagePromises = [];

//         // har page ka text ek array me promises me store kar lenge
//         for (let i = 1; i <= pdf.numPages; i++) {
//           pagePromises.push(
//             pdf.getPage(i).then((page) =>
//               page.getTextContent().then((content) =>
//                 content.items.map((item) => item.str).join(" ")
//               )
//             )
//           );
//         }

//         // sab pages ke text ek saath extract karenge
//         Promise.all(pagePromises).then((texts) => {
//           totalText = texts.map((t, idx) => `Page ${idx + 1}:\n${t}\n\n`).join("");
//           setPdfText(totalText);
//         });
//       })
//       .catch((err) => {
//         console.error("PDF error:", err);
//         setPdfText("Failed to load PDF.");
//       });
//   }, []);

//   return (
//     <div>
//       <h2>Problem Text:</h2>
//       <pre style={{ whiteSpace: "pre-wrap" }}>{pdfText}</pre>
//     </div>
//   );
// };

// export default SimplePdfTextViewer;


// This is Code editor working code


// import React, { useState, useEffect } from "react";
// import CodeEditor from "./CodeEditorBox";
// import LanguageDropdown from "./LanguageDropdown";
// import RunButton from "./RunButton";
// import SubmitButton from "./SubmitButton";
// import InputBox from "./InputBox";
// import OutputBox from "./OutputBox";
// import QuestionPanel from "./QuestionPanel";
// import PdfViewer from "./PdfViewer";

// const Page = () => {
//   const [selectedOption, setSelectedOption] = useState("JavaScript");
//   const [code, setCode] = useState(getDefaultCode("JavaScript"));
//   const [output, setOutput] = useState("");
//   const [error, setError] = useState("");
//   const [statementHtml, setStatementHtml] = useState("");
//   const [plainText, setPlainText] = useState(""); // 🔤 plain text from HTML

//   // 🔄 Fetch HTML and convert to plain text
//   useEffect(() => {
//     fetch(
//       "https://judge.csbasics.in/api/v4/contests/1/problems/1/statement?strict=false"
//     )
//       .then((res) => res.text())
//       .then((data) => {
//         setStatementHtml(data);

//         // Convert HTML to plain text
//         const tempElement = document.createElement("div");
//         tempElement.innerHTML = data;
//         const textOnly = tempElement.textContent || tempElement.innerText || "";
//         setPlainText(textOnly);
//       })
//       .catch((err) => console.error("Error fetching HTML:", err));
//   }, []);

//   // 🔘 Handle language change
//   const handleChange = (e) => {
//     const newLang = e.target.value;
//     setSelectedOption(newLang);
//     setCode(getDefaultCode(newLang));
//     setOutput("");
//     setError("");
//   };

//   // ▶️ Run code (JS only)
//   const runCode = () => {
//     try {
//       if (selectedOption === "JavaScript") {
//         const originalLog = console.log;
//         let outputText = "";
//         console.log = (...args) => {
//           outputText += args.join(" ") + "\n";
//         };

//         try {
//           new Function(code)();
//         } catch (err) {
//           outputText += `Error: ${err.message}`;
//         }

//         console.log = originalLog;
//         setOutput(outputText);
//         setError("");
//       } else {
//         setError("Currently only JavaScript execution is supported.");
//         setOutput("");
//       }
//     } catch (err) {
//       setError(err.message);
//       setOutput("");
//     }
//   };

//   // 📥 Download HTML file
//   const downloadHTML = () => {
//     const blob = new Blob([statementHtml], { type: "text/html" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "problem-statement.html";
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   // 📥 Download plain text file
//   const downloadText = () => {
//     const blob = new Blob([plainText], { type: "text/plain" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "problem-statement.txt";
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <div className="main-app">
//       <div className="row">
//         <div className="question-box">
//           <div className="action-row">
//             <LanguageDropdown value={selectedOption} onChange={handleChange} />
//             <div>
//               <RunButton onClick={runCode} />
//               <SubmitButton />
//             </div>
//           </div>

//           {/* <QuestionPanel question="Solve the coding challenge" /> */}
//           <div className="question-box">
//             <h2>Problem Statement (PDF View)</h2>
//             <PdfViewer />
//           </div>

//           {/* 🌐 Render HTML from API */}
//           <div
//             className="problem-statement"
//             dangerouslySetInnerHTML={{ __html: statementHtml }}
//             style={{
//               marginTop: "20px",
//               padding: "10px",
//               border: "1px solid #ccc",
//             }}
//           />

//           {/* 📎 Download Buttons */}
//           <div style={{ marginTop: "10px" }}>
//             <button onClick={downloadHTML}>Download Statement as HTML</button>
//             <button onClick={downloadText} style={{ marginLeft: "10px" }}>
//               Download Statement as Text
//             </button>
//           </div>

//           {/* 📝 Show plain text */}
//           <div
//             className="plain-text-output"
//             style={{
//               marginTop: "20px",
//               padding: "10px",
//               border: "1px dashed #888",
//               whiteSpace: "pre-wrap",
//               backgroundColor: "#f9f9f9",
//             }}
//           >
//             <h3>Converted Plain Text:</h3>
//             <p>{plainText}</p>
//           </div>
//         </div>

//         {/* 👨‍💻 Code editor section */}
//         <div className="code-editor-box">
//           <CodeEditor
//             selectedLanguage={selectedOption}
//             code={code}
//             onCodeChange={setCode}
//           />
//           <div className="inputOutputBox">
//             <InputBox
//               content={
//                 output ||
//                 (error ? `Error: ${error}` : "Input will appear here...")
//               }
//             />
//             <OutputBox
//               content={
//                 output ||
//                 (error ? `Error: ${error}` : "Output will appear here...")
//               }
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // 💡 Default starter code
// const getDefaultCode = (language) => {
//   switch (language) {
//     case "Python":
//       return '# Python code\nprint("Hello World")';
//     case "HTML":
//       return "<!DOCTYPE html>\n<html>\n<head>\n  <title>Page</title>\n</head>\n<body>\n  <!-- Your code here -->\n</body>\n</html>";
//     default:
//       return `// JavaScript code\nconsole.log("Hello World");\n\nfunction example() {\n  return "This is a function";\n}`;
//   }
// };

// export default Page;



// this is the editor code 





// "use client";

// import React, { useEffect, useRef } from "react";
// import { EditorView } from "@codemirror/view";
// import { EditorState } from "@codemirror/state";
// import { basicSetup } from "codemirror";
// import { javascript } from "@codemirror/lang-javascript";
// import { python } from "@codemirror/lang-python";
// import { cpp } from "@codemirror/lang-cpp";
// import { oneDark } from '@codemirror/theme-one-dark';

// import "./CodeEditorBox.css";

// const languageExtensions = {
//   JavaScript: javascript(),
//   Python: python(),
//   CPP: cpp(),
// };

// function CodeEditor({ selectedLanguage, code, onCodeChange }) {
//   const editorRef = useRef(null);
//   const viewRef = useRef(null);

//   useEffect(() => {
//     if (!editorRef.current) return;

//     const extension = languageExtensions[selectedLanguage] || javascript();

//     if (viewRef.current) {
//       viewRef.current.destroy();
//     }

//     const state = EditorState.create({
//       doc: code || "",
//       extensions: [
//         basicSetup,
//         extension,
//         oneDark,
//         EditorView.updateListener.of((update) => {
//           if (update.docChanged && onCodeChange) {
//             const doc = update.state.doc.toString();
//             onCodeChange(doc);
//           }
//         }),
//       ],
//     });

//     viewRef.current = new EditorView({
//       state,
//       parent: editorRef.current,
//     });

//     return () => {
//       if (viewRef.current) {
//         viewRef.current.destroy();
//         viewRef.current = null;
//       }
//     };
//   }, [selectedLanguage, onCodeChange]);

//   // Keep external code state synced into editor if code prop changes
//   useEffect(() => {
//     if (viewRef.current && code !== undefined) {
//       const currentCode = viewRef.current.state.doc.toString();
//       if (currentCode !== code) {
//         viewRef.current.dispatch({
//           changes: { from: 0, to: currentCode.length, insert: code },
//         });
//       }
//     }
//   }, [code]);

//   return (
//     <div
//       ref={editorRef}
//       className="editor"
//       style={{
//         border: "1px solid #ccc",
//         minHeight: "200px",
//         fontSize: "14px",
//         fontFamily: "Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace"
//       }}
//     />
//   );
// }

// export default CodeEditor;
