# Raffle Online — SPEC.md

A lightweight, event-first raffle service designed for live gatherings.  
Optimized for **Cloudflare Free Tier**, **no accounts**, **QR-based tickets**, and **host-controlled fairness**.

---

## 1. Goals & Non-Goals

### Goals

- Run a full raffle at a live event with **zero setup friction**
    
- Replace physical raffle tickets with **QR-based digital tickets**
    
- Support:
    
    - Adults with phones
        
    - Minors / families without phones
        
    - “Each headcount = one ticket”
        
- Provide clear, dispute-free **winner verification**
    
- Operate entirely on **Cloudflare Free Tier**
    

### Non-Goals

- Online marketing giveaways
    
- Ticket sales / payments
    
- User accounts or identity verification
    
- Long-term data retention
    
- Fraud-proofing against determined attackers
    

---

## 2. Core Concepts

### Session

A single raffle event.

- Identified by `session_id`
    
- Lifetime: typically 1–2 hours
    
- Ephemeral (auto-expire after inactivity)
    

### Ticket

The atomic unit of randomness.

- One ticket = one chance to win
    
- Tickets are created via **handout batches**
    
- Tickets are drawn and claimed individually
    

### Ticket Batch

A group of tickets handed out together.

- Created by receptionist
    
- Claimed by participant
    
- Single-use QR code
    

---

## 3. User Roles

|Role|Description|
|---|---|
|Host|Runs the raffle and draw|
|Receptionist|Hands out tickets|
|Participant|Holds tickets|
|Prize Desk|Verifies & claims prizes|

Roles are **implicit by endpoint**, not by accounts.

---

## 4. Public URLs / Endpoints

All endpoints are session-scoped.

```
/s/{session_id}/handout
/s/{session_id}/draw
/s/{session_id}/scan
```

---

## 5. Endpoint Specifications

---

### 5.1 `/s/{session_id}/handout`

**Audience:** Receptionist  
**Device:** Phone / Tablet  
**Auth:** Host token or PIN required

#### Purpose

- Create and distribute raffle tickets via QR codes
    

#### Core Actions

- Create ticket batch
    
- Specify ticket count
    
- Display single-use QR code
    
- Observe batch claim status
    

#### Batch Creation Input

```json
{
  "ticket_count": 4,
  "label": "Family of 4"
}
```

#### Batch State

- `unclaimed`
    
- `claimed`
    
- `expired`
    

#### Behavior

- Batch QR is **single-use**
    
- Once claimed, QR becomes invalid
    
- Batch cannot be edited after claim
    

---

### 5.2 `/s/{session_id}/draw`

**Audience:** Host + audience  
**Device:** Laptop / Projector  
**Auth:** Host token or PIN required

#### Purpose

- Run the raffle draw
    
- Display winners
    
- Control draw flow
    

#### Core Actions

- Show live ticket count
    
- Lock registration
    
- Draw winner
    
- Start claim countdown
    
- Redraw if needed
    
- Close session
    

#### Draw Rules

- Draw selects **one unclaimed ticket**
    
- Draw is **atomic**
    
- Only one active draw at a time
    

#### Session States

```
OPEN → LOCKED → DRAWING → CLAIMING → CLOSED
```

---

### 5.3 `/s/{session_id}/scan`

**Audience:** Host / Prize Desk  
**Device:** Phone  
**Auth:** Host token or PIN required

#### Purpose

- Verify winning tickets
    
- Lock prize claims
    

#### Flow

1. Host opens scan page
    
2. Camera scans ticket QR
    
3. Backend validates ticket
    
4. Result shown instantly
    

#### Scan Outcomes

- ✅ Valid winner
    
- ❌ Not a winning ticket
    
- ❌ Wrong event
    
- ❌ Already claimed
    
- ❌ Claim window expired
    

---

## 6. QR Code Payloads

### Ticket / Batch QR Payload (conceptual)

```json
{
  "session_id": "S123",
  "ticket_id": "A9F3-03",
  "type": "ticket",
  "sig": "HMAC_SIGNATURE"
}
```

### Requirements

- Payload must be **signed**
    
