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


memory = {
    "last_topic":None,
    "last_intent":None,
    "last_depth":None
}

# ============================================================
# Topic Resolution Utility
# ============================================================
# Returns the last known topic from memory.
# Used when the user asks follow-up questions
# without explicitly mentioning a topic.
# ============================================================

def resolve_topic():
    
    return memory["last_topic"]



# ============================================================
# Memory Reset Utility
# ============================================================
# Clears the entire conversation memory.
# Used when the user explicitly requests a reset
# or when the chatbot exits.
# ============================================================

def reset_memory():
   memory["last_intent"] = None
   memory["last_topic"] = None
   memory["last_depth"] = None
   return 

# ============================================================
# Topic Switching Utility
# ============================================================
# Switches the active topic during a conversation.
# Automatically resets explanation depth to BASIC
# to ensure safe and beginner-friendly responses
# for new topics.
# ============================================================


def switch_topic( intent, topic ):
    memory["last_intent"] = intent
    memory["last_topic"] = topic
    memory["last_depth"] = "BASIC"
    return 
    

# ============================================================
# Explanation Depth Detection
# ============================================================
# Determines the level of explanation requested
# by the user.
#
# Depth Levels:
# - BASIC    : High-level, beginner-friendly explanation
# - DETAILED : Structured, in-depth explanation
#
# If no depth keyword is detected, the chatbot
# reuses the last known depth from memory.
# ============================================================


def quetion_level ( user_question ):

    BASIC = [ "overview", "summary", "fundamental", "essence", "core" "concept", "high-level", "snapshot","plain language", "non-technical", "concise", "single paragraph", "jargon-free", "brief",
             "basic"
    ]

    DETAILED = ["structure", "framework", "components", "process", "use-cases", "applications", "workflow", "departmental","in detail"
    ]

    if any ( word in user_question for word in BASIC ):
        return "BASIC"
            
    elif any ( word in user_question for word in DETAILED ):
        return "DETAILED"
    




# ============================================================
# UNKNOWN Intent Handling
# ============================================================
# Handles cases where the chatbot cannot confidently
# determine user intent or topic.
#
# Covers:
# - Missing or unclear topics
# - Unsupported domains
# - Very short or vague queries
#
# Ensures graceful failure instead of incorrect responses.
# ============================================================

def handle_unknown(user_question):
    # Known topics keywords
    known_topic = [
        "ai", "artificial intelligence",
        "ml", "machine learning",
        "dl", "deep learning",
        "neural", "network"
    ]

    # Case 1: No topic mentioned and no memory
    if detect_topic(user_question) is None:
        return (
            "I’m not sure which topic you’re referring to.\n"
            "You can ask about AI, ML, DL, or Neural Networks."
        )

    # Case 2: Topic-like word present but unsupported
    if any(word in user_question for word in ["blockchain", "iot", "cloud", "web"]):
        return (
            "That topic is currently outside my scope.\n"
            "I can help with AI, ML, DL, and Neural Networks for now."
        )

    # Case 3: Vague question
    if len(user_question.split()) < 3:
        return (
            "Could you please clarify your question a bit more?\n"
            "For example: 'What is AI?' or 'Explain ML in detail.'"
        )

    # Case 4: Generic fallback
    return (
        "I couldn’t fully understand your request.\n"
        "Try asking a clearer question related to AI, ML, DL, or Neural Networks."
    )




# ============================================================
# Intent Detection Layer
# ============================================================
# Identifies the purpose of the user's input using
# rule-based keyword matching.
#
# Supported Intents:
# - GREETING
# - ASK_DEFINITION
# - FOLLOW_UP
# - RESET
# - EXIT
# - UNKNOWN
#
# Intent Priority Order:
# EXIT > RESET > GREETING > ASK_DEFINITION > FOLLOW_UP > UNKNOWN
# ============================================================


