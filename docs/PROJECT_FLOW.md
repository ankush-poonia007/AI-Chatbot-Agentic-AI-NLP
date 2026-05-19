# NeuraChat AI — Complete Project Flow
# From Rule-Based Terminal Bot (V1) to Full-Stack Agentic Web App (V3)
# Author: Ankush Poonia
# Repo: https://github.com/ankush-poonia007/AI-Chatbot-Agentic-AI-NLP

# ============================================================
# PROJECT EVOLUTION OVERVIEW
# ============================================================
#
# V1 → Rule-based terminal chatbot (IBM SkillBuild Internship)
# V2 → Modular NLP refactor with memory and depth control
# V3 → Full-stack web app with Flask, SQLite, Gemini 2.5 Flash
#
# ============================================================


# ============================================================
# ██╗   ██╗ ██╗
# ██║   ██║ ██║
# ██║   ██║ ██║
# ╚██╗ ██╔╝ ██║
#  ╚████╔╝  ██║
#   ╚═══╝   ╚═╝
# ============================================================
# VERSION 1 — Terminal Prototype (IBM SkillBuild Internship)
# ============================================================
#
# Context:
# Developed during the IBM SkillBuild Winter Internship
# as a learning-focused agentic AI system.
#
# Problem Statement:
# Students and beginners need quick, clear explanations
# of AI-related concepts without searching multiple resources.
#
# Objectives:
# 1. Build a functional AI chatbot using Python
# 2. Demonstrate agent-like behavior through context memory
# 3. Handle follow-up questions naturally
# 4. Implement multi-level explanation control
# 5. Build a clean decision-making workflow without ML libraries
#
# Tools & Technologies:
# - Python
# - Google Colab
# - Rule-based logic
# - Basic NLP (text normalization + keyword matching)
#
# ============================================================
# V1 ARCHITECTURE & FLOW
# ============================================================
#
# 1. User enters a query
# 2. Input is normalized (lowercasing, trimming)
# 3. User intent is detected
# 4. Topic is identified or retrieved from memory
# 5. Explanation depth is resolved (BASIC / DETAILED)
# 6. Conversation memory is updated
# 7. Response is generated using intent + topic + memory
# 8. Agent continues until the user exits
#
# ============================================================
# LAYER 1 — Input Handling & Basic NLP
# ============================================================
# - Accepts raw user text input
# - Normalizes text (lowercase, whitespace removal)
# - Matches keywords for intent, topic, and depth detection
# - No external NLP libraries — lightweight and explainable
#
# ============================================================
# LAYER 2 — Intent Detection
# ============================================================
# Identifies the purpose of the user's input using
# rule-based keyword matching.
#
# Supported Intents:
# - GREETING       : User greets the chatbot
# - ASK_DEFINITION : User asks for a definition or explanation
# - FOLLOW_UP      : User asks a continuation question
# - RESET          : User wants to clear memory
# - EXIT           : User wants to end the session
# - UNKNOWN        : Intent cannot be clearly identified
#
# Intent Priority Order:
# EXIT > RESET > GREETING > ASK_DEFINITION > FOLLOW_UP > UNKNOWN
#
# ============================================================
# LAYER 3 — Topic Detection
# ============================================================
# Identifies the discussion topic using keyword matching.
# Supported topics: AI / ML / DL / Neural Networks
#
# If no topic is explicitly mentioned, falls back to
# the last known topic stored in memory.
#
# ============================================================
# LAYER 4 — Conversation Memory (Agent State)
# ============================================================
# Lightweight in-memory state enabling context-aware
# and agent-like conversations.
#
# Memory Fields:
# - last_topic  : Current discussion topic
# - last_intent : Most recent user intent
# - last_depth  : Explanation depth (BASIC / DETAILED)
#
# Enables:
# - Follow-up question handling
# - Topic continuity across turns
# - Default depth policy application
#
# ============================================================
# LAYER 5 — Explanation Depth Policy
# ============================================================
# Multi-level explanation control:
#
# - BASIC    : High-level, beginner-friendly explanation
# - DETAILED : Structured and in-depth explanation
#
# Default Depth Policy:
# - New topic           → BASIC (safe default)
# - Explicit depth word → Override memory
# - No depth mentioned  → Reuse previous depth
#
# ============================================================
# LAYER 6 — Topic Switching Utility
# ============================================================
# Switches the active topic during a conversation.
# Automatically resets explanation depth to BASIC
# when a new topic is detected — ensures safe,
# beginner-friendly entry point for every topic.
#
# ============================================================
# LAYER 7 — UNKNOWN Intent Handling
# ============================================================
# Graceful failure logic when intent/topic is unclear.
#
# Covers:
# - No topic mentioned and no memory
# - Unsupported domain detected (blockchain, IoT, cloud, web)
# - Vague or very short queries (< 3 words)
# - Generic fallback for all other cases
#
# ============================================================
# LAYER 8 — Memory Reset Utility
# ============================================================
# Clears the entire conversation memory.
# Triggered by explicit RESET intent or on EXIT.
#
# ============================================================
# LAYER 9 — Central Agent Brain (Decision Engine)
# ============================================================
# Coordinates the complete agent workflow:
#
# Step 1 → Detect intent and topic
# Step 2 → Handle EXIT intent
# Step 3 → Handle RESET intent
# Step 4 → Handle UNKNOWN intent early
# Step 5 → Update memory safely based on intent
# Step 6 → Resolve explanation depth
# Step 7 → Generate response
# Step 8 → Fallback safely if response fails
#
# This function simulates agent-like reasoning by combining
# current input with stored context — the core of the system.
#
# ============================================================
# LAYER 10 — Chatbot Execution Loop
# ============================================================
# Starts the interactive terminal session.
# Handles:
# - User input validation
# - EXIT flow with confirmation
# - RESET flow with memory wipe
# - Continuous conversation loop
#
# ============================================================
# V1 DECISION LOGIC NOTE
# ============================================================
# Rule-based approach chosen intentionally to:
# - Keep the system transparent and explainable
# - Focus on agent design and reasoning patterns
# - Avoid dependency on external ML libraries
#
# The chatbot always prioritizes:
# EXIT > RESET > GREETING > ASK_DEFINITION > FOLLOW_UP > UNKNOWN