- Signature verified server-side
    
- No sensitive PII embedded
    

---

## 7. Data Model (Durable Object)

### Session State

```ts
Session {
  session_id: string
  state: "OPEN" | "LOCKED" | "DRAWING" | "CLAIMING" | "CLOSED"
  created_at: timestamp
  last_active_at: timestamp
}
```

### TicketBatch

```ts
TicketBatch {
  batch_id: string
  ticket_count: number
  label?: string
  status: "unclaimed" | "claimed"
  created_at: timestamp
  claimed_at?: timestamp
}
```

### Ticket

```ts
Ticket {
  ticket_id: string
  batch_id: string
  name?: string
  phone_last4?: string
  is_winner: boolean
  claimed_at?: timestamp
}
```

---

## 8. Backend Architecture

### Platform

- Cloudflare Workers
    
- Cloudflare Durable Objects
    
- Cloudflare Pages (frontend)
    

### Key Design Choice

> **One Durable Object per session**

This guarantees:

- Atomic draws
    
- No race conditions
    
- Simple locking
    
- Free-tier compatibility
    

---

## 9. Security Model (Lightweight)

### Required

- HTTPS (Cloudflare-managed)
    
- Host token or PIN
    
- Signed QR payloads
    
- Session-scoped validation
    

### Explicitly Not Included

- CAPTCHA
    
- User accounts
    
- Phone verification
    
- Rate limiting
    

Threat model assumes **physical presence**.

---

## 10. Session Lifecycle & Cleanup

- Session created on first access
    
- Active while receiving traffic
    
- Auto-expire after inactivity (e.g. 2–6 hours)
    
- All data deleted on expiration
    

No cron jobs required.

---

## 11. UX Principles

- One screen = one job
    
- Big text, high contrast
    
- Green/red validation states
    
- No scrolling during live use
    
- Works in noisy, low-light environments
    

---

## 12. MVP Checklist

### Must Have

- Session creation
    
- Handout batches
    
- Single-use QR
    
- Random draw
    
- Claim scanning
    
- Durable Object state
    

### Optional (Later)

- Apple / Google Wallet passes
    
- SMS notifications
    
- CSV export
    
- Multiple prizes per session
    

---

## 13. Guiding Principle

> **The system should adapt to the event,  
> not force the event to adapt to the system.**

If staff can explain it in one sentence, it’s correct.

---

## 14. Non-Tech-Savvy Participant Support (Photo-Only Flow)

### Design Requirement

The system **MUST support participants who never interact with the website** beyond visually receiving a QR code.

A participant should be able to:

- Take a **photo of the QR code** shown by the receptionist
    
- Keep the photo as their “ticket”
    
- Present that photo to the host
    
- Successfully claim a prize if selected
    

No scanning, no registration confirmation, no wallet, no typing required.

---

## 14.1 Receptionist QR Code Requirements

Every ticket batch QR **MUST visually display**:

- Event name
    
- Batch ID (large, human-readable)
    
- Ticket count
    
- QR code (machine-readable)
    

### Example Visual Layout

```
Spring Festival Raffle

Batch ID: A9F3
Tickets: 4

[ QR CODE ]
```

This ensures:

- Humans can visually identify the ticket
    
- A screenshot or photo is sufficient
    
- No dependency on live internet access
    

---

## 14.2 Ticket Claim Model (Critical)

The **QR code itself is the ticket stub**.

- QR payload contains:
    
    - `session_id`
        
    - `batch_id` or `ticket_id`
        
    - cryptographic signature
        
- No personal information required to claim
    

Once the QR is claimed:

- Tickets exist server-side
    
- The participant does NOT need proof of claim beyond the QR photo
    

---

## 14.3 Winner Announcement & Matching (Human-Friendly)

When a winner is drawn, the draw screen **MUST show**:

- Ticket ID or Batch ID (large text)
    
- Event name
    
- Optional label (e.g. “Family of 4”)
    

### Example

```
🎉 WINNER 🎉

Batch A9F3
Ticket 03
```

A participant can:

- Look at their photo
    
- Match the Batch ID / Ticket ID visually
    
