#!/bin/bash

# Start serving the frontend in the background
# serve -s /app/static -l 3000 &

# Run database migrations
alembic upgrade head

# Start the backend
uvicorn app.main:app --host 0.0.0.0 --port 80 --workers 10