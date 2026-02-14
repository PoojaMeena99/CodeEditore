"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function OtherSubmissionsPage({ params, searchParams }) {
  const { contestId } = params;         
  const { problemId, myTeamId } = searchParams;

  console.log("Contest ID:", contestId);
  console.log("Problem ID:", problemId);
  console.log("Team ID:", myTeamId);


  const [submissions, setSubmissions] = useState([]);
  const [judgements, setJudgements] = useState([]);
  const [selectedCode, setSelectedCode] = useState(null); 

  const username = "pooja";
  const password = "pooja@justuju.in";
  const token = btoa(`${username}:${password}`);


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


  useEffect(() => {
    fetch(`/api/proxy/contests/${contestId}/judgements`, {
      headers: { Authorization: `Basic ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setJudgements(Array.isArray(data) ? data : data.data || []);
      })
      .catch((err) => console.error("Error fetching judgements:", err));
  }, [contestId]);

  const verdictLabels = {
    AC: <span className="text-green-600 font-bold">✔️ Accepted</span>,
    WA: <span className="text-red-600 font-bold">❌ Wrong Answer</span>,
    TLE: (
      <span className="text-yellow-600 font-bold">⏱️ Time Limit Exceeded</span>
    ),
    RTE: <span className="text-purple-600 font-bold">⚠️ Runtime Error</span>,
    CE: <span className="text-gray-600 font-bold">📝 Compilation Error</span>,
    Pending: <span className="text-blue-600 italic">⌛ Pending</span>,
  };

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
const otherSubmissions = submissionsWithStatus.filter(
    (s) =>
    String(s.team_id) !== String(myTeamId) &&
    String(s.problem_id) === String(problemId)
  );

  const fetchSourceCode = async (submissionId) => {
    try {
      const res = await fetch(
        `/api/proxy/contests/${contestId}/submissions/${submissionId}/source-code?strict=false`,
        { headers: { Authorization: `Basic ${token}` } }
      );
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const decoded = atob(data[0].source);
        setSelectedCode({
          filename: data[0].filename,
          code: decoded,
        });
      }
    } catch (err) {
      console.error("Error fetching source code:", err);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold mb-2">Othet submission</h2>
      <table className="table-auto w-full border border-gray-300 shadow-md rounded-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Team</th>
            <th className="p-2 border">Problem</th>
            <th className="p-2 border">Language</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Time</th>
            <th className="p-2 border">Action</th>
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
              <td className="p-2 border">
                <button>
                 <td className="p-2 border">
                    <Link href={`/contest/${contestId}/submission/${s.id}`}>
                      See Code
                    </Link>
                  </td>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
