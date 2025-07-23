const DOMjudgeAPI = {
  submitCode: async (code, language) => {
    try {
      // Create file from code
      const blob = new Blob([code], { type: "text/plain" });
      const file = new File([blob], "solution.py", { type: "text/plain" });

      // Prepare form data
      const formData = new FormData();
      //formData.append("code", file);
      formData.append("language", language);
      formData.append("problem", "36");

      const username = "pooja";
      const password = "Pooja@12345";
      const token = btoa(`${username}:${password}`);

      // API call
      const response = await fetch(
        "/api/proxy/contests/1/submissions",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Basic ${token}`,
          },
          body: formData,
        }
      );

      // Check if response is ok
      if (!response.ok) {
        console.log("Some error");
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
        message: `Submission successful! ID: ${result.id}`,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error: ${error.message}`,
      };
    }
  }

  // Get result function
  // getResult: async (submissionId) => {
  //   try {
  //     const response = await fetch(`https://judge.csbasics.in/api/v4/contests/1/submissions/${submissionId}`, {
  //       method: "GET",
  //       headers: {
  //         "Accept": "application/json",
  //         "Authorization": "Basic cG9vamE6cG9vamFAanVzdHVqdS5pbg=="
  //       }
  //     });

  //     // Check if response is ok
  //     if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //         console.log("fetch datasss")
  //     }

  //     const result = await response.json();
  //     return {
  //       success: true,
  //       data: result,
  //       message: result.result ? `Result: ${result.result}` : "Still processing..."
  //     };

  //   } catch (error) {
  //     return {
  //       success: false,
  //       message: `Error: ${error.message}`
  //     };
  //   }
  // }
};

export default DOMjudgeAPI;










// const DOMjudgeAPI = {
//   submitCode: async (code, language) => {
//     try {
//       // Create a file blob from code
//       const blob = new Blob([code], { type: "text/plain" });
//       const file = new File([blob], "solution.py", { type: "text/plain" });

//       // 🔸 Prepare form data
//       const formData = new FormData();
//       formData.append("code", file);
//       formData.append("language", language);
//       formData.append("problem", "39"); 

//       // Prepare form data
//       const username = "pooja";
//       const password = "Pooja@12345";
//       const token = btoa(`${username}:${password}`);

  
//       const response = await fetch(
//         "api/v4/contests/1/submissions",

//         {
//           method: "POST",
//           headers: {
//             Authorization: `Basic ${token}`,
//             Accept: "application/json",
//           },
//           body: formData,
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();
//       return {
//         success: true,
//         data: result,
//         message: `Submission successful! ID: ${result.id}`,
//       };
//     } catch (error) {
//       return {
//         success: false,
//         message: `Error: ${error.message}`,
//       };
//     }
//   },
// };

// export default DOMjudgeAPI;

