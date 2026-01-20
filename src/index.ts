import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { RaffleSession } from './session';

export { RaffleSession };

interface Env {
  RAFFLE_SESSION: DurableObjectNamespace;
  HMAC_SECRET: string;
  ASSETS: Fetcher;
}

const app = new Hono<{ Bindings: Env }>();

// Enable CORS for API endpoints
app.use('/api/*', cors());

// Generate session ID (6-digit numeric code that also serves as PIN)
function generateSessionId(): string {
  const array = new Uint8Array(4);
  crypto.getRandomValues(array);
  // Generate number between 100000 and 999999
  const num = 100000 + (((array[0] << 24) | (array[1] << 16) | (array[2] << 8) | array[3]) >>> 0) % 900000;
  return num.toString();
}

// Get Durable Object stub for a session
function getSessionStub(env: Env, sessionId: string): DurableObjectStub {
  const id = env.RAFFLE_SESSION.idFromName(sessionId);
  return env.RAFFLE_SESSION.get(id);
}

// API: Create new session
app.post('/api/session', async (c) => {
  const body = await c.req.json() as {
    eventName: string;
    language?: string;
    theme?: string;
    passcode?: string;  // 4-digit passcode for authentication
    redrawReturnToPool?: boolean;
  };

  if (!body.eventName) {
    return c.json({ error: 'Missing required fields' }, 400);
  }

  // Session ID is a 6-digit code that also serves as the PIN
  const sessionId = generateSessionId();
  const stub = getSessionStub(c.env, sessionId);

  const response = await stub.fetch(new Request('http://do/create?sessionId=' + sessionId, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId,
      eventName: body.eventName,
      language: body.language || 'en',
      theme: body.theme || 'default',
      pin: sessionId,  // PIN is the session ID itself
      passcode: body.passcode || undefined,  // 4-digit passcode
      redrawReturnToPool: body.redrawReturnToPool ?? true
    })
  }));

  if (!response.ok) {
    const error = await response.json();
    return c.json(error, response.status as any);
  }

  return c.json({ sessionId });
});

// API: Get session status
app.get('/api/session/:sessionId', async (c) => {
  const sessionId = c.req.param('sessionId');
  const stub = getSessionStub(c.env, sessionId);

  const response = await stub.fetch(new Request('http://do/status?sessionId=' + sessionId));
  const data = await response.json();

  if (!response.ok) {
    return c.json(data, response.status as any);
  }

  return c.json(data);
});

// API: Get dashboard data
app.get('/api/session/:sessionId/dashboard', async (c) => {
  const sessionId = c.req.param('sessionId');
  const stub = getSessionStub(c.env, sessionId);

  const response = await stub.fetch(new Request('http://do/dashboard?sessionId=' + sessionId));
  const data = await response.json();

  if (!response.ok) {
    return c.json(data, response.status as any);
  }

  return c.json(data);
});

// API: Verify PIN
app.post('/api/session/:sessionId/verify-pin', async (c) => {
  const sessionId = c.req.param('sessionId');
  const body = await c.req.json() as { pin: string };
  const stub = getSessionStub(c.env, sessionId);

  const response = await stub.fetch(new Request('http://do/verify-pin?sessionId=' + sessionId, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }));

  const data = await response.json();
  return c.json(data, response.status as any);
});

// API: Verify passcode
app.post('/api/session/:sessionId/verify-passcode', async (c) => {
  const sessionId = c.req.param('sessionId');
  const body = await c.req.json() as { passcode: string };
  const stub = getSessionStub(c.env, sessionId);

  const response = await stub.fetch(new Request('http://do/verify-passcode?sessionId=' + sessionId, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }));

  const data = await response.json();
  return c.json(data, response.status as any);
});

// API: Create ticket batch
app.post('/api/session/:sessionId/batch', async (c) => {
  const sessionId = c.req.param('sessionId');
  const body = await c.req.json() as { ticketCount: number; label?: string; passcode?: string };
  const stub = getSessionStub(c.env, sessionId);

  const response = await stub.fetch(new Request('http://do/create-batch?sessionId=' + sessionId, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }));

  const data = await response.json();
  return c.json(data, response.status as any);
});

// API: Claim batch (participant scans QR)
app.post('/api/session/:sessionId/claim', async (c) => {
  const sessionId = c.req.param('sessionId');
  const body = await c.req.json() as { batchId: string; sig: string };
  const stub = getSessionStub(c.env, sessionId);

  const response = await stub.fetch(new Request('http://do/claim-batch?sessionId=' + sessionId, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }));

  const data = await response.json();
  return c.json(data, response.status as any);
});

// API: Lock registration
app.post('/api/session/:sessionId/lock', async (c) => {
  const sessionId = c.req.param('sessionId');
  const body = await c.req.json() as { passcode?: string };
  const stub = getSessionStub(c.env, sessionId);

  const response = await stub.fetch(new Request('http://do/lock?sessionId=' + sessionId, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }));

  const data = await response.json();
  return c.json(data, response.status as any);
});

// API: Reopen registration
app.post('/api/session/:sessionId/reopen', async (c) => {
  const sessionId = c.req.param('sessionId');
  const body = await c.req.json() as { passcode?: string };
  const stub = getSessionStub(c.env, sessionId);

  const response = await stub.fetch(new Request('http://do/reopen?sessionId=' + sessionId, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }));

  const data = await response.json();
  return c.json(data, response.status as any);
});

