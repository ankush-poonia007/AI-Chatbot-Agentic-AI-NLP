from backend.chatbot_engine.engine import brain
from backend.memory.memory_manager import reset_memory

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
