# Version 1.0 – Initial implementation


# AI CHATBOT USING AGENTIC AI AND BASIC NLP WHICH I LEARND THROUGHT THE INTERSHIP AT IBM SKILLBUILD

# AI Chatbot / Q&A Agent
# IBM SKILLBUILD WINTER INTERNSHIP PROJECT
# NAME : ANKUSH POONIA

# + - + - + - + - Problem Statement - + - + - + - +

# Students often need quick answers to basic AI-related questions.
# This project builds an AI chatbot agent that provides instant, accurate responses using Python.

# + - + - + - + - Objective - + - + - + - +

# 1 Design and build a functional AI chatbot

# 2 Demonstrate AI agent behavior

# 3 Implement user interaction and automation

# + - + - + - + - Tools & Technologies - + - + - + - +

# 1 Python

# 2 Google Colab

# 3 Basic NLP / rule-based AI logic

# + - + - + - + - AI CHATBOT ARCHITECTURE & FLOW - + - + - + - +

# Updated AI Agent Workflow:

# 1. User enters a query
# 2. Input is normalized using basic NLP
# 3. Intent detection is performed
# 4. Topic is identified or retrieved from memory
# 5. Context memory is updated
# 6. Appropriate response is generated
# 7. Response is displayed to the user
# 8. Agent continues until exit command

# + - + - + - + - Decision Logic Design - + - + - + - +

# The Chatbot uses rule-bases decision logic to determine responses.
# It checks the user's input for specific keywords in a fixed order.

# Decison Rules:
# 1. If the input contains greeting words( hi, hello , how are you? etc....)
#   -> Respond with a greeting message.
# 2. If the input contains keywords related to Artificial Intelligence
#   -> Respond with an AI definition
# 3. If the inpur contains keyword related to Machine Learning
#   -> Respond with an ML definition
# 4. If the input contains keyword realated to Deep Learing or Neural Network
#   -> Respond with a DL or NL definition
# 5. If none of the above conditions match
#   -> Respond with a fallback message indicating the limited knowledge



# Updated Decision logic:
# - First detect user intent
# - Then identify topic ( is present )
# - If intent if FOLLOW_UP, use memory to determine topic
# - Generate response based on intent + Context

# + - + - + - + - Intent Detection Layer - + - + - + - +

# Intent detection identifies the purpose of thew user's input.
# The chatbot classifies input into predefined intent categories.

# Support Intents:
# 1. GREETING       ->  User greets the chatbot
# 2. ASK_DEFINITION ->  user asks for explanation or definition
# 3. FOLLOW_UP      ->  user asks a continuation question ( e.g., "tell me more")
# 4. UNKONWN        ->  Intent cannot be identified

# Intent is detected using simple rule-based pattern matching.

# + - + - + - + - Intent Detection Layer - + - + - + - +

# The chatbot maintains a simple memory to store conversation context.

# Memory Stores :
#  - last_topic : The most recent topic discussed ( AI / ML / NL / DL )
# -  last_intent: The most recent user intent

# Momory enables the chatbot to handel follow-up questions
# and provide contect - aware responses.

# + - + - + - + - Input Handing & Basic NLP - + - + - + - +

# The Chatbot Processes the user input using basic Natural Language Processing ( NLP ) steps.

# NLP Steps Used:
# 1. Accept text input from the user
# 2. Normalize the input from the user
# 3. Detect important keywords related to AI topic
# 4. Identifiy the user's intent based on keyword presence
# 5.Forward the processed input ro the decision

# + - + - + - + - AI Agent Workflow - + - + - + - +

# The AI Chatbot operates as an intelligent agent using the following workflow:

# 1. The user enters a query through the input interface
# 2. The chatbot receives the input and applies basic NLP preprocessing
# 3. The processed input is passed to the rule based decision logic
# 4. The chatbot selects the most appropriate response
# 5. The responses os displayed to the user
# 6. The agent continues interaction unitl the user choose to exit

# + - + - + - + - Conversation Memory - + - + - + - +

memory = {
    "last_topic":None,
    "last_intent":None
}

# Function to handel Memory Reset
def reset_memory():
   memory["last_intent"] = None
   memory["last_topic"] = None
   return 

# Funtion to Switch Topic in btw Conversation 
def switch_topic( intent, topic ):
    memory["last_intent"] = intent
    memory["last_topic"] = topic
    return 

# If no topic is given 
def resolve_topic():
    
    return memory["last_topic"]
    
# ----- Function for Intent Detection -----
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


    # is_greeting_present = any(word in user_input for word in GREETING_LIST)
    # is_ask_definition_present = any(word in user_input for word in ASK_DEFINITION)
    # is_follow_up_present = any(word in user_input for word in FOLLOW_UP)
    # is_exit_present = any(word in user_input for word in EXIT_LIST)
    # is_memory_reset = any(word in user_input for word in RESET_MEMORY)

    # if is_exit_present:
    #     return "EXIT"
    
    # if is_memory_reset:
    #    return "RESET"

    # if is_greeting_present:
    #     return "GREETING"
    
    # elif is_ask_definition_present:
    #     return "ASK_DEFINITION"
    
    # elif is_follow_up_present:
    #     return "FOLLOW_UP"
    
    # else:
    #     return "UNKNOWN"


# ----- Function for Topic Detection -----
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

# AI Agent Function Implementation ( BRAIN )
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
      return (
          "I can help with topics like AI, ML, DL, and Neural Networks\n"
          "Please ask a clear question such as 'what is AI?'"
          )


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

    if memory["last_topic"]==None:
        return "Could you clarify what topic you want me to continue with?"

    # Step 5 generate responses using memory

    if memory["last_intent"] == "ASK_DEFINITION" :

        if memory["last_topic"] == "AI":
            return (
                "Artificial Intelligence (AI) is the field of computer science "
                "that focuses on creating systems capable of performing tasks "
                "that normally require human intelligence."
            )

        elif memory["last_topic"] == "ML":
            return (
                "Machine Learning (ML) is a subset of AI that allows systems "
                "to learn from data and improve performance without being "
                "explicitly programmed."
            )

        elif memory["last_topic"] == "DL" :
            return (
                "Deep Learning (DL) is a subset of Machine Learning that uses "
                "multi-layer neural networks to learn complex patterns from data."
            )

        elif memory["last_topic"]  == "NL" :
            return (
                "A Neural Networks is a model inspired by the human brain, made "
                "of interconnected neurons that learn patterns from data."
            )

        # else :
        #     return ( "Please specify a topic like AI, ML, DL, or Neural Networks.")


    elif memory["last_intent"] == "FOLLOW_UP":
        
        if memory["last_topic"] == "AI":
            return "AI is widely used in areas like chatbots, recommendation systems, and self-driving cars."

        elif memory["last_topic"] == "ML":
            return "An example of ML is spam email detection, where models learn to classify emails automatically."

        elif memory["last_topic"] == "DL":
            return "Deep Learning is commonly used in image recognition and speech recognition systems."

        elif memory["last_topic"] == "NL":
            return "Neural Networks are used in facial recognition, handwriting recognition, and language translation."

        else:
            return "Could you clarify what topic you want me to continue with?"

    # fallback safely
    return "I'm here to help. Try asking about AI, ML, DL, or Neural Networks."

def start():
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
start()

# ----- Future Updates -----

# 1.Topic Switching Support                     ( Completed in v2 )
# 2.Memory Reset Command                        ( Completed in v2 )
# 3.Multi-Level Explanations
# 4.Input Validation & Spell Tolerance
# 5.Logging Conversation History
# 6.Exit Detection                              ( Completed in v2 )
# 7.Clear Intent Classification