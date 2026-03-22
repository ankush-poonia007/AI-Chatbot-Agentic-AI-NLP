
# Context-Aware Modular AI Chatbot
 
> *Built without black-box API dependency — custom state management from scratch.*
 
## The Problem I Was Solving
 
Most chatbot tutorials rely on external frameworks to abstract away the
hard parts. You end up with working code but no understanding of what's
actually happening under the hood. I wanted to build a chatbot where
I understood every single layer.
 
## What I Built
 
A Python-based conversational agent with:
- Custom multi-turn context tracking (no framework dependency)
- Intent detection built manually
- Topic-switching logic handled programmatically
- Modular architecture for easy upgrades
 
## Key Technical Decision
 
Instead of using a framework to manage conversation state, I implemented
it myself using Python dictionaries. This forced me to understand exactly
how context flows between turns — which is the foundation for everything
I'm now building in NeuraLog.
 
## Tech Stack
 
- Python
- Basic NLP (NLTK / custom rule-based)
- Custom state management
- Agentic AI approach
 
## What I'd Do Differently Now
 
This project was built before I understood GraphRAG and proper memory
architecture. NeuraLog is the direct evolution of ideas prototyped here.
 
## Setup
 
git clone https://github.com/ankush-poonia007/AI-Chatbot-Agentic-AI-NLP
cd AI-Chatbot-Agentic-AI-NLP
pip install -r requirements.txt
python main.py
 
 