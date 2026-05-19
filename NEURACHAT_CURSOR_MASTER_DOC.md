# NEURACHAT — CURSOR AI MASTER BUILD DOCUMENT
> Read this entire document before writing a single line of code.
> This is the single source of truth for the entire NeuraChat frontend rebuild.

---

## TABLE OF CONTENTS
1. Project Overview
2. Tech Stack
3. Design System
4. File Structure
5. Shared Components & JS Modules
6. Animation System
7. Page-by-Page Build Guide
8. Things Cursor Cannot Do (Parallel Tasks for You)
9. Integration Checklist

---

## 1. PROJECT OVERVIEW

**Project Name:** NeuraChat
**Type:** AI Chatbot Web Application (Portfolio Project)
**Backend:** Flask (Python), SQLite, Gemini 2.5 Flash API
**Live URL:** https://ai-chatbot-agentic-ai-nlp.onrender.com
**GitHub:** github.com/ankush-poonia007/AI-Chatbot-Agentic-AI-NLP
**Built by:** Ankush Poonia

**What it does:**
NeuraChat is a full-stack AI chatbot with user authentication, persistent chat history, membership tiers, and an agentic AI engine powered by Google Gemini. Users register, log in, and chat with an AI that remembers conversation context. Free tier has a message limit; Pro tier is unlimited.

**Design Philosophy:**
Professional, clean, rounded, and friendly. Inspired by Perplexity Comet — breathable layout, minimal color usage, real product feel. NOT an over-designed gradient soup. Every element earns its place.

---

## 2. TECH STACK

### Frontend (All via CDN — no npm, no build step)
```html
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- GSAP + ScrollTrigger -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>

<!-- marked.js (markdown rendering) -->
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>

<!-- DOMPurify (sanitize markdown output) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.0.6/purify.min.js"></script>

<!-- EmailJS -->
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>

<!-- Lucide Icons -->
<script src="https://unpkg.com/lucide@latest"></script>
```

### Backend (Do not change)
- Flask (Python)
- SQLite via `backend/database.py`
- All routes prefixed `/api/`
- Session-based auth (Flask sessions)
- Gemini 2.5 Flash via `backend/chatbot_engine/`

---

## 3. DESIGN SYSTEM

### Color Palette

```css
:root {
  /* Dark Mode (Default) */
  --bg-primary: #0f1117;
  --bg-surface: #1a1d27;
  --bg-surface-2: #22263a;
  --bg-hover: #2a2f45;
  --accent: #22d3ee;
  --accent-hover: #06b6d4;
  --accent-glow: rgba(34, 211, 238, 0.15);
  --accent-glow-strong: rgba(34, 211, 238, 0.3);
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --text-muted: #475569;
  --border: #2a2f45;
  --border-accent: rgba(34, 211, 238, 0.3);
  --shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
  --shadow-accent: 0 0 20px rgba(34, 211, 238, 0.15);

  /* Particles */
  --particle-color: rgba(34, 211, 238, 0.4);
}

[data-theme="light"] {
  --bg-primary: #f8fafc;
  --bg-surface: #ffffff;
  --bg-surface-2: #f1f5f9;
  --bg-hover: #e2e8f0;
  --accent: #0891b2;
  --accent-hover: #0e7490;
  --accent-glow: rgba(8, 145, 178, 0.1);
  --accent-glow-strong: rgba(8, 145, 178, 0.2);
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #94a3b8;
  --border: #e2e8f0;
  --border-accent: rgba(8, 145, 178, 0.3);
  --shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  --shadow-accent: 0 0 20px rgba(8, 145, 178, 0.1);
  --particle-color: rgba(8, 145, 178, 0.3);
}
```

### Typography
```css
/* Display font — headings */
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');

/* Body font — readable, modern, warm */
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600&display=swap');

/* Mono — code blocks */
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');

--font-display: 'Syne', sans-serif;
--font-body: 'DM Sans', sans-serif;
--font-mono: 'JetBrains Mono', monospace;
```

### Border Radius
```css
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 24px;
--radius-full: 9999px;
```

### Spacing Scale
Follow Tailwind's spacing. Base unit = 4px. Use generous padding — minimum p-4 on cards, p-6 on sections.

### Component Rules
- All buttons: rounded-full or rounded-xl, never square
- All cards: rounded-xl with border var(--border), background var(--bg-surface)
- All inputs: rounded-xl, border var(--border), focus border var(--accent)
- All interactive elements: transition-all duration-200
- Hover states: subtle background shift + slight scale (1.01–1.02 max)

---

## 4. FILE STRUCTURE

