// api/calendar.js
// Fetches Google Calendar events using the user's access token
// The access token is passed in the Authorization header from the frontend

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const authHeader = req.headers.authorization || '';
  const accessToken = authHeader.replace('Bearer ', '').trim();

  if (!accessToken) {
    return res.status(401).json({ error: 'No access token provided' });
  }

  try {
    const { timeMin, timeMax, calendarId = 'primary' } = req.body || req.query;

    const now = new Date();
    const start = timeMin || new Date(now.setHours(0, 0, 0, 0)).toISOString();
    const end = timeMax || new Date(now.setHours(23, 59, 59, 999)).toISOString();

    const url = new URL(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`);
    url.searchParams.set('timeMin', start);
    url.searchParams.set('timeMax', end);
    url.searchParams.set('singleEvents', 'true');
    url.searchParams.set('orderBy', 'startTime');
    url.searchParams.set('maxResults', '50');

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      const err = await response.json();
      return res.status(response.status).json({ error: err.error?.message || 'Calendar API error' });
    }

    const data = await response.json();
    return res.json({ events: data.items || [] });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
