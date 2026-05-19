const CLIENT_ID = process.env.CANVA_CLIENT_ID;
const REDIRECT_URI = process.env.CANVA_REDIRECT_URI || 'http://localhost:3000/api/canva/callback';

export async function GET() {
  if (!CLIENT_ID) {
    return Response.json({ error: 'CANVA_CLIENT_ID not configured' }, { status: 500 });
  }
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'design:content:read asset:read',
  });
  const url = `https://www.canva.com/api/oauth/authorize?${params}`;
  return Response.redirect(url, 302);
}