def detect_intent( user_input ):

    # user_input = user_input.strip()

    GREETING_LIST = [
        "hello", "hi", "hey", "good morning", "morning",
        "how are you", "how's it going", "what's up", "sup"
    ]

    ASK_DEFINITION = [
        "what is", "define", "explain", "meaning of"
    ]

    FOLLOW_UP = [
        "tell me more", "give an example", "example",
        "explain again", "elaborate", "explain more", "need more details",
        "more about","some information","information","info"
    ]

    EXIT_LIST = ["bye", "exit", "quit", "stop", "end","stop texting","take care",
                 "continue later","see you tomorrow"
    ]

    RESET_MEMORY = ["reset memory","clear memory","clear all data","clear data","forget"]


    

    if any(word in user_input for word in EXIT_LIST ):
        return "EXIT"

    if any(word in user_input for word in RESET_MEMORY ):
        return "RESET"

    if any(word in user_input for word in GREETING_LIST ):
        return "GREETING"

    if any(word in user_input for word in ASK_DEFINITION ):
        return "ASK_DEFINITION"

    if any(word in user_input for word in FOLLOW_UP ):
        return "FOLLOW_UP"
    
    return "UNKNOWN"
        
     

# ============================================================
# Topic Detection Layer
# ============================================================
# Identifies the discussion topic using keyword matching.
# If no topic is explicitly mentioned, the chatbot
# falls back to the topic stored in memory.
# ============================================================


def detect_topic( user_question ):

    AI_list = ["artificial intelligence","ai"]
    ML_list = ["machine learning","ml"]
    DL_list = ["deep learning","dl"]
    NL_list = ["neural network","nl"]



    # Checking for the presence of the ruled Keyword:
    is_AI_present = any ( word in user_question for word in AI_list)
    is_ML_present = any ( word in user_question for word in ML_list)
    is_DL_present = any ( word in user_question for word in DL_list)
    is_NL_present = any ( word in user_question for word in NL_list)




    if  is_AI_present:
      return "AI"

    elif is_ML_present:
      return "ML"

    elif is_DL_present:
      return "DL"

    elif is_NL_present:
      return "NL"

    else:
      # no topic mentioned so we use memeory to find the topic
      return resolve_topic()



# ============================================================
# Central Agent Brain (Decision Engine)
# ============================================================
# Coordinates the complete agent workflow:
# - Intent detection
# - Topic detection
# - Explanation depth resolution
# - Memory updates
# - Response generation
#
# This function simulates agent-like reasoning
# by combining current input with stored context.
# ============================================================


