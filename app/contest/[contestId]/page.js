"use client";
import React, { useEffect, useState } from "react";

export default function SubmissionsList({ contestId, myTeamId }) {
  const [submissions, setSubmissions] = useState([]);
  const [judgements, setJudgements] = useState([]);

  // 🔑 Login
  const username = "pooja";
  const password = "pooja@justuju.in";
  const token = btoa(`${username}:${password}`);

  // 🟢 Fetch submissions
  useEffect(() => {
    let url = `/api/proxy/contests/${contestId}/submissions`;

    fetch(url, { headers: { Authorization: `Basic ${token}` } })
      .then((res) => res.json())
      .then((data) => setSubmissions(data))
      .catch((err) => console.error("Error fetching submissions:", err));
  }, [contestId]);

  // 🟠 Fetch judgements
  useEffect(() => {
    fetch(`/api/proxy/contests/${contestId}/judgements`, {
      headers: { Authorization: `Basic ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setJudgements(data))
      .catch((err) => console.error("Error fetching judgements:", err));
  }, [contestId]);

  // 🎨 Status labels with colors
  const verdictLabels = {
    AC: <span className="text-green-600 font-bold">✔️ Accepted</span>,
    WA: <span className="text-red-600 font-bold">❌ Wrong Answer</span>,
    TLE: <span className="text-yellow-600 font-bold">⏱️ Time Limit Exceeded</span>,
    RTE: <span className="text-purple-600 font-bold">⚠️ Runtime Error</span>,
    CE: <span className="text-gray-600 font-bold">📝 Compilation Error</span>,
    Pending: <span className="text-blue-600 italic">⌛ Pending</span>,
  };

  // 🔗 Merge submissions + judgements
  const submissionsWithStatus = submissions.map((s) => {
    const judgement = judgements.find(
      (j) => j.submission_id === s.id && j.valid
    );
    const code = judgement ? judgement.judgement_type_id : "Pending";

    return {
      ...s,
      statusLabel: verdictLabels[code] || code,
    };
  });

  // 🔍 Separate my vs others
  const mySubmissions = submissionsWithStatus.filter(
    (s) => String(s.team_id) === String(myTeamId) // example myTeamId=40
  );
  const otherSubmissions = submissionsWithStatus.filter(
    (s) => String(s.team_id) !== String(myTeamId)
  );

  return (
    <div className="space-y-8">
      {/* 🟢 My Submissions */}
      <div>
        <h2 className="text-xl font-bold mb-2">📌 My Submissions (Team {myTeamId})</h2>
        {mySubmissions.length === 0 ? (
          <p className="text-gray-500 italic">No submissions yet for your team.</p>
        ) : (
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
                  <td className="p-2 border">{s.language}</td>
                  <td className="p-2 border">{s.statusLabel}</td>
                  <td className="p-2 border">{s.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 🌍 Other Submissions */}
      <div>
        <h2 className="text-xl font-bold mb-2">🌍 Other Submissions</h2>
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
                <td className="p-2 border">{s.language}</td>
                <td className="p-2 border">{s.statusLabel}</td>
                <td className="p-2 border">{s.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