```
/static
  /css
    main.css          ← CSS variables, base styles, resets, utility classes
    animations.css    ← Keyframes, hover states, transition classes

  /js
    nav.js            ← Shared top navbar (injected into all non-chat pages)
    theme.js          ← Dark/light toggle, localStorage persistence
    cursor.js         ← Custom cursor glow effect
    animations.js     ← GSAP page load, ScrollTrigger, particles
    toast.js          ← Global notification system
    protect.js        ← Auth guard (redirects to login if no session)
    preloader.js      ← Page preloader fade-in

    chat.js           ← All chat page logic
    auth.js           ← Login + register logic
    profile.js        ← Profile page logic
    contact.js        ← EmailJS form submission
    docs.js           ← Docs sidebar navigation + anchor scrolling

  /assets
    /icons            ← Lucide SVG icons (download manually)
    /logos            ← Flask, Gemini, SQLite, Tailwind, Python SVG logos
    favicon.svg       ← NeuraChat favicon (teal neural dot icon)
    og-image.png      ← Open Graph preview image for social sharing

/templates
    index.html
    chat.html
    login.html
    register.html
    recovery.html
    profile.html
    docs.html
    contact.html
    terms.html
    404.html
```

---

## 5. SHARED COMPONENTS & JS MODULES

### nav.js — Top Navbar (injected on all non-chat pages)
```
Structure:
  Left:  NeuraChat logo SVG + "NeuraChat" wordmark in Syne font
  Center: Links — Features | Docs | Pricing | Contact
  Right:  Theme toggle icon + Login button (outline) + Get Started button (accent filled)

Behavior:
  - Transparent on hero, solid bg-surface on scroll (transition)
  - Mobile: hamburger menu, full screen overlay nav
  - Active link highlighted with accent color
  - Inject into page via: document.getElementById('nav-root').innerHTML = navHTML
```

### theme.js
```
- Reads localStorage for 'neurachat-theme'
- Applies data-theme="light" or data-theme="dark" to <html>
- Toggle button animates sun/moon icon swap
- Full page color transition: transition: background 0.3s, color 0.3s on all elements
- Default: dark
```

### toast.js
```
Toast types: success (teal), error (red), info (blue), warning (amber)
Position: bottom-right
Auto dismiss: 3 seconds
Animation: slide in from right, fade out
Usage: Toast.show('Message sent!', 'success')
Stack multiple toasts vertically
```

### protect.js
```
- Calls /api/auth/status or checks session cookie
- If not authenticated, redirect to /login
- Apply to: chat.html, profile.html
- Include as first script on protected pages
```

### preloader.js
```
- Full screen overlay with NeuraChat logo centered
- Teal pulse animation on logo
- Fades out after 1.2s or when page load completes
- GSAP: opacity 1 → 0, then display none
- Only shows on first visit per session (sessionStorage flag)
```

### cursor.js
```
- Custom cursor: small teal circle (12px) + outer ring (28px) with delay
- Outer ring follows with 0.1s lerp lag
- On hover over button/link: inner dot scales to 0, outer ring scales to 1.5x
- On click: brief scale pulse
- Hide on touch devices
- CSS: mix-blend-mode: difference for interesting overlap effect
```

### animations.js
```
GSAP Animations:

1. Page Load (all pages):
   - Elements with class .reveal fade + slide up (y: 30 → 0, opacity: 0 → 1)
   - Staggered: 0.1s between elements
   - Duration: 0.6s, ease: power2.out

2. ScrollTrigger (index.html):
   - Each section triggers when 80% in viewport
   - Cards stagger: 0.15s between each card
   - Scrub: false (snap in, not scrub)

3. Hero animation sequence:
   - Tagline → sub-tagline → buttons → mock chat visual
   - Each 0.2s apart on load

4. Particle Background (canvas):
   - 60 particles on dark mode, 30 on light
   - Teal color, 1-2px radius
   - Slow drift, connect lines within 120px
   - Pause when tab not visible (performance)

5. Navbar scroll:
   - Add .scrolled class after 50px scroll
   - GSAP: backdrop-blur + bg-surface fade in
```

---

## 6. ANIMATION SYSTEM

### CSS Animations (animations.css)
```css
/* Button hover */
.btn-primary:hover {
  transform: scale(1.02);
  box-shadow: var(--shadow-accent);
  transition: all 0.2s ease;
}

/* Card hover */
.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow);
  border-color: var(--border-accent);
  transition: all 0.25s ease;
}

/* Glow pulse on accent elements */
@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 8px var(--accent-glow); }
  50% { box-shadow: 0 0 24px var(--accent-glow-strong); }
}

/* Typing indicator */
@keyframes bounce-dot {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-6px); }
}

/* Fade in up (utility) */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Theme transition */
* { transition: background-color 0.3s ease, border-color 0.3s ease, color 0.2s ease; }
```

### prefers-reduced-motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 7. PAGE-BY-PAGE BUILD GUIDE

---

### PAGE 1: index.html — Landing Page

**Purpose:** Marketing front door. Convinces visitor to sign up and try NeuraChat.

**Meta:**
```html
<title>NeuraChat — AI Conversations That Actually Remember</title>
<meta name="description" content="NeuraChat is a full-stack AI chatbot with persistent memory, agentic responses, and secure authentication. Start chatting for free.">
<meta property="og:image" content="/static/assets/og-image.png">
<link rel="icon" href="/static/assets/favicon.svg">
```

**Loads:** nav.js, theme.js, cursor.js, animations.js, preloader.js

---

