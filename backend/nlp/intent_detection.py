
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

    

    GREETING_WORDS = ["hello", "hi", "hey", "sup"
    ]
    
    GREETING_PHRASES = ["good morning", "morning", "how are you", "how's it going", "what's up"
    ]

    ASK_DEFINITION = [
        "what is", "define", "explain", "meaning of"
    ]

    FOLLOW_UP = [
        "tell me more", "give an example", "example",
        "explain again", "elaborate", "explain more", "need more details", "detail",
        "more about","some information","information","info"
    ]

    EXIT_WORDS = ["bye", "exit", "quit", "stop", "end"
    ]
    
    EXIT_PHRASES = ["stop texting", "take care", "continue later", "see you tomorrow"
    ]

    RESET_WORDS = ["forget"
    ]
    
    RESET_PHRASES = ["reset memory", "clear memory", "clear all data", "clear data"
    ]

    user_input = user_input.strip().lower()

    input_words = user_input.split()
    
    if any(word in input_words for word in EXIT_WORDS ):
        return "EXIT"
    
    if any(word in user_input for word in EXIT_PHRASES ):
        return "EXIT"

    if any(word in input_words for word in RESET_WORDS ):
        return "RESET"
    
    if any(word in user_input for word in RESET_PHRASES ):
        return "RESET"

    if any(word in input_words for word in GREETING_WORDS ):
        return "GREETING"

    if any (word in user_input for word in GREETING_PHRASES ):
        return "GREETING"
    
    if any(word in user_input for word in ASK_DEFINITION ):
        return "ASK_DEFINITION"

    if any(word in user_input for word in FOLLOW_UP ):
        return "FOLLOW_UP"
    
    return "UNKNOWN"
        
     
