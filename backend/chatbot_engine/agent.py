from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

client = genai.Client( api_key = os.getenv("GEMINI_API_KEY") )



def ask_agent( intent , topic , depth , history =[] ):
    
    system_prompt = f"""You are an AI tutor that explains AI/ML concepts clearly.
    The user wants a {depth} level explanation.
    Their intent is: {intent}
    The topic is: {topic}
    Respond accordingly in a clear, structured way suitable for a beginner to intermediate student."""

    contents =[]
    for msg in history:
        role = msg["role"]
        if role == "assistant":
            role = "model"
        contents.append( {
            "role": role,
            "parts": [ { "text": msg["content"]}]
        })

    contents.append( 
        {
            "role": "user",
            "parts": [
                { "text": system_prompt }
            ]
        }
    )

    response = client.models.generate_content(
        model = "gemini-2.5-flash",
        contents = contents
    )

    return response.text