
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

# def resolve_topic():
#   
#   return memory["last_topic"]



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


def update_memory ( intent , topic , depth ):
    memory["last_topic"] = topic
    memory["last_intent"] = intent
    memory["last_depth"] = depth
    return
