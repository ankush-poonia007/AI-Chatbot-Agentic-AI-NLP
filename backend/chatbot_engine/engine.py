from backend.memory.memory_manager import memory, update_memory, reset_memory
from backend.nlp.intent_detection import detect_intent
from backend.nlp.topic_detection import detect_topic
from backend.chatbot_engine.agent import ask_agent


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

    BASIC = [ "overview", "summary", "fundamental", "essence", "core", "concept", "high-level", "snapshot","plain language", "non-technical", "concise", "single paragraph", "jargon-free", "brief","basic"
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
    if detect_topic(user_question, memory ) is None:
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


def brain( user_question , history = [] ):
    

    # Step 1 just detect intent and topic
    intent = detect_intent(user_question)
    topic = detect_topic(user_question, memory )
    # print(f"DEBUG → intent: {intent}, topic: {topic}")
    
    
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


    # Step 6 Generate response using agent
    
    response = ask_agent(user_question , memory["last_intent"], memory["last_topic"], memory["last_depth"], history)
    if response:
        return response
    
    # Fallback Safely
    return "I'm here to help. Try asking about AI, ML, DL, or Neural Networks."


