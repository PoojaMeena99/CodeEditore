"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function SubmissionsList({ contestId, myTeamId, problemId }) {
  const [submissions, setSubmissions] = useState([]);
  const [judgements, setJudgements] = useState([]);

  const username = "pooja";
  const password = "pooja@justuju.in";
  const token = btoa(`${username}:${password}`);

  myTeamId = 40;

  useEffect(() => {
    let url = `/api/proxy/contests/${contestId}/submissions`;
    if (problemId) {
      url += `?problem_id=${problemId}`; 
    }

    fetch(url, { headers: { Authorization: `Basic ${token}` } })
      .then((res) => res.json())
      .then((data) =>
        setSubmissions(Array.isArray(data) ? data : data.data || [])
      )
      .catch((err) => console.error("Error fetching submissions:", err));
  }, [contestId, problemId]);

  // Fetch judgements
  useEffect(() => {
    fetch(`/api/proxy/contests/${contestId}/judgements`, {
      headers: { Authorization: `Basic ${token}` },
    })
      .then((res) => res.json())
      .then((data) =>
        setJudgements(Array.isArray(data) ? data : data.data || [])
      )
      .catch((err) => console.error("Error fetching judgements:", err));
  }, [contestId]);

  // Verdict labels (with color JSX)
  const verdictLabels = {
    AC: <span className="text-green-600 font-bold">✔️ Accepted</span>,
    WA: <span className="text-red-600 font-bold">❌ Wrong Answer</span>,
    TLE: <span className="text-yellow-600 font-bold">⏱️ Time Limit</span>,
    RTE: <span className="text-purple-600 font-bold">⚠️ Runtime Error</span>,
    CE: <span className="text-gray-600 font-bold">📝 Compilation Error</span>,
    Pending: <span className="text-blue-600 italic">⌛ Pending</span>,
  };

  const submissionsWithStatus = submissions
    .filter((s) => !problemId || String(s.problem_id) === String(problemId)) 

    .map((s) => {
      const judgement = judgements.find(
        (j) => j.submission_id === s.id && j.valid
      );
      const code = judgement ? judgement.judgement_type_id : "Pending";
      return {
        ...s,
        statusLabel: verdictLabels[code] || code,
      };
    });

  const mySubmissions = submissionsWithStatus
  .filter((s) => String(s.team_id) === String(myTeamId))
  .sort((a, b) => new Date(b.time) - new Date(a.time))
  .slice(0, 4);

  const otherSubmissions = submissionsWithStatus
  .filter((s) => String(s.team_id) !== String(myTeamId))
  .sort((a, b) => new Date(b.time) - new Date(a.time))
  .slice(0, 4);


  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-2">
          📌 My Submissions (Problem {problemId})
        </h2>
        <table className="table-auto w-full border border-gray-300 shadow-md rounded-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Problem</th>
              <th className="p-2 border">Language</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Time</th>
            </tr>
          </thead>
          <tbody>
            {mySubmissions.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="p-2 border">{s.id}</td>
                <td className="p-2 border">{s.problem_id}</td>
                <td className="p-2 border">{s.language || s.language_id}</td>
                <td className="p-2 border">{s.statusLabel}</td>
                <td className="p-2 border">{s.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button>
          {" "}
          <Link
            href={`/contest/${contestId}/Mysubmissions?problemId=${problemId}&myTeamId=${myTeamId}`}
            className="text-blue-600 underline hover:text-blue-800"
          >
            Go to My Submissions
          </Link>
        </button>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2">
          🌍 Other Submissions (Problem {problemId})
        </h2>
        <table className="table-auto w-full border border-gray-300 shadow-md rounded-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Team</th>
              <th className="p-2 border">Problem</th>
              <th className="p-2 border">Language</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Time</th>
            </tr>
          </thead>
          <tbody>
            {otherSubmissions.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="p-2 border">{s.id}</td>
                <td className="p-2 border">{s.team_id}</td>
                <td className="p-2 border">{s.problem_id}</td>
                <td className="p-2 border">{s.language || s.language_id}</td>
                <td className="p-2 border">{s.statusLabel}</td>
                <td className="p-2 border">{s.time}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button>
          {" "}
          <Link
            href={`/contest/${contestId}/OtherSubmissionsPage?problemId=${problemId}&myTeamId=${myTeamId}`}
            className="text-blue-600 underline hover:text-blue-800"
          >
            Go to My Submissions
          </Link>
        </button>
      </div>
    </div>
  );
}
