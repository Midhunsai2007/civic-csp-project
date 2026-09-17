import os
import sys
import traceback

# Determine possible locations for the backend package
base_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.abspath(os.path.join(base_dir, ".."))

search_paths = [
    root_dir,
    os.path.join(root_dir, "backend"),
    os.path.join(base_dir, "backend"),
    os.path.abspath("backend"),
    "/var/task",
    "/var/task/backend"
]

for p in search_paths:
    if os.path.exists(p) and p not in sys.path:
        sys.path.insert(0, p)

try:
    try:
        from app.main import app
    except ImportError:
        from backend.app.main import app

    # Initialize DB on cold start
    try:
        try:
            from app.db.init_db import init_db
        except ImportError:
            from backend.app.db.init_db import init_db
        init_db()
    except Exception as db_err:
        print(f"Notice: Database initialization notice: {db_err}")

except Exception as err:
    from fastapi import FastAPI
    from fastapi.responses import JSONResponse

    err_trace = traceback.format_exc()
    print("FATAL BACKEND IMPORT ERROR:", err_trace)

    app = FastAPI(title="Diagnostic Fallback")

    @app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"])
    async def debug_endpoint(path: str):
        return JSONResponse(
            status_code=500,
            content={
                "error": "FastAPI failed to start on Vercel",
                "message": str(err),
                "traceback": err_trace.split("\n"),
                "python_version": sys.version,
                "sys_path": sys.path,
                "cwd": os.getcwd(),
                "base_dir_contents": os.listdir(base_dir) if os.path.exists(base_dir) else [],
                "root_dir_contents": os.listdir(root_dir) if os.path.exists(root_dir) else [],
                "task_contents": os.listdir("/var/task") if os.path.exists("/var/task") else []
            }
        )