# ============================================================
# ██╗   ██╗ ██████╗
# ██║   ██║ ╚════██╗
# ██║   ██║  █████╔╝
# ╚██╗ ██╔╝ ██╔═══╝
#  ╚████╔╝  ███████╗
#   ╚═══╝   ╚══════╝
# ============================================================
# VERSION 2 — Modular NLP Refactor
# ============================================================
#
# What changed from V1:
# - Monolithic script split into dedicated modules
# - Cleaner separation of concerns
# - Improved topic detection (word/phrase split fix)
# - More robust follow-up and topic switching logic
# - Fully reusable NLP layer
#
# New File Structure:
# ├── chatbot_engine/
# │   ├── engine.py            ← Central brain() function
# │   └── agent.py             ← Response generation
# ├── memory/
# │   └── memory_manager.py    ← Memory dict + helpers
# └── nlp/
#     ├── intent_detection.py  ← Intent classification
#     └── topic_detection.py   ← Topic classification
#
# V2 Additions:
# - context-aware conversation memory (persistent across turns)
# - Topic switching with automatic depth reset
# - Memory reset functionality (RESET intent)
# - Multi-level explanation control (BASIC / DETAILED)
# - Robust UNKNOWN intent handling with 4 fallback cases
#
# V2 Status: COMPLETE — Terminal version, no frontend