**SECTION 1 — NAVBAR**
- Logo (teal SVG dot + "NeuraChat" in Syne bold)
- Nav links: Features, Docs, Pricing, Contact
- Right: Moon/Sun toggle + Login (ghost button) + Get Started (teal filled, rounded-full)
- Transparent → frosted glass on scroll
- Mobile: hamburger → fullscreen overlay menu

---

**SECTION 2 — HERO**

Layout: Two column on desktop, stacked on mobile

Left column text:
```
Badge (small pill): "Powered by Google Gemini"

H1 Headline (Syne 800, large):
"Chat with an AI that
actually understands you"

Sub-tagline (DM Sans, text-secondary):
"NeuraChat remembers your conversations, learns your context,
and delivers answers — not just responses."

Two buttons:
[Start Chatting Free →]  ← teal filled, rounded-full, arrow icon
[View Docs]              ← ghost outline, rounded-full
```

Right column visual:
```
Mock chat window (HTML/CSS, not an image):
  - Rounded-xl card with surface bg
  - Fake top bar: three dots + "NeuraChat" title
  - 3 messages:
      User: "Explain neural networks simply"
      AI: "Think of it like a brain made of math..." (with teal left border)
      User: "Give me a Python example"
  - Typing indicator: three bouncing dots in teal
  - Subtle glow on the card border
```

Background:
- Canvas particle system (floating teal dots + connecting lines)
- Faint radial gradient glow behind hero text (teal, low opacity)

Animations:
- GSAP stagger: badge → h1 → sub-tagline → buttons (each 0.2s)
- Mock chat: slide in from right, 0.4s delay
- Particles: start moving after preloader exits

---

**SECTION 3 — FEATURES**

Heading: "Everything you need in one chat"
Sub: "Built from scratch. No third-party chat wrappers."

4 cards in a 2x2 grid (desktop), 1 column (mobile):

```
Card 1 — Agentic AI
Icon: Lucide "brain-circuit" (teal)
Title: "Agentic Responses"
Text: "NeuraChat doesn't just answer — it reasons through your question step by step."

Card 2 — Chat History
Icon: Lucide "history" (teal)
Title: "Persistent Memory"
Text: "Every conversation is saved. Pick up where you left off, anytime."

Card 3 — Secure Auth
Icon: Lucide "shield-check" (teal)
Title: "Secure by Default"
Text: "Passwords hashed with scrypt. Sessions managed server-side. Your data stays yours."

Card 4 — Membership Tiers
Icon: Lucide "layers" (teal)
Title: "Free & Pro Plans"
Text: "Start free with 50 messages/month. Upgrade to Pro for unlimited conversations."
```

Card style: bg-surface, border, rounded-xl, icon in teal circle badge, hover lifts with shadow
Animation: ScrollTrigger stagger, each card 0.15s apart, fade + slide up

---

**SECTION 4 — HOW IT WORKS**

Heading: "Up and running in 3 steps"

3 steps horizontal (desktop), vertical (mobile):

```
Step 1 — Create Account
Icon: Lucide "user-plus" in teal circle
Title: "Sign Up Free"
Text: "Create your account in seconds. No credit card required."

Connector arrow →

Step 2 — Start a Chat
Icon: Lucide "message-square" in teal circle
Title: "Start Chatting"
Text: "Type anything. NeuraChat understands context, not just keywords."

Connector arrow →

Step 3 — Get Answers
Icon: Lucide "sparkles" in teal circle
Title: "Get Real Answers"
Text: "Receive detailed, formatted, markdown-rendered responses instantly."
```

Visual: Step numbers (01, 02, 03) in large Syne 800 faded behind each card
Animation: ScrollTrigger, steps reveal left to right with 0.2s stagger

---

**SECTION 5 — PRICING**

Heading: "Simple, honest pricing"
Sub: "No hidden fees. No confusing tiers."

Two cards side by side (desktop), stacked (mobile):

```
FREE Plan card:
  Title: "Free"
  Price: "$0 / month"
  Badge: "Get Started"
  Features list (checkmarks):
    ✓ 50 messages per month
    ✓ Full chat history
    ✓ Secure authentication
    ✓ All AI features
    ✗ Unlimited messages
    ✗ Priority responses
  Button: "Start Free" (ghost outline)

PRO Plan card (highlighted, teal border + glow):
  Title: "Pro"
  Price: "$9 / month"
  Badge: "Most Popular" (teal pill)
  Features list:
    ✓ Unlimited messages
    ✓ Full chat history
    ✓ Secure authentication
    ✓ All AI features
    ✓ Priority responses
    ✓ Early access to new features
  Button: "Upgrade to Pro" (teal filled)
```

Note: Pro plan is currently UI-only (backend upgrade endpoint exists but payment not integrated yet). Button shows "Coming Soon" toast on click.

Animation: ScrollTrigger, Free card slides from left, Pro card slides from right

---

**SECTION 6 — TECH STACK**

Heading: "Built with modern tools"
Sub: "Reliable, proven, and open source."

