from backend.database import get_db

def get_profile(user_id):
    db = get_db()

    try:
        profile = db.execute(
            "SELECT * FROM profiles WHERE user_id = ?", (user_id,)
        ).fetchone()

        if not profile:
            return {"success": False, "error": "Profile not found"}

        return {"success": True, "profile": dict(profile)}

    finally:
        db.close()


def update_profile(user_id, display_name=None, bio=None, avatar_url=None):
    db = get_db()

    try:
        if display_name:
            db.execute("UPDATE profiles SET display_name = ? WHERE user_id = ?", (display_name, user_id))
        
        if bio:
            db.execute("UPDATE profiles SET bio = ? WHERE user_id = ?", (bio, user_id))
        
        if avatar_url:
            db.execute("UPDATE profiles SET avatar_url = ? WHERE user_id = ?", (avatar_url, user_id))
        
        db.commit()
        return {"success": True}

    except Exception as e:
        db.rollback()
        return {"success": False, "error": str(e)}

    finally:
        db.close()

        