# ============================================================
# ██╗   ██╗ ██████╗
# ██║   ██║ ╚════██╗
# ██║   ██║  █████╔╝
# ╚██╗ ██╔╝  ╚═══██╗
#  ╚████╔╝  ██████╔╝
#   ╚═══╝   ╚═════╝
# ============================================================
# VERSION 3 — Full Stack Web Application (CURRENT / COMPLETE)
# ============================================================
#
# What changed from V2:
# - Gemini 2.5 Flash replaces rule-based responses
# - Flask API replaces terminal loop
# - SQLite database replaces in-memory state
# - Full 7-page glassmorphism frontend replaces terminal UI
# - Auth, sessions, profiles, membership all added
#
# ============================================================
# V3 COMPLETE ARCHITECTURE
# ============================================================
#
# REQUEST FLOW:
#
# Browser (Frontend)
#     │  POST /api/chat  {message, chat_id}
#     ▼
# app.py (Flask Route)
#     │  1. Check membership limit
#     │  2. Load message history from SQLite
#     │  3. Call brain(user_input, history)
#     │  4. Save user + assistant messages to DB
#     │  5. Increment message count
#     ▼
# engine.py — brain()
#     │  Intent detection → topic detection → depth resolution
#     │  Memory update → route to agent
#     ▼
# agent.py — ask_agent()
#     │  Build structured prompt (intent + topic + depth)
#     │  Inject full conversation history
#     ▼
# Gemini 2.5 Flash API
#     │  Returns response text
#     ▼
# app.py → jsonify({"response": ...})
#     ▼
# script.js → render response bubble in UI
#
# ============================================================
# V3 DATABASE SCHEMA (5 Tables)
# ============================================================
#
# users
#   user_id, username, email, password_hash,
#   plan (basic/pro), message_count, created_at
#
# profiles
#   user_id → users, display_name, bio, avatar_url
#
# chat_rooms
#   chat_id, user_id → users, title, system_prompt,
#   is_deleted (soft delete), created_at, updated_at
#
# messages
#   message_id, chat_id → chat_rooms,
#   role (user/assistant), content, timestamp
#
# feedback
#   feedback_id, message_id → messages,
#   user_id → users, rating (thumbs_up/thumbs_down), created_at
#
# Indexes:
#   idx_rooms_user_updated → chat_rooms(user_id, is_deleted, updated_at DESC)
#   idx_messages_chat      → messages(chat_id, timestamp ASC)
#
# Trigger:
#   auto_update_chat_room_time → bumps updated_at on every INSERT into messages
#
# ============================================================
# V3 BACKEND MODULES
# ============================================================
#
# database.py
#   - init_db()      : runs schema.sql on startup
#   - get_db()       : returns connection with row_factory + PRAGMA
#   - generate_id()  : returns UUID string
#
# auth.py
#   - register_user(username, email, password)
#     → hashes password, inserts user + profile, returns user_id
#   - login_user(email, password)
#     → verifies hash, returns user_id + username
#
# chat.py
#   - create_chat_room(user_id, title)
#   - get_user_chats(user_id)       → active chats, sorted by updated_at DESC
#   - get_messages(chat_id)         → full history, sorted by timestamp ASC
#   - save_message(chat_id, role, content)
#   - delete_chat(chat_id)          → soft delete (is_deleted = 1)
#   - rename_chat(chat_id, title)
#
# profile.py
#   - get_profile(user_id)
#   - update_profile(user_id, display_name, bio, avatar_url)
#     → partial updates supported (None fields skipped)
#
# membership.py
#   - PLANS = { 'basic': 20, 'pro': float('inf') }
#   - check_limit(user_id)          → returns allowed + remaining
#   - increment_message_count(user_id)
#   - upgrade_plan(user_id, plan)
#
# ============================================================
# V3 API ROUTES (app.py)
# ============================================================
#
# POST /api/register          → register_user()
# POST /api/login             → login_user() + set session
# POST /api/logout            → session.clear()
# GET  /api/profile           → get_profile(session user_id)
# POST /api/profile/update    → update_profile()
# POST /api/chats/new         → create_chat_room()
# GET  /api/chats             → get_user_chats()
# GET  /api/chats/<id>/messages → get_messages()
# POST /api/chats/<id>/rename → rename_chat()
# POST /api/chats/<id>/delete → delete_chat()
# POST /api/chat              → full message pipeline
#
# Static serving:
# GET  /                      → index.html
# GET  /<filename>            → frontend/html/
# GET  /js/<filename>         → frontend/js/
# GET  /css/<filename>        → frontend/css/
#
# ============================================================
# V3 FRONTEND (Modular UI Refactor)
# ============================================================
#
# Pages (frontend/html/):
# index.html    → Landing page (hero, pricing, features)
# chat.html     → Main chat interface (auth-protected)
# login.html    → Login page
# register.html → Dedicated registration page
# profile.html  → User profile management
# docs.html     → In-app documentation
# contact.html  → Contact form + social links
# terms.html    → Terms of service
# recovery.html → Forgot password page (UI placeholder)
#
# Modular CSS (frontend/css/):
# main.css       → Design tokens, dark/light themes, typography
# animations.css → Keyframes and reusable motion
# chat.css       → Chat layout, message bubbles
# index.css      → Legacy page styles
#
# Modular JS (frontend/js/):
# nav.js         → Injects shared navbar on marketing pages
# theme.js       → Dark/light toggle with localStorage
# auth.js        → Login/register forms + API validation
# chat.js        → Chat sessions, messaging, markdown rendering
# animations.js  → GSAP page load, scroll reveals, particles
# toast.js       → Global toast notifications
# cursor.js      → Custom accent-colored cursor glow
# protect.js     → Auth guard for protected routes
#
# Key Frontend Tech:
# - Tailwind CSS (CDN)
# - GSAP (Animations)
# - marked.js + DOMPurify (Safe Markdown rendering)
# - Lucide Icons
#
# ============================================================
# V3 KEY TECHNICAL DECISIONS
# ============================================================
#
# Modular Frontend Architecture
#   → Removed monolithic script.js/style tags. Extracted to modular 
#     assets for maintainability and caching.
#
# CDN-Based Tooling
#   → Uses Tailwind, GSAP, and markdown parsers via CDN to avoid
#     Node.js or complex bundler pipelines. 
#
# Flask Sessions (not JWT)
#   → Simpler for portfolio scope, no token management needed
#
# SQLite (not MySQL/PostgreSQL)
#   → Zero config, file-based, perfect for local portfolio project
#
# Soft Delete (is_deleted flag)
#   → Data preserved, no orphan risk, reversible
#
# Flask serving frontend (not separate dev server)
#   → Eliminates CORS entirely, single run command
#
# /api/ prefix on all API routes
#   → Prevents conflict with catch-all static file route
#
# UUID as TEXT primary key
#   → No auto-increment collision risk, globally unique
#
# ============================================================
# V3 STATUS: COMPLETE & DEPLOYED
# ============================================================
#
# Repo:    https://github.com/ankush-poonia007/AI-Chatbot-Agentic-AI-NLP
# Live:    https://ai-chatbot-agentic-ai-nlp.onrender.com
# Run:     python app.py
# Access:  http://127.0.0.1:5000
#
# Planned V4:
# - Align legacy pages (profile, docs, contact) with new design system
# - RAG with ChromaDB / FAISS
# - Real-time streaming responses (SSE)
# - Admin dashboard
# - OAuth login (Google)
#
# ============================================================