Row of logo badges:
```
Python logo + "Python"
Flask logo + "Flask"
Google Gemini logo + "Gemini 2.5"
SQLite logo + "SQLite"
Tailwind logo + "Tailwind CSS"
```

Style: Each badge is a pill with logo + text, bg-surface-2, border, rounded-full
Layout: Centered row, wraps on mobile
Animation: Fade in stagger on scroll

---

**SECTION 7 — TESTIMONIALS**

Heading: "What people are saying"
Sub: "Early users share their experience."

3 testimonial cards:

```
Card 1:
  Avatar: DiceBear "avataaars" style (generate URL)
  Name: "Rohan Mehta"
  Role: "CS Student, IIT Delhi"
  Quote: "The context memory is what got me. I could ask a follow-up three messages later and it still knew what I meant."

Card 2:
  Avatar: DiceBear
  Name: "Priya Sharma"
  Role: "ML Engineer"
  Quote: "Clean, fast, and no nonsense. NeuraChat feels like a tool built by someone who actually uses it."

Card 3:
  Avatar: DiceBear
  Name: "Arjun Singh"
  Role: "Startup Founder"
  Quote: "I've tried a dozen AI chat tools. NeuraChat is the only one where I actually understand what's happening under the hood."
```

Card style: bg-surface, border, rounded-xl, avatar 40px circle, quote in italic
Animation: ScrollTrigger stagger

---

**SECTION 8 — FAQ TEASER**

Heading: "Common questions"

3 accordion items (expand/collapse):
```
Q: Is NeuraChat free to use?
A: Yes. The free tier includes 50 messages per month with full access to all features.

Q: Is my chat data private?
A: All chats are stored locally in an SQLite database on the server. No data is shared with third parties.

Q: What AI model powers NeuraChat?
A: NeuraChat uses Google Gemini 2.5 Flash, accessed through the official Gemini API.
```

Link below: "Read full documentation →" → docs.html

Animation: Smooth accordion open/close (CSS height transition)

---

**SECTION 9 — CTA BANNER**

Full width section, teal gradient background (subtle, not loud):

```
Heading (Syne 800, white): "Start your first conversation"
Sub: "Free to use. No credit card. Just AI."
Button: "Open NeuraChat →" (white filled, teal text, rounded-full)
```

Animation: Fade in on scroll

---

**FOOTER**

```
Left: NeuraChat logo + "Built by Ankush Poonia"
Center links: Features | Docs | Pricing | Contact | Terms | Privacy
Right: GitHub icon link | LinkedIn icon link
Bottom line: "© 2025 NeuraChat. Open source portfolio project."
```

---

### PAGE 2: chat.html — Chat Application

**Purpose:** The core product. Where users actually chat with the AI.

**Protected:** Yes — protect.js redirects to login if no session

**Loads:** theme.js, cursor.js, chat.js, animations.js, marked.js, DOMPurify

**Meta:**
```html
<title>NeuraChat — Chat</title>
```

**Layout:** Full viewport height, no scroll on outer container. Two columns: sidebar + main.

---

**SIDEBAR (left, collapsible)**

Width: 260px desktop, hidden on mobile (slide in via hamburger)

Top:
```
NeuraChat logo + name (links to index.html)
[+ New Chat] button — teal filled, rounded-xl, full width, Lucide "plus" icon
```

Middle (scrollable):
```
Chat history grouped:

TODAY
  • "What is recursion?" (active, teal left border)
  • "Python list comprehension"

YESTERDAY
  • "Explain neural networks"
  • "Flask routing basics"

LAST 7 DAYS
  • "Sorting algorithms"

Each item:
  - Truncated title (max 1 line, ellipsis)
  - Hover: show delete icon (Lucide "trash-2") on right
  - Active: teal left border + slightly lighter bg
  - Click: loads that chat's messages
```

Bottom:
```
Divider line
User avatar (DiceBear, 32px) + username + plan badge (FREE/PRO)
Settings icon → profile.html
```

Collapse:
```
Collapse button (Lucide "panel-left-close") on sidebar edge
Collapses to 0px width, main area expands
Icon persists as a small tab to reopen
```

---

**MAIN CHAT AREA**

Top bar:
```
Left: Hamburger (mobile only) + Current chat title (editable on double-click)
Right: Model indicator "Gemini 2.5 Flash" pill + Theme toggle
```

Empty state (no messages yet):
```
NeuraChat logo centered (large, 64px, subtle glow)
Heading: "How can I help you today?"
Sub: "Ask anything. I remember our conversation."

4 suggested prompt cards in 2x2 grid:
  "Explain machine learning simply"
  "Write a Python function for sorting"
  "What is the difference between REST and GraphQL?"
  "Help me debug this error"

Each card: rounded-xl, border, hover teal border + slight lift
Click: fills input and sends
```

Message thread (when messages exist):
```
User message:
  Right aligned
  Teal background pill, white text
  Rounded-xl (top-left flat)
  Timestamp on hover

AI message:
  Left aligned
  bg-surface card, border, rounded-xl (top-left flat)
  Markdown rendered (marked.js + DOMPurify)
  Bottom row: copy icon (Lucide "copy") + timestamp
  Copy: changes to checkmark for 2s, then back

Typing indicator (while AI responds):
  Three bouncing teal dots
  Same position as AI message
  Fade in, replace with actual message when done
```