- Step forward confidently
    

No device interaction required.

---

## 14.4 Prize Claim via Host Scan

### Claim Process

1. Winner shows **photo of QR code** to host
    
2. Host opens:
    
    ```
    /s/{session_id}/scan
    ```
    
3. Host scans the QR **from the photo**
    
4. Backend validates:
    
    - Correct session
        
    - Ticket is winner
        
    - Not already claimed
        
5. Prize is marked claimed
    

This flow works with:

- Phone photos
    
- Screenshots
    
- Printed copies
    
- Wallet passes
    

---

## 14.5 Explicitly Allowed Behaviors

The system **MUST allow**:

- Screenshots
    
- Photos taken by someone else
    
- Low-quality images (within reason)
    
- Offline photos shown later
    

These are **equivalent to paper tickets**.

---

## 14.6 Abuse Considerations (Accepted & Controlled)

|Scenario|Outcome|
|---|---|
|Photo shared with others|Only winning ticket matters|
|Screenshot reused|Claim locks prevent reuse|
|QR copied|Same as paper ticket copying|
|Lost photo|Same as lost paper ticket|

The system intentionally mirrors physical raffle risk.

---

## 14.7 UX Copy Guidelines (Important)

Use language that matches real-world behavior:

✅ “Take a photo of this QR code to keep your ticket.”  
❌ “Scan this QR code to register your entry.”

This avoids tech intimidation.

---

## 14.8 Guiding Principle (Reinforced)

> **If a participant can take a photo, they can participate.**

This rule overrides:

- Registration assumptions
    
- Device assumptions
    
- Technical literacy assumptions
    

---

## 15. Wallet Ticket Specification (Apple Wallet & Android Equivalent)

### Purpose

Wallet tickets act as a **digital ticket stub**, equivalent to a paper raffle ticket.

They are:

- Optional
    
- Passive
    
- Offline-capable
    
- Verifiable via QR scan
    

Wallet tickets **do not** control the raffle or determine winners.

---

## 15.1 Required Wallet Ticket Contents

Each wallet ticket **MUST contain exactly the following visible elements**:

### Visible (Human-readable)

- **Event Name**
    
- **Ticket ID** (or Batch ID + Ticket index)
    

### Machine-readable

- **QR Code**
    
    - Encodes signed ticket payload
        
    - Used for prize claim verification
        

No additional personal data is required or permitted.

---

## 15.2 Example Wallet Ticket Layout

```
Spring Festival Raffle

Ticket ID: A9F3-03

[ QR CODE ]
```

This layout ensures:

- A participant can visually match the winning ticket
    
- A host can verify by scanning
    
- A photo or screenshot is sufficient for claiming
    

---

## 15.3 QR Code Payload Requirements (Wallet)

The QR code embedded in the wallet ticket **MUST be identical in behavior** to all other ticket QR codes.

### Payload (conceptual)

```json
{
  "session_id": "S123",
  "ticket_id": "A9F3-03",
  "type": "ticket",
  "sig": "HMAC_SIGNATURE"
}
```

### Rules

- Payload is signed
    
- Signature validated server-side
    
- No PII included
    
- Payload remains valid until ticket is claimed or session expires
    

---

## 15.4 Claim Flow with Wallet Ticket

1. Participant presents wallet ticket (or screenshot/photo)
    
2. Host opens:
    
    ```
    /s/{session_id}/scan
    ```
    
3. Host scans QR code
    
4. Backend validates ticket
    
5. Prize is marked as claimed
    

This flow is **identical** to:

- Photo of receptionist QR
    
- Printed QR
    
- Screenshot
    
- Any other QR representation
    

---

## 15.5 Explicit Design Constraints

The system **MUST NOT**:

- Require Wallet installation to participate
    
- Require Wallet push updates
    
- Depend on Wallet notifications
    
- Embed live state in Wallet passes
    

Wallet tickets are intentionally **static**.

---

## 15.6 UX Copy Guidelines (Wallet)

Use simple, non-technical language:

✅ “This is your raffle ticket. Keep it until the draw.”  
✅ “You may take a screenshot of this ticket.”  
❌ “Scan to activate”  
❌ “Must be online to claim”

