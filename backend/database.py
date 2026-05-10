# backend/database.py

# ===========================================================================
# Block 1 — Imports & Config
# ===========================================================================

import sqlite3
import os 
import uuid

BASE_DIR = os.path.dirname( os.path.dirname( os.path.abspath( __file__ ) ) )
DB_PATH = os.path.join( BASE_DIR, 'database', 'neurachat.db' )
SCHEMA_PATH = os.path.join( BASE_DIR, 'database', 'schema.sql' )


# ===========================================================================
# Block 2 — Initilize Database Runs once on statup  
# ===========================================================================

def init_db():
    conn = sqlite3.connect( DB_PATH )
    with open( SCHEMA_PATH, 'r' , encoding= 'utf-8' ) as f:
        conn.executescript( f.read() )
    conn.commit()
    conn.close()

# ===========================================================================
# Block 3 — get_db() helper funtion  
# ===========================================================================

def get_db():
    conn = sqlite3.connect( DB_PATH )
    conn.row_factory = sqlite3.Row
    conn.execute( "PRAGMA foreign_keys = ON")
    return conn 

# ===========================================================================
# Block 4 — generate_id() utility
# ===========================================================================

def generate_id():
    return str( uuid.uuid4() )
