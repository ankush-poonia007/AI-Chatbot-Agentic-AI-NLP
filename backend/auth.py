# backend/auth.py

# ===========================================================================
# Block 1 — Imports 
# ===========================================================================

from werkzeug.security import generate_password_hash, check_password_hash
from backend.database import get_db, generate_id

# ===========================================================================
# Block 2 — Register New User 
# ===========================================================================

def register_user ( username, email, password ):
    db = get_db()
    try:
        user_id = generate_id()
        password_hash = generate_password_hash( password )

        db.execute(
            "INSERT INTO users ( user_id, username, email, password_hash) VALUES ( ? , ? , ? , ? )",(user_id, username, email, password_hash)        
        )
        db.execute(
            "INSERT INTO profiles (user_id, display_name) VALUES ( ? , ? )", (user_id, username)
        )
        db.commit()
        return { "success": True, "user_id": user_id }

    except  Exception as e :
        db.rollback()
        return { "success": False , "error": str(e) }

    finally:
        db.close()

# ===========================================================================
# Block 3 — Login User
# ===========================================================================

def login_user( email , password ):
    db = get_db()

    try:
        user = db.execute(
            "SELECT * FROM users WHERE email = ? ",( email,)
        ).fetchone()

        if not user:
            return { "success": False , "error": "user not found" }

        user = dict( user )
        if not check_password_hash( user["password_hash"], password):
            return { "success": False, "error": "wrong password" }

        return { "success": True , "user_id": user["user_id"], "username":user["username"] }
    except Exception as e:
        return { "success": False , "error": str(e)}

    finally:
        db.close()
    