---

## 15.7 Consistency Rule (Critical)

> **Any QR code that represents a ticket must be claimable via `/scan`.**

This includes:

- Wallet tickets
    
- Receptionist batch QR
    
- Screenshots
    
- Photos
    
- Printed copies
    

There are no special cases.

---

## 15.8 Guiding Principle (Final)

> **Wallet tickets improve convenience — they never replace simplicity.**

A participant who only takes a photo must have the _same chance_ to win and claim.

---

## 16. Internationalization (i18n) Specification

**Supported Languages:**

* English (`en`)
* Traditional Chinese – Taiwan (`zh-TW`)
* Japanese (`ja`)

i18n is a **first-class system requirement**.

---

## 16.1 Design Principles

1. **No language negotiation at runtime**
2. **No dependency on browser locale**
3. **No machine translation**
4. **Event-wide language consistency**
5. **Large, simple, human-readable wording**

This system is used in **noisy, stressful, live environments**.
Ambiguity is unacceptable.

---

## 16.2 Language Selection Model (Critical)

### Session-Level Language

Each raffle **session has exactly one active language**.

* Language is selected by host **when session is created**
* All endpoints inherit this language
* Participants do NOT choose language individually

```ts
Session.language: "en" | "zh-TW" | "ja"
```

This prevents:

* Mixed-language screens
* Confusion during call-outs
* Staff coordination issues

---

## 16.3 Default Language Rules

| Scenario                | Language          |
| ----------------------- | ----------------- |
| Host explicitly selects | Selected language |
| Host does nothing       | English (`en`)    |
| Invalid or missing      | English (`en`)    |

English is the **hard fallback**.

---

## 16.4 Language Coverage Scope

The following MUST be fully localized:

### UI Text

* Buttons
* Status labels
* Instructions
* Error messages
* Countdown text

### Draw Screen Text

* “Winner”
* “Ticket”
* “Claim now”
* “Redrawing”
* “Registration closed”

### Scan Result Text

* Valid ticket
* Already claimed
* Wrong event
* Not a winner
* Claim expired

### Wallet Ticket Text

* Event name
* “Ticket ID”
* “Raffle Ticket”

### Printed / Screenshot-visible Text

* Batch ID
* Ticket ID labels

---

## 16.5 Explicitly NOT Localized

The following remain **language-neutral**:

* Ticket IDs
* Batch IDs
* QR codes
* URLs
* Session IDs

Identifiers are **never translated**.

---

## 16.6 Translation Strategy (Implementation)

### Static Dictionary-Based i18n (Required)

All translations are stored as **static dictionaries**, bundled with frontend and Worker.

Example:

```ts
i18n["draw.winner"] = {
  "en": "WINNER",
  "zh-TW": "中獎者",
  "ja": "当選者"
}
```

No runtime translation services are allowed.

---

## 16.7 Copy Tone Guidelines (Very Important)

Translations MUST follow these rules:

### English

* Direct
* Neutral
* Short

Example:

> “Winner”

---

### Traditional Chinese (Taiwan)

* Formal but friendly
* Event-appropriate
* Avoid Mainland China terms

Examples:

* “中獎者” (not 得獎人)
* “兌獎” (not 領獎程序)
* “請上台領獎”

---

### Japanese

* Polite but not corporate
* Event MC tone
* Avoid keigo overload

Examples:

* “当選者”
* “景品をお受け取りください”
* “再抽選します”

---

## 16.8 Host Call-Out Alignment Rule

Text shown on draw screen MUST be:

* Easy to read aloud
* Culturally natural for MC-style announcement

Avoid:

* Full sentences
* Technical phrasing
* UI jargon

---

## 16.9 URL & Routing Rules

Language is **NOT encoded in URL**.

Correct:

```
/s/E123/draw
```

Incorrect:

```
/zh/s/E123/draw
```

Language comes from session state only.

---

## 16.10 Error Handling & Fallback

If a translation key is missing:

1. Fallback to English
2. Never show raw keys
3. Never block the flow

Live events > linguistic perfection.

---

