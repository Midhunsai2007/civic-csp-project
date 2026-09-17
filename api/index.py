import os
from backend.app.main import app

# In Vercel serverless functions, FastAPI lifespan events are often not triggered.
# We explicitly initialize the database here on cold start.
if os.environ.get("VERCEL"):
    from backend.app.db.init_db import init_db
    try:
        init_db()
    except Exception as e:
        print(f"Error initializing DB on Vercel: {e}")

# This file is used by Vercel Serverless Functions to expose the FastAPI app.