Input area (fixed bottom):
```
Container: bg-surface, border-top, padding
  Textarea: rounded-xl, auto-resize (1 to 4 rows max), placeholder "Message NeuraChat..."
  Right of textarea:
    Character count (gray, small)
    Send button (teal circle, Lucide "arrow-up", disabled when empty)

Membership bar (above input, free tier only):
  "23 / 50 messages used this month"
  Thin progress bar in teal
  At 45/50: "5 messages remaining — Upgrade to Pro"
  At 50/50: input disabled, "Limit reached" message + Upgrade button
```

---

**ANIMATIONS — chat.html**
- Sidebar: slide in from left (GSAP, 0.3s)
- New message (user): fade in from right
- New message (AI): fade in from left, slight delay
- Typing dots: bounce animation (CSS)
- Suggested prompts: stagger fade in on empty state load
- Sidebar item hover: smooth left border expansion

---

### PAGE 3: login.html — Login

**Purpose:** Authenticate existing users.

**Loads:** theme.js, cursor.js, auth.js, animations.js

**Meta:**
```html
<title>NeuraChat — Login</title>
```

**Layout:** Full viewport, centered card, particle background (lighter density)

**Content:**
```
Top: NeuraChat logo (linked to index.html)

Card (bg-surface, rounded-2xl, shadow, max-w-md, centered):

  Heading (Syne 700): "Welcome back"
  Sub: "Sign in to continue your conversations"

  Form:
    Email field:
      Label: "Email address"
      Input: type="email", rounded-xl, border, focus teal
      Icon: Lucide "mail" inside input left

    Password field:
      Label: "Password"
      Input: type="password", rounded-xl
      Icon: Lucide "lock" inside input left
      Show/hide toggle: Lucide "eye" / "eye-off" inside input right

    Row: [Remember me checkbox] [Forgot password? →]

    [Sign In] button:
      Full width, teal filled, rounded-xl
      Loading state: spinner replaces text on submit

  Divider: "— or —"

  "Don't have an account?" [Create one →] (accent link)

Error states (inline, below relevant field):
  "Invalid email format"
  "Password must be at least 8 characters"
  "No account found with this email" (from API response)
  "Incorrect password" (from API response)
```

**API Call:** POST /api/login → redirect to /chat on success

**Animations:**
- Card: GSAP fade + scale (0.95 → 1) on load
- Field focus: border color transition to teal
- Error: shake animation on failed submit

---

### PAGE 4: register.html — Sign Up

**Purpose:** Create a new account.

**Loads:** theme.js, cursor.js, auth.js, animations.js

**Meta:**
```html
<title>NeuraChat — Create Account</title>
```

**Layout:** Same as login — centered card, particle background

**Content:**
```
Top: NeuraChat logo

Card:
  Heading: "Create your account"
  Sub: "Free forever. No credit card needed."

  Form:
    Full Name:
      Input: text, Lucide "user" icon

    Email:
      Input: email, Lucide "mail" icon

    Password:
      Input: password, Lucide "lock" icon, show/hide toggle
      Password strength indicator below (bar, 4 levels):
        Weak (red) | Fair (amber) | Good (blue) | Strong (teal)
      Strength text: "Weak", "Fair", "Good", "Strong"

    Confirm Password:
      Input: password, Lucide "check" icon, show/hide toggle
      Inline: checkmark when both match, X when they don't

    Terms checkbox:
      "I agree to the [Terms of Service] and [Privacy Policy]"
      Links open terms.html

    [Create Account] button: full width teal, loading state

  "Already have an account?" [Sign in →]
```

**API Call:** POST /api/register → redirect to /chat on success

---

### PAGE 5: recovery.html — Password Recovery

**Purpose:** Reset forgotten password.

**Loads:** theme.js, cursor.js, auth.js, animations.js

**Meta:**
```html
<title>NeuraChat — Recover Account</title>
```

**Two-step flow (show/hide with JS):**

```
Step 1 — Enter Email:
  Heading: "Forgot your password?"
  Sub: "Enter your email and we'll send a reset link."
  Email input + Send button
  Back to login link

Step 2 — Success state:
  Lucide "mail-check" icon (teal, large)
  Heading: "Check your inbox"
  Sub: "We've sent a recovery link to [email]. It expires in 15 minutes."
  [Resend email] link (greyed, 60s countdown)
  [Back to Login] button
```

Note: Backend recovery flow — implement as needed. Frontend shows correct state based on API response.

---

### PAGE 6: profile.html — User Profile

**Purpose:** Manage account, view usage, change settings.

**Protected:** Yes — protect.js

**Loads:** theme.js, cursor.js, profile.js, animations.js, toast.js

**Meta:**
```html
<title>NeuraChat — Profile</title>
```

**Layout:** Top navbar (nav.js) + centered content, max-w-2xl

**Sections:**

