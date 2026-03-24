export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) return Response.json({ error: 'Missing file' }, { status: 400 });

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    const timestamp = Math.floor(Date.now() / 1000);
    const str = `timestamp=${timestamp}${apiSecret}`;
    const msgBuffer = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const signature = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0')).join('');

    const uploadForm = new FormData();
    uploadForm.append('file', file);
    uploadForm.append('api_key', apiKey);
    uploadForm.append('timestamp', timestamp);
    uploadForm.append('signature', signature);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
      { method: 'POST', body: uploadForm }
    );
    const data = await res.json();

    if (data.error) return Response.json({ error: data.error.message }, { status: 500 });

    return Response.json({
      url: data.secure_url,
      publicId: data.public_id,
      thumbnailUrl: `https://res.cloudinary.com/${cloudName}/video/upload/so_auto/${data.public_id}.jpg`,
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}