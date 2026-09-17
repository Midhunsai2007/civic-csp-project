import os
import sys

# Determine and add backend directory to sys.path
base_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.abspath(os.path.join(base_dir, ".."))
backend_dir = os.path.join(root_dir, "backend")

for p in [backend_dir, root_dir, "/var/task", "/var/task/backend"]:
    if os.path.exists(p) and p not in sys.path:
        sys.path.insert(0, p)

# Import the FastAPI instance
try:
    from app.main import app as _app
except ImportError:
    from backend.app.main import app as _app

# Auto-initialize database on cold-start
try:
    try:
        from app.db.init_db import init_db
    except ImportError:
        from backend.app.db.init_db import init_db
    init_db()
except Exception as e:
    print(f"Notice: database init on start: {e}")

# Explicit top-level assignments for Vercel's AST entrypoint scanner
app = _app
handler = _app