```
PROFILE INFO CARD:
  Left: Avatar circle (DiceBear, 80px) + [Change Avatar] button below
  Right:
    Display Name (editable input)
    Email (read-only, grayed)
    Member since: "January 2025"
  Bottom: [Save Changes] button (teal) + success toast on save

MEMBERSHIP CARD:
  Current plan badge: FREE or PRO (pill)
  Usage: "23 of 50 messages used this month"
  Progress bar (teal fill)
  Resets on: [date]
  [Upgrade to Pro →] button (if free tier)

SECURITY CARD:
  [Change Password] button → expands inline form:
    Current password
    New password (with strength indicator)
    Confirm new password
    [Update Password] button

PREFERENCES CARD:
  Default theme: Toggle (Dark / Light)
  (Saves to localStorage and profile)

DANGER ZONE CARD:
  Red border, subtle red tint background
  Heading: "Danger Zone"
  [Delete Account] button (red outline)
  Click: confirmation modal:
    "Are you sure? This will permanently delete your account and all chat history."
    [Cancel] [Delete My Account] (red filled)
```

**API Calls:**
- GET /api/profile → populate fields
- POST /api/profile/update → save changes
- POST /api/auth/change-password (implement if not exists)
- DELETE /api/auth/delete-account (implement if not exists)

---

### PAGE 7: docs.html — Documentation

**Purpose:** Technical reference for users and developers.

**Loads:** nav.js, theme.js, cursor.js, docs.js, animations.js

**Meta:**
```html
<title>NeuraChat Docs — Documentation</title>
```

**Layout:** Top nav + two-column layout below: left sidebar (fixed) + right content (scrollable)

**Docs Sidebar (left, 240px):**
```
Search bar: "Search docs..." (filters sections live)
Back link: "← Back to NeuraChat"

Navigation groups:

FOUNDATION
  • Getting Started
  • Architecture
  • Security

API REFERENCE
  • Authentication
  • Messages
  • Neural Models
  • Storage

RESOURCES
  • FAQ
  • Changelog

Each link: smooth scroll to anchor on same page
Active link: teal left border + teal text
```

**Content sections (right, all built out):**

```
GETTING STARTED
  Heading: "Getting Started with NeuraChat"
  Content:
    1. Create a free account at neurachat.onrender.com
    2. Log in and you'll see the chat interface
    3. Type any message and press Enter or click Send
    4. Your chats are automatically saved in the sidebar
    5. Access previous conversations anytime from chat history
  Note box (teal border): "NeuraChat uses Google Gemini 2.5 Flash. Responses may take 2-4 seconds."

ARCHITECTURE
  Heading: "System Architecture"
  Sub: "How NeuraChat works under the hood"
  Simple ASCII or CSS diagram:
    [Browser] → [Flask Server] → [Gemini API]
                     ↓
                [SQLite DB]
  Sections:
    Frontend: Vanilla JS, Tailwind CSS, served as static HTML
    Backend: Flask (Python), handles auth, chat, profile, membership
    AI Engine: Agentic engine wraps Gemini 2.5 Flash with conversation history
    Database: SQLite with 5 tables — users, chats, messages, profiles, membership

SECURITY
  Heading: "Security"
  Points:
    - Passwords hashed using Python's scrypt via hashlib (no plain text storage)
    - Sessions managed server-side via Flask sessions
    - All API routes require valid session except /register and /login
    - Markdown rendered through DOMPurify to prevent XSS injection
    - SQLite database not publicly accessible

AUTHENTICATION (API Reference)
  Heading: "Authentication"
  Endpoints table:
    POST /api/register — Creates a new user account
    POST /api/login    — Authenticates user, sets session
    POST /api/logout   — Clears session
  Request/response examples in JetBrains Mono code blocks with copy button

MESSAGES
  Heading: "Messages"
  POST /api/chat — Send a message
  Request body: { "message": "string", "chat_id": "string" }
  Response: { "reply": "string", "chat_id": "string" }
  Notes: history is loaded server-side from chat_id

NEURAL MODELS
  Heading: "Neural Models"
  Model: Google Gemini 2.5 Flash
  Features: Fast responses, context window support, reasoning capability
  How history works: last N messages passed as conversation history on each call
  Limitations: Subject to Gemini API rate limits on free tier

STORAGE
  Heading: "Storage"
  Database: SQLite (neurachat.db)
  Tables:
    users      — id, username, email, password_hash, created_at
    chats      — id, user_id, title, created_at
    messages   — id, chat_id, role, content, created_at
    profiles   — user_id, display_name, avatar_seed
    membership — user_id, plan, message_count, reset_date
  Retention: All chats stored until user deletes or account deleted
  Note: Render free tier resets disk on redeploy — production DB needs Render Disk add-on

FAQ
  Heading: "Frequently Asked Questions"
  10 accordion items covering:
    - Is it free?
    - Is data private?
    - What AI model is used?
    - Why is the first response slow? (Render cold start, ~50s)
    - Can I export my chats?
    - How do I delete a chat?
    - What is the message limit?
    - Is there a mobile app?
    - How do I report a bug?
    - How do I contact support?

CHANGELOG
  Heading: "Changelog"
  Timeline layout:
    V3 — Current
      Full auth system (scrypt hashing)
      Persistent chat history (SQLite)
      Membership tiers
      Agentic AI engine with history
      Deployed on Render
    V2
      Improved response quality
      Added conversation context
      UI improvements
    V1
      Basic chatbot (IBM Summer Program)
      Single-turn responses
      No auth, no persistence
```

