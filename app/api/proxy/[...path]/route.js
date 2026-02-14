// // app/api/proxy/[...path]/route.js

// export async function GET(_, { params }) {
//   console.log('GET HIT:', params.path);
//   return new Response(`Hit path: ${params.path?.join('/')}`, { status: 200 });
// }

// export async function POST(req, { params }) {
//   const path = params?.path;

//   if (!path || !Array.isArray(path)) {
//     return new Response("Missing or invalid path.", { status: 400 });
//   }

//   const dynamicPath = path.join('/');
//   const targetUrl = `https://judge.csbasics.in//api/v4/${dynamicPath}`;

//   const headers = {};
//   req.headers.forEach((value, key) => {
//     headers[key] = value;
//   });

//   const response = await fetch(targetUrl, {
//     method: "POST",
//     headers,
//     body: req.body,
//     duplex: 'half'
//   });

//   const responseHeaders = new Headers(response.headers);
//   return new Response(response.body, {
//     status: response.status,
//     headers: responseHeaders,
//   });

// }

// File: app/api/proxy/[...path]/route.js





export async function GET(req, { params }) {
  const path = params?.path;

  console.log(`Path is: ${path} : ${req} `);
  if (!path || !Array.isArray(path)) {
    return new Response("Missing or invalid path.", { status: 400 });
  }


  const search = new URL(req.url).search;
  const dynamicPath = path.join("/");
  
  const targetUrl = `https://judge.csbasics.in/api/v4/${dynamicPath}${search}`;
  console.log("target", targetUrl);

  const headers = {};
  req.headers.forEach((value, key) => {
    headers[key] = value;
  });

  const response = await fetch(targetUrl, {
    method: "GET",
    headers,
    body: req.body,
    duplex: "half",
  });

  const data = await response.json();
  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}



export async function POST(req, { params }) {
  const path = params?.path;

  console.log(`Path is: ${path}`);
  if (!path || !Array.isArray(path)) {
    return new Response("Missing or invalid path.", { status: 400 });
  }

  const dynamicPath = path.join("/");
  const targetUrl = `https://judge.csbasics.in/api/v4/${dynamicPath}`;
  console.log("target", targetUrl);

  const headers = {};
  req.headers.forEach((value, key) => {
    headers[key] = value;
  });

  const response = await fetch(targetUrl, {
    method: "POST",
    headers,
    body: req.body,
    duplex: "half",
  });

  const responseHeaders = new Headers(response.headers);
  return new Response(response.body, {
    status: response.status,
    headers: responseHeaders,
  });
}
