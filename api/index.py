import os
import sys

# Vercel's PYTHONPATH starts at the root, but the FastAPI app expects 'backend' to be the root.
# We must add the 'backend' folder to sys.path so 'from app.something import ...' works.
backend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend"))
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

from app.main import app

# In Vercel serverless functions, FastAPI lifespan events are often not triggered.
# We explicitly initialize the database here on cold start.
if os.environ.get("VERCEL"):
    from app.db.init_db import init_db
    try:
        init_db()
    except Exception as e:
        print(f"Error initializing DB on Vercel: {e}")

# This file is used by Vercel Serverless Functions to expose the FastAPI app.