---

### PAGE 8: contact.html — Contact

**Purpose:** Let users send messages directly to the NeuraChat support email.

**Loads:** nav.js, theme.js, cursor.js, contact.js, animations.js, toast.js, EmailJS CDN

**Meta:**
```html
<title>NeuraChat — Contact Us</title>
```

**Layout:** Top nav + centered content, max-w-lg

**Content:**
```
Heading (Syne 700): "Get in Touch"
Sub: "Have a question, bug report, or just want to say hello?"

Contact Form:
  Full Name: text input + Lucide "user"
  Email: email input + Lucide "mail"
  Subject: dropdown select + Lucide "tag"
    Options: General Inquiry | Bug Report | Feature Request | Partnership | Other
  Message: textarea (6 rows), placeholder "Write your message here..."
  
  [Send Message] button: full width teal, loading state
  
  On success:
    Replace form with:
    Lucide "check-circle" (teal, 48px)
    "Message sent!"
    "We'll get back to you at [email] within 24 hours."
    [Send another message] link (resets form)

  On error:
    Toast: "Something went wrong. Try emailing us directly."

Alternative contact:
  "Or email us directly:"
  support email address displayed (with copy button)

Social links row:
  GitHub: Lucide "github" icon + "View on GitHub"
  LinkedIn: Lucide "linkedin" icon + "Connect on LinkedIn"
```

**EmailJS Setup:**
- Service ID: from EmailJS dashboard
- Template ID: from EmailJS dashboard
- Public Key: from EmailJS dashboard
- Target email: neurachat.support@gmail.com
- All three IDs stored as constants in contact.js

---

### PAGE 9: terms.html — Terms & Privacy

**Purpose:** Legal pages. Required for any real web product.

**Loads:** nav.js, theme.js, cursor.js, animations.js

**Meta:**
```html
<title>NeuraChat — Terms & Privacy</title>
```

**Layout:** Top nav + centered content max-w-2xl + tab switcher

**Tab UI:**
```
Two tabs: [Terms of Service] [Privacy Policy]
Active tab: teal underline + teal text
Tab switch: smooth fade transition
```

**Terms of Service content:**
```
Last updated: [date]

1. Acceptance of Terms
   By using NeuraChat you agree to these terms.

2. Description of Service
   NeuraChat is a portfolio project providing AI chat functionality.
   Service may be unavailable during maintenance or Render free tier downtime.

3. Acceptable Use
   Do not use NeuraChat to generate harmful, illegal, or abusive content.
   Do not attempt to reverse engineer or exploit the service.

4. Account Responsibility
   You are responsible for maintaining the confidentiality of your credentials.
   You are responsible for all activity under your account.

5. Free and Pro Tiers
   Free tier: 50 messages per month.
   Pro tier: unlimited (payment integration pending).
   Tier limits may change with notice.

6. Termination
   We reserve the right to suspend or delete accounts that violate these terms.
   You may delete your account at any time from the Profile page.

7. Limitation of Liability
   NeuraChat is provided as-is. No warranties expressed or implied.
   This is a portfolio/educational project — not a commercial service.
```

**Privacy Policy content:**
```
Last updated: [date]

1. Data We Collect
   - Name and email address (on registration)
   - Chat messages and AI responses
   - Login timestamps

2. How Data Is Stored
   Stored in SQLite database on the Render server.
   Passwords hashed with scrypt — never stored in plain text.

3. Data Sharing
   We do not sell, share, or transmit your data to third parties.
   Messages are sent to Google Gemini API for response generation — subject to Google's Privacy Policy.

4. Data Retention
   Data retained until you delete your account.
   Account deletion removes all chats, messages, and profile data.

5. Cookies
   We use session cookies for authentication only.
   No tracking or advertising cookies.

6. Your Rights
   Right to access your data: view all chats in the app.
   Right to deletion: delete account from Profile > Danger Zone.
   For data requests: contact via the Contact page.

7. Changes to Policy
   We may update this policy. Changes posted on this page with updated date.
```

---

### PAGE 10: 404.html — Not Found

**Purpose:** Catch broken or wrong URLs gracefully.

**Loads:** theme.js, cursor.js, animations.js

**Content:**
```
Large "404" in Syne 800, teal
Sub: "This page doesn't exist"
Body: "Looks like you followed a broken link or typed the wrong URL."
Button: [← Back to NeuraChat] → index.html
Optional: small particle effect in background
```

---

## 8. THINGS CURSOR CANNOT DO (YOUR PARALLEL TASKS)

Run these yourself while Cursor builds pages. Integrate after.

---

