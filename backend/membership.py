from backend.database import get_db

PLANS = {
    'basic': 20,
    'pro': float('inf')
}

def check_limit(user_id):
    db = get_db()
    try:
        user = dict(db.execute(
            "SELECT plan, message_count FROM users WHERE user_id = ?", (user_id,)
        ).fetchone())
        
        limit = PLANS.get(user['plan'], 20)
        if user['message_count'] >= limit:
            return {"allowed": False, "plan": user['plan'], "limit": limit}
        return {"allowed": True, "plan": user['plan'], "remaining": limit - user['message_count']}
    finally:
        db.close()

def increment_message_count(user_id):
    db = get_db()
    try:
        db.execute(
            "UPDATE users SET message_count = message_count + 1 WHERE user_id = ?", (user_id,)
        )
        db.commit()
    finally:
        db.close()

def upgrade_plan(user_id, plan):
    db = get_db()
    try:
        db.execute(
            "UPDATE users SET plan = ? WHERE user_id = ?", (plan, user_id)
        )
        db.commit()
        return {"success": True}
    except Exception as e:
        db.rollback()
        return {"success": False, "error": str(e)}
    finally:
        db.close()

