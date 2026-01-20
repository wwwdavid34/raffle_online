import type { Language } from './i18n/translations';

export type SessionState = 'OPEN' | 'LOCKED' | 'DRAWING' | 'CLAIMING' | 'CLOSED';

export type Theme =
  | 'default' | 'ocean' | 'sunset' | 'forest' | 'purple' | 'gold' | 'rose' | 'light'
  // Occasion themes
  | 'chinese-new-year' | 'halloween' | 'christmas' | 'valentines' | 'spring' | 'summer';

export interface SessionData {
  sessionId: string;
  eventName: string;
  language: Language;
  theme: Theme;
  pinHash: string;
  state: SessionState;
  createdAt: number;
  lastActiveAt: number;
  currentWinner?: {
    ticketId: string;
    batchId: string;
    drawnAt: number;
    claimDeadline: number;
  };
}

export interface TicketBatch {
  batchId: string;
  ticketCount: number;
  label?: string;
  status: 'unclaimed' | 'claimed';
  createdAt: number;
  claimedAt?: number;
}

export interface Ticket {
  ticketId: string;
  batchId: string;
  index: number; // 1-based index within batch
  isWinner: boolean;
  claimedAt?: number;
}

interface SessionStorage {
  session?: SessionData;
  batches: Record<string, TicketBatch>;
  tickets: Record<string, Ticket>;
}

// HMAC signing utilities
async function createHmac(secret: string, data: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

async function verifyHmac(secret: string, data: string, signature: string): Promise<boolean> {
  const expected = await createHmac(secret, data);
  return expected === signature;
}

// Generate short random ID
function generateId(length: number = 4): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed ambiguous chars
  let result = '';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    result += chars[array[i] % chars.length];
  }
  return result;
}

// Hash PIN for storage
async function hashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(hash)));
}

export class RaffleSession implements DurableObject {
  private storage: DurableObjectStorage;
  private data: SessionStorage = { batches: {}, tickets: {} };
  private hmacSecret: string;
  private sessionId: string = '';

  constructor(state: DurableObjectState, env: { HMAC_SECRET: string }) {
    this.storage = state.storage;
    this.hmacSecret = env.HMAC_SECRET;

    state.blockConcurrencyWhile(async () => {
      const stored = await this.storage.get<SessionStorage>('data');
      if (stored) {
        this.data = stored;
      }
    });
  }

  private async save(): Promise<void> {
    await this.storage.put('data', this.data);
  }

