// app/api/domjudge/judgements/[submissionId]/route.js

console.log("ROuteing");
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req, { params }) {
  const { submissionId } = params || {};
  if (!submissionId) {
    return new Response(JSON.stringify({ error: "submissionId required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const base = process.env.DOMJUDGE_BASE;
  const user = process.env.DOMJUDGE_USER;
  const pass = process.env.DOMJUDGE_PASS;

  if (!base || !user || !pass) {
    return new Response(
      JSON.stringify({
        error: "Missing env vars: DOMJUDGE_BASE, DOMJUDGE_USER, DOMJUDGE_PASS",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const auth = Buffer.from(`${user}:${pass}`).toString("base64");
  const url = `${base}/judgements?submission_id=${encodeURIComponent(
    submissionId
  )}&strict=false`;

  try {
    const upstream = await fetch(url, {
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const text = await upstream.text();

    if (!upstream.ok) {
      // Return helpful error info to you
      return new Response(
        JSON.stringify({
          error: "Upstream error",
          status: upstream.status,
          url,
          body: tryJson(text),
        }),
        {
          status: upstream.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    console.log("Pendinggggggg");
    return new Response(text, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

function tryJson(t) {
  try {
    return JSON.parse(t);
  } catch {
    return t;
  }
}

console.log("End ");
