# Flask Imports
from flask import Flask, request, jsonify
from flask import send_from_directory
from flask_cors import CORS
from flask import session
import os

# Core Engine Imports
from backend.chat import create_chat_room, get_user_chats, get_messages, save_message, delete_chat, rename_chat
from backend.chatbot_engine.engine import brain
from backend.database import init_db
from backend.auth import register_user, login_user
from backend.profile import get_profile, update_profile
from backend.membership import check_limit, increment_message_count

# Environment Variable load 
from dotenv import load_dotenv
import os
load_dotenv()


app = Flask(__name__, static_folder='frontend/static', static_url_path='/static')

# Database Initilization
init_db()

# Secret Key
app.secret_key = os.getenv('SECRET_KEY')
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['PERMANENT_SESSION_LIFETIME'] = 86400

CORS(app)


@app.route( '/' )       
def home():
    return send_from_directory('frontend/html', 'index.html')


@app.errorhandler(404)
def not_found(e):
    return send_from_directory('frontend/html', '404.html'), 404


@app.route('/chat')
def chat_page():
    return send_from_directory('frontend/html', 'chat.html')


@app.route('/api/profile', methods = ['GET'])
def profile():
    if 'user_id' not in session:
        return jsonify({"success": False, "error": "Not logged in"})
    return jsonify(get_profile(session['user_id']))


@app.route('/api/profile/update', methods=['POST'])
def profile_update():
    if 'user_id' not in session:
        return jsonify({"success": False, "error": "Not logged in"})
    data = request.get_json()
    return jsonify(update_profile(
        session['user_id'],
        display_name=data.get('display_name'),
        bio=data.get('bio'),
        avatar_url=data.get('avatar_url')
    )
    )


@app.route('/api/auth/change-password', methods=['POST'])
def change_password():
    if 'user_id' not in session:
        return jsonify({"success": False, "error": "Not logged in"}), 401
    data = request.get_json()
    current_password = data.get("current_password")
    new_password = data.get("new_password")
    # verify current password against DB hash
    # hash new password with scrypt
    # update DB
    return jsonify({"success": True})


@app.route('/api/auth/delete-account', methods=['POST'])
def delete_account():
    if 'user_id' not in session:
        return jsonify({"success": False, "error": "Not logged in"}), 401
    user_id = session['user_id']
    # delete messages, chats, membership, profile, user rows in order
    # clear session
    session.clear()
    return jsonify({"success": True})


@app.route('/api/config')
def config():
    return jsonify({
        'emailjs_service_id': os.getenv('EMAILJS_SERVICE_ID'),
        'emailjs_template_id': os.getenv('EMAILJS_TEMPLATE_ID'),
        'emailjs_public_key': os.getenv('EMAILJS_PUBLIC_KEY')
    })


@app.route( '/<path:filename>' )  
def serve_frontend(filename):
    if filename.startswith("api/"):
        return jsonify({"error": "Not found"}), 404
    return send_from_directory('frontend/html', filename)


@app.route ( '/js/<path:filename>')
def serve_js( filename ):
    return send_from_directory( 'frontend/js', filename )


@app.route ( '/css/<path:filename>' )
def serve_css( filename ):
    return send_from_directory( 'frontend/css', filename )


@app.route( '/api/register', methods = ['POST'])
def register():
    data = request.get_json()
    result = register_user( data['username'], data['email'], data['password'])

    if result['success']:
        session['user_id'] = result['user_id']
        session['username'] = data['username']

    return jsonify(result)


@app.route('/api/login', methods = ['POST'])
def login():
    data = request.get_json()
    result = login_user( data['email'] , data['password'] )

    if result['success']:
        session.permanent = True
        
        session['user_id'] = result['user_id']
        session['username'] = result['username']
    
    return jsonify( result )


@app.route('/logout', methods = ['POST'])
def logout():
    session.clear()
    return jsonify( { "success": True})


@app.route('/api/chats/new', methods = ['POST'])
def new_chat():
    if 'user_id' not in session:
        return jsonify( { "success": False , "erroe":"Not logged in"})

    data = request.get_json()
    title = data.get( 'title', 'New Chat')
    return jsonify( create_chat_room( session['user_id'], title ) )
    

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_input = data.get("message")
    chat_id = data.get("chat_id")

    # Check membership limit
    if 'user_id' in session:
        limit_check = check_limit(session['user_id'])
        if not limit_check['allowed']:
            return jsonify({
                "response": f"You've reached your {limit_check['plan']} plan limit of {limit_check['limit']} messages. Upgrade to Pro for unlimited access.",
                "limit_reached": True
            })

    # Load history
    history = []
    if chat_id:
        result = get_messages(chat_id)
        if result["success"]:
            history = result["messages"]

    # Get response
    response = brain(user_input, history)

    # Save messages and increment count
    if chat_id:
        save_message(chat_id, "user", user_input)
        save_message(chat_id, "assistant", response)
    
    if 'user_id' in session:
        increment_message_count(session['user_id'])

    return jsonify({"response": response})



@app.route('/api/chats', methods =['GET'])
def list_chats():
    if 'user_id' not in session:
        return jsonify( { "success": False , "erroe":"Not logged in"})
    
    return jsonify(get_user_chats(session['user_id']))


@app.route('/api/chats/<chat_id>/messages' , methods=['GET'])
def chat_messages( chat_id ):
    return jsonify( get_messages( chat_id ) )


@app.route('/api/chats/<chat_id>/delete' , methods=['POST'])
def delete_chat_route( chat_id ):
    return jsonify( delete_chat( chat_id ) )


@app.route('/api/chats/<chat_id>/rename' , methods=['POST'])
def rename_chat_route( chat_id ):
    data = request.get_json()
    return jsonify( rename_chat( chat_id , data['title'] ) )


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)

