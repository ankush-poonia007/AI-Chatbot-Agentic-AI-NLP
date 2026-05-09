from backend.chatbot_engine.engine import brain
from backend.memory.memory_manager import reset_memory
# ============================================================
# Project: AI Chatbot – Agentic AI (Rule-Based + Basic NLP)
# Version: 2.0 (Completed)
# Author: Ankush Poonia
#
# Internship Context:
# Developed during the IBM SkillBuild Winter Internship
# as a learning-focused agentic AI system.
#
# ============================================================

# ============================================================
# Project Overview
# ============================================================
# This project implements a rule-based AI Chatbot / Q&A Agent
# that answers foundational questions related to:
# - Artificial Intelligence (AI)
# - Machine Learning (ML)
# - Deep Learning (DL)
# - Neural Networks (NL)
#
# The chatbot demonstrates agentic behavior by maintaining
# conversation context, handling follow-ups, and adapting
# explanation depth based on user intent.
# ============================================================

# ===============================================================
# Problem Statement
# ===============================================================
# Students and beginners often need quick, clear explanations
# of AI-related concepts. Searching across multiple resources
# can be time-consuming and confusing.
#
# This chatbot provides instant, structured answers using
# a lightweight, explainable, and rule-based approach.
# ===============================================================

# ===============================================================
# Project Objectives
# ===============================================================
# 1. Design and build a functional AI chatbot using Python
# 2. Demonstrate agent-like behavior through context memory
# 3. Handle follow-up questions naturally
# 4. Implement multi-level explanation control
# 5. Build a clean decision-making workflow without ML libraries
# ===============================================================

# ===============================================================
# Tools & Technologies Used
# ===============================================================
# - Python
# - Google Colab (development environment)
# - Rule-based logic
# - Basic NLP techniques (text normalization & keyword matching)
# ==============================================================

# ==============================================================
# AI Chatbot Architecture & Flow
# ==============================================================
# The chatbot follows an agentic decision workflow:
#
# 1. User enters a query
# 2. Input is normalized (lowercasing, trimming)
# 3. User intent is detected
# 4. Topic is identified or retrieved from memory
# 5. Explanation depth is resolved (BASIC / DETAILED)
# 6. Conversation memory is updated
# 7. Response is generated using intent + topic + memory
# 8. The agent continues until the user exits
# ============================================================

# ============================================================
# Decision Logic Design
# ============================================================
# The chatbot uses rule-based decision logic rather than
# machine learning models.
#
# This approach was chosen intentionally to:
# - Keep the system transparent and explainable
# - Focus on agent design and reasoning
# - Avoid dependency on external libraries
#
# The chatbot always prioritizes:
# EXIT > RESET > GREETING > ASK_DEFINITION > FOLLOW_UP > UNKNOWN
# ===============================================================

# ===============================================================
# Intent Detection Layer
# ===============================================================
# Intent detection identifies the purpose of the user input.
#
# Supported Intents:
# - GREETING       : User greets the chatbot
# - ASK_DEFINITION : User asks for a definition or explanation
# - FOLLOW_UP      : User asks a continuation question
# - UNKNOWN        : Intent cannot be clearly identified
#
# Intent detection is performed using keyword-based rules.
# =============================================================

# ============================================================
# Conversation Memory (Agent State)
# ============================================================
# The chatbot maintains lightweight memory to enable
# context-aware and agent-like conversations.
#
# Memory Fields:
# - last_topic  : Current discussion topic (AI / ML / DL / NL)
# - last_intent : Most recent user intent
# - last_depth  : Explanation depth (BASIC / DETAILED)
#
# This memory allows the chatbot to:
# - Handle follow-up questions
# - Maintain topic continuity
# - Apply default depth policies
# ============================================================

# ============================================================
# Explanation Depth Policy (Version 2 Feature)
# ============================================================
# The chatbot supports multi-level explanations:
#
# - BASIC    : High-level, beginner-friendly explanation
# - DETAILED : Structured and in-depth explanation
#
# Default Depth Policy:
# - New topic           → BASIC
# - Explicit depth word → Override depth
# - No depth mentioned  → Reuse previous depth
# ============================================================

# ============================================================
# Input Handling & Basic NLP
# ============================================================
# The chatbot uses lightweight NLP techniques to process input:
#
# - Accepts user text input
# - Normalizes text (lowercase, whitespace removal)
# - Matches keywords for intent, topic, and depth detection
#
# This keeps the system simple while still effective.
# ============================================================

# ============================================================
# UNKNOWN Intent Handling
# ============================================================
# When the chatbot cannot confidently understand the input,
# it uses rule-based fallback logic to:
# - Ask for clarification
# - Identify unsupported topics
# - Handle vague or incomplete queries
#
# This ensures graceful failure instead of incorrect responses.
# ============================================================

# ============================================================
# Version Notes
# ============================================================
# Version 2.0 (Completed):
# - Context-aware conversation memory
# - Topic switching support
# - Memory reset functionality
# - Multi-level explanation control
# - Robust UNKNOWN intent handling
#
# Future Versions (Planned):
# - Conversation history logging
# - Improved spell tolerance
# - NLP/ML-based intent classification
# - Web or GUI interface
#
# ============================================================



# ============================================================
# Chatbot Execution Loop
# ============================================================
# Starts the interactive chatbot session.
# Handles:
# - User input validation
# - Exit flow
# - Memory reset confirmation
# ============================================================

def main():
    print("AI Chatbot Agent Started Successfully!")
    print("You can exit the Chatbot when you want.\n")
    print("Type your question below:\n")

    while True:
        user_question = input("You: ").lower().strip()


        if not user_question:
            print("Entered Wrong input")
            continue

        response = brain(user_question)

        # EXIT intent handling
        if response == "EXIT":
            print("Bot: Goodbye! Have a great day 😊")
            reset_memory()
            break
        
        

        if response == "RESET":
            print("""Please Enter "Confirm" to Reset the Memory""")
            user = input("You: ")
            user = user.lower()
            if user == "confirm":
                reset_memory()
                response = "Memory Reset Successfully!!"
            else:
                response = "Memory Reset Failed!!"
        print("Bot:", response)

# Starting the Chatbox
main()


# ============================================================
# Version Notes
# ============================================================
# Version 2.0 (Completed):
# - Context-aware conversation memory
# - Topic switching support
# - Memory reset functionality
# - Multi-level explanation control
# - Robust UNKNOWN intent handling
#
# Version 3.0 (Planned):
# - Conversation history logging
# - Improved spell tolerance
# - NLP/ML-based intent classification
# - Web or GUI interface
# ============================================================
