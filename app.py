from flask import Flask, request, jsonify
from backend.chatbot_engine.engine import brain
from flask_cors import CORS



app = Flask ( __name__ )

CORS(app)

@app.route( '/chat', methods=['POST'] )
def chat():
    data = request.get_jason()
    user_input = data.get["message"]
    response = brain( user_input )
    return jasonify( { "response": response } )

if __name__ == "__main__":
    app.run( debug = True )
    
    
