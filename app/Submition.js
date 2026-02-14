"use client";

const languageMap = {
  JavaScript: { ext: "js", key: "javascript" },
  Python: { ext: "py", key: "python3" },
  C: { ext: "c", key: "c" },
   "C++": { ext: "cpp", key: "cpp" },
  Java: { ext: "java", key: "java" },
};

const DOMjudgeAPI = {
  submitCode: async (code, language, problemId, contestId) => {
    try {
      const { ext, key } = languageMap[language] || {
        ext: "txt",
        key: "plain",
      };

      const blob = new Blob([code], { type: "text/plain" });
      const file = new File([blob], `solution.${ext}`, { type: "text/plain" });

      const formData = new FormData();
      formData.append("code[]", file, `solution.${ext}`);
      formData.append("language", key);
      formData.append("problem", problemId);
      formData.append("mainfile", `solution.${ext}`);

      const username = "pooja";
      const password = "pooja@justuju.in";
      const token = btoa(`${username}:${password}`);

      const response = await fetch(`/api/proxy/contests/${contestId}/submissions`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Basic ${token}`,
        },
        body: formData,
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json(); 
      return {
        success: true,
        data: result,
        message: `Submission successful! ID: ${result.id}`,
      };
    } catch (error) {
      return { success: false, message: `Error: ${error.message}` };
    }
  },

  getResult: async (submissionId) => {
    try {
      const username = "pooja";
      const password = "pooja@justuju.in";
      const token = btoa(`${username}:${password}`);

      const response = await fetch(
        // `/api/proxy/judgements?submission_id=${submissionId}?strict=false`,
        `/api/proxy/judgements?submission_id=${submissionId}&strict=false`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Basic ${token}`,
          },
        }
      );

      //const res = await fetch(`/api/proxy/judgements?submission_id=${submissionId}`);
      const data = await response.json();

      const verdict =
        Array.isArray(data) && data.length
          ? data[0]?.judgement_type_id || "PENDING"
          : "PENDING";

      return { success: true, data, message: verdict };
    } catch (error) {
      return { success: false, message: `Error: ${error.message}` };
    }
  },
};

export default DOMjudgeAPI;