// API: Draw winner
app.post('/api/session/:sessionId/draw', async (c) => {
  const sessionId = c.req.param('sessionId');
  const body = await c.req.json() as { passcode?: string };
  const stub = getSessionStub(c.env, sessionId);

  const response = await stub.fetch(new Request('http://do/draw?sessionId=' + sessionId, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }));

  const data = await response.json();
  return c.json(data, response.status as any);
});

// API: Redraw
app.post('/api/session/:sessionId/redraw', async (c) => {
  const sessionId = c.req.param('sessionId');
  const body = await c.req.json() as { passcode?: string };
  const stub = getSessionStub(c.env, sessionId);

  const response = await stub.fetch(new Request('http://do/redraw?sessionId=' + sessionId, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }));

  const data = await response.json();
  return c.json(data, response.status as any);
});

// API: Confirm claim (host confirms winner received prize)
app.post('/api/session/:sessionId/confirm-claim', async (c) => {
  const sessionId = c.req.param('sessionId');
  const body = await c.req.json() as { passcode?: string };
  const stub = getSessionStub(c.env, sessionId);

  const response = await stub.fetch(new Request('http://do/confirm-claim?sessionId=' + sessionId, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }));

  const data = await response.json();
  return c.json(data, response.status as any);
});

// API: Close session
app.post('/api/session/:sessionId/close', async (c) => {
  const sessionId = c.req.param('sessionId');
  const body = await c.req.json() as { passcode?: string };
  const stub = getSessionStub(c.env, sessionId);

  const response = await stub.fetch(new Request('http://do/close?sessionId=' + sessionId, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }));

  const data = await response.json();
  return c.json(data, response.status as any);
});

// API: Verify ticket (for scanning)
app.post('/api/session/:sessionId/verify', async (c) => {
  const sessionId = c.req.param('sessionId');
  const body = await c.req.json() as {
    ticketId?: string;
    batchId: string;
    sig: string;
    sessionId: string;
  };
  const stub = getSessionStub(c.env, sessionId);

  const response = await stub.fetch(new Request('http://do/verify-ticket?sessionId=' + sessionId, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }));

  const data = await response.json();
  return c.json(data, response.status as any);
});

// API: Mark ticket as claimed
app.post('/api/session/:sessionId/mark-claimed', async (c) => {
  const sessionId = c.req.param('sessionId');
  const body = await c.req.json() as { ticketId: string; passcode?: string };
  const stub = getSessionStub(c.env, sessionId);

  const response = await stub.fetch(new Request('http://do/mark-claimed?sessionId=' + sessionId, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }));

  const data = await response.json();
  return c.json(data, response.status as any);
});

// Helper to serve static assets
async function serveAsset(request: Request, env: Env, pathname?: string): Promise<Response> {
  try {
    const url = new URL(request.url);
    if (pathname) {
      url.pathname = pathname;
    }
    return await env.ASSETS.fetch(new Request(url.toString(), request));
  } catch (e: any) {
    console.error('Asset error:', e?.message || e);
    return new Response('Not found', { status: 404 });
  }
}

// API: Apple Wallet pass (placeholder - requires certificates)
app.post('/api/session/:sessionId/wallet/apple', async (c) => {
  return c.json({
    error: 'Apple Wallet integration requires PassKit certificates. Add to home screen instead.'
  }, 501);
});

// API: Google Wallet pass (placeholder - requires service account)
app.post('/api/session/:sessionId/wallet/google', async (c) => {
  return c.json({
    error: 'Google Wallet integration requires API setup. Add to home screen instead.'
  }, 501);
});

// Session page routes - serve HTML files (with session ID in URL)
app.get('/s/:sessionId/handout', async (c) => {
  return serveAsset(c.req.raw, c.env, '/handout.html');
});

app.get('/s/:sessionId/draw', async (c) => {
  return serveAsset(c.req.raw, c.env, '/draw.html');
});

app.get('/s/:sessionId/scan', async (c) => {
  return serveAsset(c.req.raw, c.env, '/scan.html');
});

app.get('/s/:sessionId/ticket', async (c) => {
  return serveAsset(c.req.raw, c.env, '/ticket.html');
});

app.get('/s/:sessionId/dashboard', async (c) => {
  return serveAsset(c.req.raw, c.env, '/dashboard.html');
});

app.get('/s/:sessionId/control', async (c) => {
  return serveAsset(c.req.raw, c.env, '/control.html');
});

// Direct page routes (without session ID - will prompt for code)
app.get('/handout', async (c) => {
  return serveAsset(c.req.raw, c.env, '/handout.html');
});

app.get('/draw', async (c) => {
  return serveAsset(c.req.raw, c.env, '/draw.html');
});

app.get('/scan', async (c) => {
  return serveAsset(c.req.raw, c.env, '/scan.html');
});

app.get('/dashboard', async (c) => {
  return serveAsset(c.req.raw, c.env, '/dashboard.html');
});

app.get('/control', async (c) => {
  return serveAsset(c.req.raw, c.env, '/control.html');
});

// Serve static files for all other routes
app.get('*', async (c) => {
  return serveAsset(c.req.raw, c.env);
});

export default app;
