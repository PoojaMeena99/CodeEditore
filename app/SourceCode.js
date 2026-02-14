// "use client";

// import React, { useEffect, useState } from "react";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

// export default function MySubmissionsPage({ params, searchParams }) {
//   const { contestId } = params;
//   const { problemId, myTeamId } = searchParams;

//   const [submissions, setSubmissions] = useState([]);
//   const [judgements, setJudgements] = useState([]);
//   const [selectedCode, setSelectedCode] = useState(null);

//   const username = "pooja";
//   const password = "pooja@justuju.in";
//   const token = btoa(`${username}:${password}`);

 
//   useEffect(() => {
//     let url = `/api/proxy/contests/${contestId}/submissions`;
//     if (problemId) {
//       url += `?problem_id=${problemId}`;
//     }

//     fetch(url, { headers: { Authorization: `Basic ${token}` } })
//       .then((res) => res.json())
//       .then((data) =>
//         setSubmissions(Array.isArray(data) ? data : data.data || [])
//       )
//       .catch((err) => console.error("Error fetching submissions:", err));
//   }, [contestId, problemId]);

//   // 🔹 Fetch judgements
//   useEffect(() => {
//     fetch(`/api/proxy/contests/${contestId}/judgements`, {
//       headers: { Authorization: `Basic ${token}` },
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         setJudgements(Array.isArray(data) ? data : data.data || []);
//       })
//       .catch((err) => console.error("Error fetching judgements:", err));
//   }, [contestId]);

//   // 🔹 Verdict labels
//   const verdictLabels = {
//     AC: <span className="text-green-600 font-bold">✔️ Accepted</span>,
//     WA: <span className="text-red-600 font-bold">❌ Wrong Answer</span>,
//     TLE: (
//       <span className="text-yellow-600 font-bold">⏱️ Time Limit Exceeded</span>
//     ),
//     RTE: <span className="text-purple-600 font-bold">⚠️ Runtime Error</span>,
//     CE: <span className="text-gray-600 font-bold">📝 Compilation Error</span>,
//     Pending: <span className="text-blue-600 italic">⌛ Pending</span>,
//   };

//   // 🔹 Merge submissions + judgements
//   const submissionsWithStatus = submissions.map((s) => {
//     const judgement = judgements.find(
//       (j) => j.submission_id === s.id && j.valid
//     );
//     const code = judgement ? judgement.judgement_type_id : "Pending";
//     return {
//       ...s,
//       statusLabel: verdictLabels[code] || code,
//     };
//   });

//   const mySubmissions = submissionsWithStatus.filter(
//     (s) =>
//       String(s.team_id) === String(myTeamId) &&
//       String(s.problem_id) === String(problemId)
//   );

//   // 🔹 Fetch source code
//   const fetchSourceCode = async (submissionId) => {
//     try {
//       const res = await fetch(
//         `/api/proxy/contests/${contestId}/submissions/${submissionId}/source-code?strict=false`,
//         { headers: { Authorization: `Basic ${token}` } }
//       );
//       const data = await res.json();
//       if (Array.isArray(data) && data.length > 0) {
//         const decoded = atob(data[0].source);
//         setSelectedCode({
//           filename: data[0].filename,
//           code: decoded,
//         });
//       }
//     } catch (err) {
//       console.error("Error fetching source code:", err);
//     }
//   };

//   return (
//     <div className="space-y-8">
//       <h2 className="text-xl font-bold mb-2">📌 My Submissions</h2>
//       <table className="table-auto w-full border border-gray-300 shadow-md rounded-md">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="p-2 border">ID</th>
//             <th className="p-2 border">Team</th>
//             <th className="p-2 border">Problem</th>
//             <th className="p-2 border">Language</th>
//             <th className="p-2 border">Status</th>
//             <th className="p-2 border">Time</th>
//             <th className="p-2 border">Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {mySubmissions.map((s) => (
//             <tr key={s.id} className="hover:bg-gray-50">
//               <td className="p-2 border">{s.id}</td>
//               <td className="p-2 border">{s.team_id}</td>
//               <td className="p-2 border">{s.problem_id}</td>
//               <td className="p-2 border">{s.language || s.language_id}</td>
//               <td className="p-2 border">{s.statusLabel}</td>
//               <td className="p-2 border">{s.time}</td>
//               <td className="p-2 border">
//                 <button
//                   onClick={() => fetchSourceCode(s.id)}
//                   className="text-blue-600 underline hover:text-blue-800"
//                 >
//                   See Code
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {selectedCode && (
//         <div className="mt-6 p-4 border rounded bg-gray-100">
//           <h3 className="text-lg font-bold mb-2">📄 {selectedCode.filename}</h3>
//           <SyntaxHighlighter
//             language="cpp" // or "python", "java" depending on submission
//             style={vscDarkPlus}
//             showLineNumbers
//           >
//             {selectedCode.code}
//           </SyntaxHighlighter>
//         </div>
//       )}
//     </div>
//   );
// }









// // "use client";
// // import React, { useEffect, useState } from "react";
// // import CodeEditorBox from "../CodeEditorBox";

// // export default function CodeEditorPage({ searchParams }) {
// //   const { contestId, submissionId } = searchParams;
// //   const [code, setCode] = useState("");
// //   const [lang, setLang] = useState("python");

// //   const username = "pooja";
// //   const password = "pooja@justuju.in";
// //   const token = btoa(`${username}:${password}`);

// //   useEffect(() => {
// //     if (!contestId || !submissionId) return;

// //     fetch(
// //       `/api/proxy/contests/${contestId}/submissions/${submissionId}/source-code?strict=false`,
// //       { headers: { Authorization: `Basic ${token}` } }
// //     )
// //       .then((res) => res.json())
// //       .then((data) => {
// //         if (Array.isArray(data) && data.length > 0) {
// //           const decoded = atob(data[0].source); // decode base64
// //           setCode(decoded);
// //         }
// //       })
// //       .catch((err) => console.error("Error fetching source code:", err));
// //   }, [contestId, submissionId]);

// //   return (
// //     <div className="p-6">
// //       <h1 className="text-xl font-bold mb-4">
// //         📄 Submission {submissionId}
// //       </h1>
// //       <CodeEditorBox
// //         code={code}
// //         selectedLanguage={lang}
// //         onCodeChange={(newCode) => setCode(newCode)}
// //       />
// //     </div>
// //   );
// // }
