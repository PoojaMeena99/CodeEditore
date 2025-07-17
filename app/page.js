"use client";

import React, { useState } from "react";
import CodeEditor from "./CodeEditorBox";
import LanguageDropdown from "./LanguageDropdown";
import RunButton from "./RunButton";
import SubmitButton from "./SubmitButton";
import InputBox from "./InputBox";
import OutputBox from "./OutputBox";
import PdfTextExtractor from "./Quesion";
import DOMjudgeAPI from "./xyz";

const Page = () => {
  const [selectedOption, setSelectedOption] = useState("JavaScript");
  const [code, setCode] = useState(getDefaultCode("JavaScript"));
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Change language
  const handleChange = (e) => {
    const newLang = e.target.value;
    setSelectedOption(newLang);
    setCode(getDefaultCode(newLang));
    setOutput("");
    setError("");
  };

  // Run code locally
  // const runCode = () => {
  //   if (selectedOption === "JavaScript") {
  //     try {
  //       const originalLog = console.log;
  //       let outputText = "";
  //       console.log = (...args) => {
  //         outputText += args.join(" ") + "\n";
  //       };

  //       new Function(code)();
  //       console.log = originalLog;
  //       setOutput(outputText);
  //       setError("");
  //     } catch (err) {
  //       setError(err.message);
  //       setOutput("");
  //     }
  //   } else {
  //     setError("Only JavaScript can run locally");
  //     setOutput("");
  //   }
  // };

  const submitCode = async () => {
    if (!code.trim()) {
      setError("Please write some code first!");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setOutput("Submitting...");

    try {
      const result = await DOMjudgeAPI.submitCode(code, selectedOption);

      if (result.success) {
        setOutput(result.message);

        setTimeout(async () => {
          const resultCheck = await DOMjudgeAPI.getResult(result.data.id);
          if (resultCheck.success) {
            setOutput((prev) => prev + "\n" + resultCheck.message);
          }
        }, 3000);
      } else {
        setError(result.message);
        setOutput("");
      }
    } catch (error) {
      setError(`Submission failed: ${error.message}`);
      setOutput("");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="main-app">
      <div className="row">
        <div className="question-box">
          <div className="action-row">
            <LanguageDropdown value={selectedOption} onChange={handleChange} />
            <div>
              {/* <RunButton onClick={runCode} /> */}
              <SubmitButton
                onClick={submitCode}
                disabled={isSubmitting}
                text={isSubmitting ? "Submitting..." : "Submit"}
              />
            </div>
          </div>

          <div className="question-box">
            <PdfTextExtractor />
          </div>
        </div>

        <div className="code-editor-box">
          <CodeEditor
            selectedLanguage={selectedOption}
            code={code}
            onCodeChange={setCode}
          />
          {/* <DOMjudgeAPI /> */}
          <div className="inputOutputBox">
            <InputBox
              content={
                output ||
                (error ? `Error: ${error}` : "Input will appear here...")
              }
            />
            <OutputBox
              content={
                output ||
                (error ? `Error: ${error}` : "Output will appear here...")
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const getDefaultCode = (language) => {
  switch (language) {
    case "Python":
      return '# Python code\nprint("Hello World")';
    case "HTML":
      return "<!DOCTYPE html>\n<html>\n<head>\n  <title>Page</title>\n</head>\n<body>\n  <!-- Your code here -->\n</body>\n</html>";
    default:
      return `// JavaScript code\nconsole.log("Hello World");\n\nfunction example() {\n  return "This is a function";\n}`;
  }
};

export default Page;













// This is my Old Code



// "use client";

// import React, { useState } from "react";
// import CodeEditor from "./CodeEditorBox";
// import LanguageDropdown from "./LanguageDropdown";
// import RunButton from "./RunButton";
// import SubmitButton from "./SubmitButton";
// import InputBox from "./InputBox";
// import OutputBox from "./OutputBox";
// import PdfTextExtractor from "./Quesion";

// const Page = () => {
//   const [selectedOption, setSelectedOption] = useState("JavaScript");
//   const [code, setCode] = useState(getDefaultCode("JavaScript"));
//   const [output, setOutput] = useState("");
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     const newLang = e.target.value;
//     setSelectedOption(newLang);
//     setCode(getDefaultCode(newLang));
//     setOutput("");
//     setError("");
//   };

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

//           <div className="question-box">
//             <PdfTextExtractor />
//           </div>
//         </div>

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
//       //{" "}
//     </div>
//   );
// };

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
