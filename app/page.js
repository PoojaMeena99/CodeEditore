"use client";
import React, { useEffect, useState } from "react";
import CodeEditor from "./CodeEditorBox";
import LanguageDropdown from "./LanguageDropdown";
import SubmitButton from "./SubmitButton";
import InputBox from "./InputBox";
import OutputBox from "./OutputBox";
import PdfTextExtractor from "./Quesion";
import DOMjudgeAPI from "./Submition";
import SubmissionsList from "./MySubmissionList";

const Page = () => {
  const [selectedOption, setSelectedOption] = useState("JavaScript");
  const [code, setCode] = useState(getDefaultCode("JavaScript"));
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [problems, setProblems] = useState([]);
  const [selectedProblemId, setSelectedProblemId] = useState(null);

  const [activeTab, setActiveTab] = useState("statement");

  const contestId = 1;
  const myTeamId = 40;

  useEffect(() => {
    fetch("https://judge.csbasics.in/api/v4/contests/1/problems?strict=false")
      .then((res) => res.json())
      .then((data) => {
        setProblems(
          Array.isArray(data) ? data : data.problems || data.objects || []
        );
      })
      .catch((err) => console.error("Error fetching problems:", err));
  }, []);

  console.log(problems, "problems");
  const handleChange = (e) => {
    const newLang = e.target.value;
    setSelectedOption(newLang);
    setCode(getDefaultCode(newLang));
    setOutput("");
    setError("");
  };

  const submitCode = async () => {
    if (!code.trim()) {
      setError("Please write some code first!");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setOutput("Submitting...");

    try {
      const result = await DOMjudgeAPI.submitCode(
        code,
        selectedOption,
        selectedProblemId,
        contestId
      );

      if (!result.success) {
        setError(result.message);
        setOutput("");
        return;
      }

      setOutput(
        `Submission successful! ID: ${result.data.id}\nWaiting for verdict...`
      );

      let verdict = "PENDING";
      for (let attempt = 1; attempt <= 100; attempt++) {
        const res = await DOMjudgeAPI.getResult(result.data.id);

        if (res.success) {
          verdict = (res.message || "PENDING").toUpperCase();
          if (verdict !== "PENDING") break;
          setOutput(
            `Submission successful! ID: ${result.data.id}\nStatus: PENDING (attempt ${attempt})`
          );
        } else {
          throw new Error(res.message);
        }

        await new Promise((r) => setTimeout(r, 2000));
      }

      setOutput(
        `Submission successful! ID: ${result.data.id}\nStatus: ${verdict}`
      );
    } catch (err) {
      setOutput(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedProblemId) {
    return (
      <div className="table-container">
        <div>
          <h1>Contest Problems</h1>
        </div>
        <table className="problems-table">
          <thead>
            <tr>
              <th>Problem ID</th>
              <th>Problem Name</th>
              <th>Label</th>
              <th>Time Limit</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem) => (
              <tr
                key={problem.id}
                onClick={() => setSelectedProblemId(problem.id)}
                className="clickable-row"
              >
                <td>{problem.id}</td>
                <td>{problem.name}</td>
                <td>{problem.label}</td>
                <td>{problem.time_limit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="main-app">
      <div className="top-row">
        <button onClick={() => setSelectedProblemId(null)}>← Back</button>
      </div>
      <div className="action-row">
        <button onClick={() => setActiveTab("statement")}>Statement</button>
        <button onClick={() => setActiveTab("my")}>My Submissions</button>
        <button onClick={() => setActiveTab("all")}>All Submissions</button>

        <LanguageDropdown value={selectedOption} onChange={handleChange} />
        <div>
          <SubmitButton
            onClick={submitCode}
            disabled={isSubmitting}
            text={isSubmitting ? "Submitting..." : "Submit"}
          />
        </div>
      </div>
      <div className="row">
        <div className="question-box">
          <div className="question-box">
            {activeTab === "statement" && (
              <PdfTextExtractor problemId={selectedProblemId} />
            )}

            {activeTab === "my" && (
              <SubmissionsList
                contestId={contestId}
                myTeamId={myTeamId}
                problemId={selectedProblemId}
              />
            )}
          </div>
        </div>

        <div className="code-editor-box">
          <CodeEditor
            selectedLanguage={selectedOption}
            code={code}
            onCodeChange={setCode}
          />
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
      return `# Problem: Read an integer and print it back
n = int(input().strip())
print(n)`;

    case "C":
      return `// Problem: Read an integer and print it back
#include <stdio.h>
int main() {
    int n;
    scanf("%d", &n);
    printf("%d\\n", n);
    return 0;
}`;

    case "C++":
      return `// Problem: Read an integer and print it back
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    cout << n << "\\n";
    return 0;
}`;

    case "Java":
      return `// Problem: Read an integer and print it back
import java.util.*;
public class solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(n);
    }

}`;

    case "JavaScript":
      return `
  const fs = require("fs");
const data = fs.readFileSync(0, "utf8").trim().split(/\s+/);
const n = parseInt(data[0], 10);
console.log(n);`;

    default:
      return "// Select a language from the dropdown";
  }
};

export default Page;
