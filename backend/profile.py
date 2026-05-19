from backend.database import get_db
from backend.membership import PLANS

def get_profile(user_id):
    db = get_db()

    try:
        row = db.execute(
            """
            SELECT p.user_id, p.display_name, p.bio, p.avatar_url,
                   u.username, u.email, u.plan, u.message_count, u.created_at
            FROM profiles p
            JOIN users u ON u.user_id = p.user_id
            WHERE p.user_id = ?
            """,
            (user_id,),
        ).fetchone()

        if not row:
            return {"success": False, "error": "Profile not found"}

        r = dict(row)
        plan = r.get("plan") or "basic"
        raw_limit = PLANS.get(plan, PLANS["basic"])
        message_limit = None if raw_limit == float("inf") else int(raw_limit)

        profile = {
            "user_id": r["user_id"],
            "display_name": r["display_name"],
            "bio": r["bio"],
            "avatar_url": r["avatar_url"],
        }

        return {
            "success": True,
            "profile": profile,
            "username": r["username"],
            "email": r["email"],
            "created_at": r["created_at"],
            "plan": plan,
            "message_count": int(r["message_count"] or 0),
            "message_limit": message_limit,
        }

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

        