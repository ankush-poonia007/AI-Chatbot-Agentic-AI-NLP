

# ============================================================
# Topic Detection Layer
# ============================================================
# Identifies the discussion topic using keyword matching.
# If no topic is explicitly mentioned, the chatbot
# falls back to the topic stored in memory.
# ============================================================


def detect_topic( user_question , memory ):
    
    user_question = user_question.strip().lower()
    

    AI_WORDS = ["ai"]
    AI_PHRASES = ["artificial intelligence"]

    ML_WORDS = ["ml"]
    ML_PHRASES = ["machine learning"]

    DL_WORDS = ["dl"]
    DL_PHRASES = ["deep learning"]

    NL_WORDS = ["nl"]
    NL_PHRASES = ["neural network"]

    input_words = user_question.split()

    is_AI_present = any(w in input_words for w in AI_WORDS) or any(p in user_question for p in AI_PHRASES)
    is_ML_present = any(w in input_words for w in ML_WORDS) or any(p in user_question for p in ML_PHRASES)
    is_DL_present = any(w in input_words for w in DL_WORDS) or any(p in user_question for p in DL_PHRASES)
    is_NL_present = any(w in input_words for w in NL_WORDS) or any(p in user_question for p in NL_PHRASES)



    if  is_AI_present:
      return "AI"

    elif is_ML_present:
      return "ML"

    elif is_DL_present:
      return "DL"

    elif is_NL_present:
      return "NL"

    else:
      # no topic mentioned so we use memory to find the topic
      return memory["last_topic"]
  

