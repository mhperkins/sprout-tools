export async function GET() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey    = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return Response.json({ error: "Cloudinary not configured" }, { status: 500 });
  }

  try {
    const credentials = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/video?max_results=100&resource_type=video`,
      { headers: { Authorization: `Basic ${credentials}` } }
    );
    const data = await res.json();
    return Response.json({ resources: data.resources || [] });
  } catch (err) {
    console.error("Cloudinary proxy error:", err);
    return Response.json({ error: "Cloudinary request failed" }, { status: 500 });
  }
}