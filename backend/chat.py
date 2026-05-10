# Backend imports 
from werkzeug import user_agent
from backend.database import get_db, generate_id

# =========================================
# Block 2  – CREATE CHAT ROOM
# =========================================

def create_chat_room( user_id , title = "New Chat"):
    db = get_db()

    try :
        chat_id = generate_id()
        db.execute(
            "INSERT INTO chat_rooms ( chat_id , user_id , title) VALUES ( ?, ?, ? )",( chat_id, user_id, title )
        )
        db.commit()
        return { "success": True , "chat_id": chat_id , "title": title }

    except Exception as e:
        db.rollback()
        return { "success": False , "error": str(e) }

    finally:
        db.close()


# =========================================
#  Block 3 – GET CHAT HISTORY 
# =========================================

def get_user_chats( user_id ):
    db = get_db()

    try:
        chats = db.execute(
            "SELECT chat_id , title, updated_at FROM chat_rooms WHERE user_id = ? AND is_deleted = 0 ORDER BY updated_at DESC", ( user_id,)
        ).fetchall()

        return { "success": True , "chats": [ dict( c ) for c in chats ] }

    except Exception as e:
        return { "success": False , "error": str(e) }

    finally:
        db.close()


# ======================================
# Block 4 - Save & Get Messages
# ======================================
def save_message ( chat_id , role , content ):
    db = get_db()

    try : 
        message_id = generate_id()

        db.execute(
            "INSERT INTO messages ( message_id , chat_id , role , content ) VALUES ( ?, ?, ?, ? )",
            ( message_id , chat_id , role , content )
        )
        db.commit()

        return { "success": True , "message_id": message_id }

    except Exception as e:
        return { "success": False , "error": str(e) }

    finally:
        db.close()


def get_messages( chat_id ):
    db = get_db()

    try:
        messages = db.execute(
            "SELECT role , content , timestamp  FROM messages WHERE chat_id = ?  ORDER BY timestamp ASC", 
            (  chat_id, )
        ).fetchall()

        return { "success": True , "messages": [ dict( m ) for m in messages ] }


    except Exception as e:
        return { "success": False , "error": str(e) }

    finally:
        db.close()


# =====================================   
# Block 5- Delete Chat
# =====================================

def delete_chat ( chat_id ):
    db = get_db()

    try:
        db.execute(
            "UPDATE chat_rooms SET is_deleted = 1 WEHERE chat_id = ? ",
            ( chat_id, )
        )
        db.commit()

        return { "success": True }
    
    except Exception as e:
        db.rollback()
        return { "success": False , "error": str(e) }
    
    finally :
        db.close()
    

# =========================================
# Block 6 - Rename Chat
# =========================================    

def rename_chat ( chat_id , new_title ):
    db = get_db()

    try :
        db.execute( 
            "UPDATE chat_rooms SET title = ? , updated_at = datetime('now') WHERE chat_id = ?", 
            ( new_title , chat_id )
        )
        db.commit()
        return { "success": True }

    except Exception as e:
        db.rollback()
        return { "success": False , "error": str(e) }
    
    finally :
        db.close()