def brain( user_question ):
    

    # Step 1 just detect intent and topic
    intent = detect_intent(user_question)
    topic = detect_topic(user_question)

    # step 2 Identifying the exit intent
    if intent == "EXIT":
      return "EXIT"


    # Step 2 RESET MEMORY ( v2 )
    if intent == "RESET":
       return "RESET"
       

    # Step 4 handle UNKNOWN early
    if intent == "UNKNOWN":
        return handle_unknown(user_question)



    # Step 5 update memory safely( intent based )
    if( intent == "ASK_DEFINITION"):
        if ( topic != None):
            # Checks if the topic is changed or not 
            if topic != memory["last_topic"]:
                switch_topic(intent, topic)
            else:
            
                # If the topic is same as previous one 
                memory["last_intent"] = intent 
        else:
            memory["last_intent"] = intent


    elif intent == "FOLLOW_UP":
        if ( topic != None):
            # Checks if the topic is changed or not 
            if topic != memory["last_topic"]:
               switch_topic(intent, topic)

            else:
            # FOLLOW_UP uses existing topic, does NOT overwrite it
                memory["last_intent"] = intent
        else:
            memory["last_intent"] = intent
        

    elif intent == "GREETING":
      
        # Greeting does not change memory
        return "Hello! How can I assist you today?"

    if memory["last_topic"] == None:
        return "Could you clarify what topic you want me to continue with?"


    # Explanation Depth Policy:
    # - New topic           → BASIC (default)
    # - Explicit depth word → Override memory
    # - No depth mentioned  → Reuse last depth from memory

    depth = quetion_level( user_question )

    if depth == None:
        depth = memory["last_depth"]
    else:
        memory["last_depth"] = depth


    # Step 5 generate responses using memory
    if memory["last_intent"] == "ASK_DEFINITION" :

        if memory["last_topic"] == "AI":

            if depth == "DETAILED":
                return (
                    """"Artificial Intelligence is a broad framework composed of specialized sub-fields designed to automate complex tasks. Its structure involves data processing, logic-based reasoning, and autonomous execution. Common use-cases include real-time data analysis, predictive modeling in business, and the management of autonomous hardware systems."""
                )
            
            # Default BASIC depth 
            else : 
                return ("""Artificial Intelligence (AI) is a branch of computer science 
                        dedicated to building software and systems that mimic human cognitive functions. It focuses on the primary goal of enabling machines to perform reasoning, problem-solving, and decision-making tasks that traditionally required a human mind.""")



        elif memory["last_topic"] == "ML":

            if depth == "DETAILED":
                return (
                    """"Machine Learning is a data-driven process that enables systems to adapt their performance through iterative learning. The components include a training phase where data is ingested and a general logic model is developed for future predictions. It is essential for use-cases where variables change frequently, allowing systems to remain accurate without manual reprogramming."""
                )
            
            else:
                return ("""Machine Learning is a specific area of AI focused on creating systems that improve their own accuracy over time by analyzing data. Instead of following rigid, pre-written instructions, the system develops its own logic based on the patterns it identifies in the information provided.""")
                
            



        elif memory["last_topic"] == "DL" :

            if depth == "DETAILED":
                return (
                    """"Deep Learning is an advanced hierarchical framework that uses "deep" neural architectures to handle unstructured data. It is structured to perform feature extraction automatically, moving from simple to complex layers of understanding. Its primary use-cases involve high-dimensional data environments like computer vision and automated signal processing."""
                )
            
            else:
                return ("""Deep Learning is a specialized type of Machine Learning that utilizes multi-layered neural networks to process data. By stacking these layers, the system can identify and interpret increasingly complex patterns and abstract features without human intervention.""")
            



        elif memory["last_topic"]  == "NL" :

            if depth == "DETAILED":
                return (
                    """"Neural Networks serve as the structural foundation for modern pattern recognition, consisting of input, hidden, and output layers. The system functions by passing data through interconnected nodes that adjust based on the information received. They are primarily applied in fields requiring high-accuracy classification and sensory data processing."""
                )
            else:
                return ("""A Neural Network is a computational model designed after the biological structure of the human brain, consisting of interconnected nodes. These digital neurons work together to recognize underlying relationships and patterns within a set of information through a learning process.""")


    elif memory["last_intent"] == "FOLLOW_UP":
        
        if memory["last_topic"] == "AI":

            if depth == "BASIC":
                return ("""AI technology is integrated into modern digital environments to enhance efficiency and automate user interactions. It serves as the underlying engine for many smart services used in daily life.""")
            
            elif depth == "DETAILED":
                return (
                    """"AI systems are structured to handle high-volume interactions and logistical planning. Key components include natural language processing for interfaces and predictive algorithms for navigation. Use-cases range from conversational chatbots and personalized recommendation engines to the complex safety systems in self-driving vehicles."""
                )
            
            else:
                return "Used for automated tools like chatbots and navigation."
            


        elif memory["last_topic"] == "ML":

            if depth == "BASIC":
                return ("""	Machine Learning is applied to sorting and filtering tasks where the system must distinguish between different types of digital content. It automates the process of organizing information based on learned characteristics.""")
            
            elif depth == "DETAILED":
                return (
                    """"Machine Learning workflows are used to automate classification and filtering processes by recognizing historical patterns. A primary use-case is security-based filtering, such as spam detection, where the model analyzes incoming data to separate valid information from unwanted content based on learned indicators."""
                )
            
            else:
                return "Used for automated filtering tasks like spam detection."
            


        elif memory["last_topic"] == "DL":

            if depth == "BASIC":
                return ("""Deep Learning is the primary technology used for interpreting complex sensory data like sounds and visuals. It allows machines to understand and categorize sensory inputs with high precision.""")
            
            elif depth == "DETAILED":
                return (
                    """"Deep Learning frameworks are specialized for processing multi-dimensional inputs such as audio frequencies and pixel data. This logic-based structure is essential for modern recognition systems. Key applications include automated image identification and the processing of human speech in voice-controlled environments."""
                )
            
            else:
                return "Used for recognizing sounds and pictures."
            


        elif memory["last_topic"] == "NL":

            if depth == "BASIC":
                return ("""Neural Networks are utilized to identify specific markers in visual or written data to confirm identities or meanings. They excel at translating raw inputs into recognizable categories.""")
            
            elif depth == "DETAILED":
                return (
                    """"Neural Networks provide a rule-based approach to identifying unique features within complex datasets. The architecture is specifically tuned for identification tasks where subtle variations must be detected. Use-cases include facial recognition security, handwriting analysis for document digitizing, and real-time language translation services."""
                )
            else:
                return "Used for translating languages and identifying faces."

    # Fallback Safely
    return "I'm here to help. Try asking about AI, ML, DL, or Neural Networks."


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
