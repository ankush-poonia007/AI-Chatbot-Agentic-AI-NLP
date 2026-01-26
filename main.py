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
    "last_intent":None,
    "last_depth":None
}

# Function to handel Memory Reset
def reset_memory():
   memory["last_intent"] = None
   memory["last_topic"] = None
   memory["last_depth"] = None
   return 

# Funtion to Switch Topic in btw Conversation 
def switch_topic( intent, topic ):
    memory["last_intent"] = intent
    memory["last_topic"] = topic
    memory["last_depth"] = "BASIC"
    return 

# If no topic is given 
def resolve_topic():
    
    return memory["last_topic"]
    


# ----- Funtion to handle UNKNOWN intent or  topic more efficiently 
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


# ----- Funtion to understand the level of question -----
#       level 0 : not mentioned 
#       level 1 : BASIC
#       level 2 : DETAILED 
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


    # Check for Depth of the Question 
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
                
            
            # else:
            #     return "Computers that learn from data to get better on their own."



        elif memory["last_topic"] == "DL" :

            if depth == "DETAILED":
                return (
                    """"Deep Learning is an advanced hierarchical framework that uses "deep" neural architectures to handle unstructured data. It is structured to perform feature extraction automatically, moving from simple to complex layers of understanding. Its primary use-cases involve high-dimensional data environments like computer vision and automated signal processing."""
                )
            
            else:
                return ("""Deep Learning is a specialized type of Machine Learning that utilizes multi-layered neural networks to process data. By stacking these layers, the system can identify and interpret increasingly complex patterns and abstract features without human intervention.""")
            
            # else:
            #     return "Advanced computer learning using many layers of data processing."



        elif memory["last_topic"]  == "NL" :

            if depth == "DETAILED":
                return (
                    """"Neural Networks serve as the structural foundation for modern pattern recognition, consisting of input, hidden, and output layers. The system functions by passing data through interconnected nodes that adjust based on the information received. They are primarily applied in fields requiring high-accuracy classification and sensory data processing."""
                )
            else:
                return ("""A Neural Network is a computational model designed after the biological structure of the human brain, consisting of interconnected nodes. These digital neurons work together to recognize underlying relationships and patterns within a set of information through a learning process.""")
            
            
            # else:
            #     return "Computer models that work like the human brain to find patterns."

        # else :
        #     return ( "Please specify a topic like AI, ML, DL, or Neural Networks.")


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

        # else:
        #     return "Could you clarify what topic you want me to continue with?"

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