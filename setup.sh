#!/bin/bash

set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"

# --- Backend setup ---
echo "Setting up Python virtual environment..."
cd "$ROOT/backend"

if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

source venv/bin/activate
pip install -r requirements.txt
deactivate

# --- Frontend setup ---
echo "Installing Node packages..."
cd "$ROOT/frontend"
npm install

# --- Start both servers ---
echo "Starting backend (Flask on port 8000)..."
cd "$ROOT/backend"
source venv/bin/activate
python3 app.py &
BACKEND_PID=$!

echo "Starting frontend (Vite)..."
cd "$ROOT/frontend"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "Both servers are running."
echo "  Backend:  http://localhost:8000"
echo "  Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both."

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT
wait