## 16.11 Testing Requirements

Before release, each language MUST be tested for:

* Draw flow end-to-end
* Scan success & failure cases
* Wallet ticket readability
* Projection legibility (large screen)
* Elder-friendly clarity

---

## 16.12 Guiding Principle (i18n)

> **Language must never be the reason someone fails to claim a prize.**

If a grandparent, a child, and a bilingual host can all understand the screen at a glance, the translation is correct.

---

## 17. Advertising (Google Ads) Specification

### Goal

Allow **non-intrusive monetization** via Google Ads **without compromising fairness, trust, or live-event usability**.

Ads must never interfere with:

* Raffle integrity
* Draw flow
* Prize claiming
* Participant confidence

---

## 17.1 Core Rule (Non-Negotiable)

> **No ads are allowed during any critical raffle action.**

If someone is:

* Handing out tickets
* Watching the draw
* Claiming a prize

They must **never see an ad**.

---

## 17.2 Allowed Ad Zones

Ads are permitted **only** in the following locations:

### ✅ A. Session Landing / Waiting Screens

Examples:

* Before handout starts
* “Waiting for draw to begin”
* “Registration closed, draw starting soon”

**Characteristics**

* Static screen
* No time pressure
* No scanning
* No decision-making

---

### ✅ B. Post-Event / Session Closed Screen

After:

* All prizes claimed
* Session state = `CLOSED`

Example text:

> “Thank you for participating!”

Ads may appear **below the thank-you message**.

---

### ✅ C. Optional “Info / About” Page

If an informational page exists (rules, FAQ, credits), ads are allowed.

---

## 17.3 Explicitly Forbidden Ad Zones ❌

Ads MUST NOT appear on:

### ❌ `/s/{session_id}/handout`

Reason:

* Receptionist speed & clarity is critical
* Any distraction increases error risk

---

### ❌ `/s/{session_id}/draw`

Reason:

* Live projection
* Perceived fairness
* Audience trust

This screen must feel **ceremonial**, not commercial.

---

### ❌ `/s/{session_id}/scan`

Reason:

* Prize verification is a trust-sensitive action
* Ads create suspicion (“Is this legit?”)

---

### ❌ Wallet Tickets

Reason:

* Wallet passes must remain clean
* Ads violate platform guidelines
* Feels scammy

---

## 17.4 Ad Format Restrictions

Only the following ad types are allowed:

### Allowed

* Static display ads
* Responsive display ads
* Non-animated or lightly animated

### Not Allowed

* Auto-playing video
* Audio ads
* Interstitials
* Pop-ups
* Fullscreen overlays

---

## 17.5 Ad Placement Rules

### Visual Rules

* Ads must be:

  * Clearly separated
  * Visually secondary
  * Never centered
* No ad may resemble:

  * A button
  * A QR code
  * A call-to-action

### Labeling

* Ads must be labeled:

  * “Advertisement”
  * Or platform-default label

---

## 17.6 i18n & Ads

* Ad container chrome (e.g. “Advertisement”) must be localized:

  * EN
  * zh-TW
  * ja
* Ad content language is **not controlled** by the system
* Ads must not block or overlap localized text

---

## 17.7 Performance Constraints (Cloudflare)

* Ads must load **after core UI**
* Ads must not block:

  * QR rendering
  * Draw animation
  * Scan camera initialization
* If ad scripts fail:

  * UI must continue normally

Ad failure must never impact raffle functionality.

---

## 17.8 Ad-Free Guarantee for Critical Actions

The following user actions are **always ad-free**:

* Ticket creation
* QR scanning
* Drawing winners
* Claim verification

This guarantee should be stated publicly as part of the product’s trust promise.

---

## 17.9 Future Monetization Compatibility

This ad model is compatible with:

* Ad-free paid tier
* Sponsor branding (event-level)
* Donation / tip jar
* White-label hosting

Ads must be **removable without refactoring core flows**.

---

## 17.10 Guiding Principle (Ads)

> **If an ad could make someone doubt the fairness of the raffle,
> it does not belong on that screen.**

Trust > revenue.

---

## End of Advertising Specification