### TASK 1 — Create NeuraChat Gmail
- Create: neurachat.support@gmail.com (or similar)
- Use for: EmailJS contact form destination
- Take note of the email — add to contact.js as display email

### TASK 2 — Set Up EmailJS
- Go to emailjs.com → free account
- Add Gmail as email service
- Create email template:
  ```
  From: {{from_name}} ({{from_email}})
  Subject: [NeuraChat Contact] {{subject}}
  Message: {{message}}
  ```
- Copy: Service ID, Template ID, Public Key
- Add these to contact.js constants

### TASK 3 — Create Favicon
- Design a simple SVG: teal circle with a small "N" or neural dot pattern
- Save as /static/assets/favicon.svg
- Tools: Figma free, Canva, or favicon.io

### TASK 4 — Create OG Image
- 1200x630px image
- NeuraChat logo + tagline on dark slate background
- Save as /static/assets/og-image.png
- Tools: Canva free, Figma

### TASK 5 — Download Tech Logos
- Download SVGs for: Python, Flask, SQLite, Tailwind CSS, Google Gemini
- Save to /static/assets/logos/
- Sources: svgrepo.com, simpleicons.org

### TASK 6 — Register DiceBear Avatars
- No registration needed — DiceBear is a URL API
- Generate avatar URLs for testimonials:
  `https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan`
- Test a few seeds and pick 3 you like for testimonials

### TASK 7 — Set Up Render Disk (Optional but important)
- Current SQLite resets on redeploy on free Render
- Add a Render Disk ($1/month) to persist neurachat.db
- Or accept data loss on redeploy (fine for portfolio demos)

### TASK 8 — Test Backend Routes
Before Cursor wires frontend, verify these routes work in Postman or browser:
- POST /api/register
- POST /api/login
- POST /api/logout
- GET /api/profile
- POST /api/profile/update
- GET /api/chats
- POST /api/chats/new
- GET /api/chats/<id>/messages
- POST /api/chat
- DELETE /api/chats/<id>/delete
- POST /api/chats/<id>/rename

### TASK 9 — Add /api/auth/status Route
Cursor's protect.js needs a way to check if user is logged in.
Add this to your Flask backend:
```python
@app.route('/api/auth/status')
def auth_status():
    if 'user_id' in session:
        return jsonify({'authenticated': True, 'user_id': session['user_id']})
    return jsonify({'authenticated': False}), 401
```

### TASK 10 — Screenshot and GIF (after build)
- ScreenToGif: record chat demo
- Screenshots: homepage, chat, docs, profile
- Add to README /static/assets/screenshots/

---

## 9. INTEGRATION CHECKLIST

After Cursor builds each page and you've completed parallel tasks:

```
□ Replace EmailJS placeholder IDs with real IDs in contact.js
□ Add favicon.svg to /static/assets/ and verify it shows in all pages
□ Add og-image.png and verify meta tags reference correct path
□ Add tech logos to /static/assets/logos/ and verify they show on index.html
□ Test protect.js on chat.html and profile.html (try accessing logged out)
□ Test theme toggle on every page (dark ↔ light)
□ Test contact form end-to-end (submit → check Gmail inbox)
□ Test chat new + history on chat.html
□ Test all docs sidebar links scroll correctly
□ Test terms tab switcher
□ Test 404 page by visiting /nonexistent
□ Test on mobile (375px) — navbar, chat, forms
□ Verify marked.js renders bold, code, lists in chat messages
□ Verify DOMPurify strips any script tags in AI responses
□ Run Lighthouse audit — aim for 90+ performance on index.html
□ Push to GitHub with updated README
□ Record GIF demo
□ Write LinkedIn post
```

---

## CURSOR PROMPTING STRATEGY

**Always paste at start of new Cursor session:**
```
I am building NeuraChat — a Flask + Vanilla JS + Tailwind AI chatbot.
Backend is Python Flask, all routes prefixed /api/, session-based auth.
Design: dark slate bg #0f1117, surface #1a1d27, teal accent #22d3ee.
Fonts: Syne (headings), DM Sans (body), JetBrains Mono (code).
Rounded everywhere. GSAP for animations. No React. No npm.
Refer to NEURACHAT_CURSOR_MASTER_DOC.md for full spec.
Use the new stack — frontend/css/main.css and frontend/css/animations.css. Do NOT reference the old index.css. Follow the same pattern as index.html.
Footer LinkedIn URL is: https://www.linkedin.com/in/YOUR-SLUG — use this exact URL in the footer. 
Today we are building: [PAGE NAME]
```

**Build order:**
1. main.css + animations.css (design system first) Done 
2. nav.js + theme.js + toast.js + cursor.js + protect.js + preloader.js (shared modules) Done
3. index.html Done 
4. login.html + register.html + auth.js
5. recovery.html
6. chat.html (most complex — give it a full session) Partially Done 
7. profile.html Done
8. docs.html Done
9. contact.html
10. terms.html
11. 404.html

---

*End of Document — NeuraChat Frontend Rebuild Master Spec*
*Prepared for Cursor AI — Page by Page Build Guide*
*Project by Ankush Poonia*