  private updateActivity(): void {
    if (this.data.session) {
      this.data.session.lastActiveAt = Date.now();
    }
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // Parse session ID from path or header
      this.sessionId = url.searchParams.get('sessionId') || '';

      if (request.method === 'POST' && path === '/create') {
        return this.handleCreate(request);
      }

      if (request.method === 'GET' && path === '/status') {
        return this.handleGetStatus();
      }

      if (request.method === 'POST' && path === '/verify-pin') {
        return this.handleVerifyPin(request);
      }

      if (request.method === 'POST' && path === '/create-batch') {
        return this.handleCreateBatch(request);
      }

      if (request.method === 'POST' && path === '/claim-batch') {
        return this.handleClaimBatch(request);
      }

      if (request.method === 'POST' && path === '/lock') {
        return this.handleLock();
      }

      if (request.method === 'POST' && path === '/reopen') {
        return this.handleReopen();
      }

      if (request.method === 'POST' && path === '/draw') {
        return this.handleDraw();
      }

      if (request.method === 'POST' && path === '/redraw') {
        return this.handleRedraw();
      }

      if (request.method === 'POST' && path === '/confirm-claim') {
        return this.handleConfirmClaim();
      }

      if (request.method === 'POST' && path === '/close') {
        return this.handleClose();
      }

      if (request.method === 'POST' && path === '/verify-ticket') {
        return this.handleVerifyTicket(request);
      }

      if (request.method === 'POST' && path === '/mark-claimed') {
        return this.handleMarkClaimed(request);
      }

      return new Response('Not found', { status: 404 });
    } catch (error) {
      console.error('Session error:', error);
      return new Response(JSON.stringify({ error: 'Internal error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  private async handleCreate(request: Request): Promise<Response> {
    if (this.data.session) {
      return new Response(JSON.stringify({ error: 'Session already exists' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json() as {
      sessionId: string;
      eventName: string;
      language: Language;
      theme?: Theme;
      pin: string;
    };

    this.data.session = {
      sessionId: body.sessionId,
      eventName: body.eventName,
      language: body.language || 'en',
      theme: body.theme || 'default',
      pinHash: await hashPin(body.pin),
      state: 'OPEN',
      createdAt: Date.now(),
      lastActiveAt: Date.now()
    };

    await this.save();

    return new Response(JSON.stringify({ success: true, sessionId: body.sessionId }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  private handleGetStatus(): Response {
    if (!this.data.session) {
      return new Response(JSON.stringify({ error: 'Session not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    this.updateActivity();

    const ticketCount = Object.values(this.data.tickets).length;
    const availableTickets = Object.values(this.data.tickets).filter(t => !t.isWinner).length;
    const batchCount = Object.values(this.data.batches).length;
    const claimedBatches = Object.values(this.data.batches).filter(b => b.status === 'claimed').length;

    return new Response(JSON.stringify({
      sessionId: this.data.session.sessionId,
      eventName: this.data.session.eventName,
      language: this.data.session.language,
      theme: this.data.session.theme || 'default',
      state: this.data.session.state,
      ticketCount,
      availableTickets,
      batchCount,
      claimedBatches,
      currentWinner: this.data.session.currentWinner
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  private async handleVerifyPin(request: Request): Promise<Response> {
    if (!this.data.session) {
      return new Response(JSON.stringify({ error: 'Session not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { pin } = await request.json() as { pin: string };
    const pinHash = await hashPin(pin);

    if (pinHash !== this.data.session.pinHash) {
      return new Response(JSON.stringify({ valid: false }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ valid: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  private async handleCreateBatch(request: Request): Promise<Response> {
    if (!this.data.session) {
      return new Response(JSON.stringify({ error: 'Session not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (this.data.session.state !== 'OPEN') {
      return new Response(JSON.stringify({ error: 'Registration is closed' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { ticketCount, label } = await request.json() as {
      ticketCount: number;
      label?: string;
    };

    if (ticketCount < 1 || ticketCount > 20) {
      return new Response(JSON.stringify({ error: 'Invalid ticket count (1-20)' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const batchId = generateId(4);

    // Create batch
    const batch: TicketBatch = {
      batchId,
      ticketCount,
      label,
      status: 'unclaimed',
      createdAt: Date.now()
    };

    this.data.batches[batchId] = batch;

    // Create tickets
    for (let i = 1; i <= ticketCount; i++) {
      const ticketId = `${batchId}-${i.toString().padStart(2, '0')}`;
      this.data.tickets[ticketId] = {
        ticketId,
        batchId,
        index: i,
        isWinner: false
      };
    }

    this.updateActivity();
    await this.save();

    // Generate signed QR payload
    const payload = {
      s: this.data.session.sessionId,
      b: batchId,
      t: 'batch'
    };
    const payloadStr = JSON.stringify(payload);
    const sig = await createHmac(this.hmacSecret, payloadStr);

    return new Response(JSON.stringify({
      batchId,
      ticketCount,
      label,
      qrPayload: {
        ...payload,
        sig
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  private async handleClaimBatch(request: Request): Promise<Response> {
    if (!this.data.session) {
      return new Response(JSON.stringify({ error: 'Session not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { batchId, sig } = await request.json() as {
      batchId: string;
      sig: string;
    };

    const batch = this.data.batches[batchId];
    if (!batch) {
      return new Response(JSON.stringify({ error: 'Batch not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verify signature
    const payload = {
      s: this.data.session.sessionId,
      b: batchId,
      t: 'batch'
    };
    const isValid = await verifyHmac(this.hmacSecret, JSON.stringify(payload), sig);
    if (!isValid) {
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (batch.status === 'claimed') {
      return new Response(JSON.stringify({ error: 'Batch already claimed' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Mark batch as claimed
    batch.status = 'claimed';
    batch.claimedAt = Date.now();

    this.updateActivity();
    await this.save();

    // Return ticket IDs for the batch
    const ticketIds = Object.values(this.data.tickets)
      .filter(t => t.batchId === batchId)
      .map(t => t.ticketId);

    return new Response(JSON.stringify({
      success: true,
      batchId,
      ticketIds
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  private async handleLock(): Promise<Response> {
    if (!this.data.session) {
      return new Response(JSON.stringify({ error: 'Session not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (this.data.session.state !== 'OPEN') {
      return new Response(JSON.stringify({ error: 'Cannot lock session in current state' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    this.data.session.state = 'LOCKED';
    this.updateActivity();
    await this.save();

    return new Response(JSON.stringify({ success: true, state: 'LOCKED' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  private async handleReopen(): Promise<Response> {
    if (!this.data.session) {
      return new Response(JSON.stringify({ error: 'Session not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (this.data.session.state !== 'LOCKED') {
      return new Response(JSON.stringify({ error: 'Can only reopen a locked session' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    this.data.session.state = 'OPEN';
    this.updateActivity();
    await this.save();

    return new Response(JSON.stringify({ success: true, state: 'OPEN' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  private async handleDraw(): Promise<Response> {
    if (!this.data.session) {
      return new Response(JSON.stringify({ error: 'Session not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (this.data.session.state !== 'LOCKED') {
      return new Response(JSON.stringify({ error: 'Must lock registration before drawing' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get available tickets (from claimed batches, not yet won)
    const availableTickets = Object.values(this.data.tickets).filter(t => {
      const batch = this.data.batches[t.batchId];
      return batch && batch.status === 'claimed' && !t.isWinner;
    });

    if (availableTickets.length === 0) {
      return new Response(JSON.stringify({ error: 'No tickets available' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Random draw
    const randomIndex = Math.floor(Math.random() * availableTickets.length);
    const winner = availableTickets[randomIndex];

    winner.isWinner = true;
    this.data.session.state = 'DRAWING';

    // Set claim deadline (60 seconds)
    const now = Date.now();
    this.data.session.currentWinner = {
      ticketId: winner.ticketId,
      batchId: winner.batchId,
      drawnAt: now,
      claimDeadline: now + 60000
    };

    this.updateActivity();
    await this.save();

    const batch = this.data.batches[winner.batchId];

    return new Response(JSON.stringify({
      ticketId: winner.ticketId,
      batchId: winner.batchId,
      ticketIndex: winner.index,
      batchLabel: batch?.label,
      claimDeadline: this.data.session.currentWinner.claimDeadline
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  private async handleRedraw(): Promise<Response> {
    if (!this.data.session) {
      return new Response(JSON.stringify({ error: 'Session not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (this.data.session.state !== 'DRAWING' || !this.data.session.currentWinner) {
      return new Response(JSON.stringify({ error: 'No active draw to redraw' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Mark current winner as not winner (they didn't claim)
    const currentWinner = this.data.tickets[this.data.session.currentWinner.ticketId];
    if (currentWinner) {
      currentWinner.isWinner = false;
    }

    // Reset to locked state
    this.data.session.state = 'LOCKED';
    this.data.session.currentWinner = undefined;

    await this.save();

    // Trigger new draw
    return this.handleDraw();
  }

  private async handleConfirmClaim(): Promise<Response> {
    if (!this.data.session) {
      return new Response(JSON.stringify({ error: 'Session not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (this.data.session.state !== 'DRAWING' || !this.data.session.currentWinner) {
      return new Response(JSON.stringify({ error: 'No active winner to confirm' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const winner = this.data.tickets[this.data.session.currentWinner.ticketId];
    if (winner) {
      winner.claimedAt = Date.now();
    }

    // Go back to locked state for next draw
    this.data.session.state = 'LOCKED';
    this.data.session.currentWinner = undefined;

    this.updateActivity();
    await this.save();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  private async handleClose(): Promise<Response> {
    if (!this.data.session) {
      return new Response(JSON.stringify({ error: 'Session not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    this.data.session.state = 'CLOSED';
    this.data.session.currentWinner = undefined;

    this.updateActivity();
    await this.save();

    return new Response(JSON.stringify({ success: true, state: 'CLOSED' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  private async handleVerifyTicket(request: Request): Promise<Response> {
    if (!this.data.session) {
      return new Response(JSON.stringify({ error: 'Session not found', result: 'wrongEvent' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { ticketId, batchId, sig, sessionId } = await request.json() as {
      ticketId?: string;
      batchId: string;
      sig: string;
      sessionId: string;
    };

    // Verify session matches
    if (sessionId !== this.data.session.sessionId) {
      return new Response(JSON.stringify({ result: 'wrongEvent' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verify signature
    const payload = ticketId
      ? { s: sessionId, t: ticketId, type: 'ticket' }
      : { s: sessionId, b: batchId, t: 'batch' };

    const isValid = await verifyHmac(this.hmacSecret, JSON.stringify(payload), sig);
    if (!isValid) {
      return new Response(JSON.stringify({ result: 'invalid' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // If batch scan, find winning ticket in batch
    if (!ticketId) {
      const batchTickets = Object.values(this.data.tickets).filter(t => t.batchId === batchId);
      const winningTicket = batchTickets.find(t => t.isWinner);

      if (!winningTicket) {
        return new Response(JSON.stringify({ result: 'notWinner' }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (winningTicket.claimedAt) {
        return new Response(JSON.stringify({ result: 'alreadyClaimed' }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({
        result: 'valid',
        ticketId: winningTicket.ticketId,
        batchId: winningTicket.batchId
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Specific ticket scan
    const ticket = this.data.tickets[ticketId];
    if (!ticket) {
      return new Response(JSON.stringify({ result: 'invalid' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!ticket.isWinner) {
      return new Response(JSON.stringify({ result: 'notWinner' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (ticket.claimedAt) {
      return new Response(JSON.stringify({ result: 'alreadyClaimed' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      result: 'valid',
      ticketId: ticket.ticketId,
      batchId: ticket.batchId
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  private async handleMarkClaimed(request: Request): Promise<Response> {
    if (!this.data.session) {
      return new Response(JSON.stringify({ error: 'Session not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { ticketId } = await request.json() as { ticketId: string };

    const ticket = this.data.tickets[ticketId];
    if (!ticket) {
      return new Response(JSON.stringify({ error: 'Ticket not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!ticket.isWinner) {
      return new Response(JSON.stringify({ error: 'Not a winning ticket' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (ticket.claimedAt) {
      return new Response(JSON.stringify({ error: 'Already claimed' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    ticket.claimedAt = Date.now();

    this.updateActivity();
    await this.save();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
