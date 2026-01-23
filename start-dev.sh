#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

mkdir -p logs

echo "Checking backend (http://localhost:5000/api/ping)..."
if curl -sS http://localhost:5000/api/ping >/dev/null 2>&1; then
  echo "Backend already running on port 5000"
else
  echo "Starting backend..."
  cd backend
  if [ ! -d node_modules ]; then
    echo "Installing backend dependencies..."
    npm install
  fi
  cp .env.example .env 2>/dev/null || true
  nohup npm run dev > "$ROOT_DIR/logs/backend.log" 2>&1 &
  echo $! > "$ROOT_DIR/logs/backend.pid"
  echo "Backend started (PID $(cat $ROOT_DIR/logs/backend.pid)), logs: $ROOT_DIR/logs/backend.log"
  cd "$ROOT_DIR"
fi

echo "Checking frontend (http://localhost:3000)..."
if curl -sI http://localhost:3000 >/dev/null 2>&1; then
  echo "Frontend already running on port 3000"
else
  echo "Starting frontend..."
  cd frontend
  if [ ! -d node_modules ]; then
    echo "Installing frontend dependencies..."
    npm install
  fi
  nohup bash -lc "VITE_API_BASE=http://localhost:5000/api npm run dev" > "$ROOT_DIR/logs/frontend.log" 2>&1 &
  echo $! > "$ROOT_DIR/logs/frontend.pid"
  echo "Frontend started (PID $(cat $ROOT_DIR/logs/frontend.pid)), logs: $ROOT_DIR/logs/frontend.log"
  cd "$ROOT_DIR"
fi

echo "All done. Tail logs with: tail -f logs/backend.log logs/frontend.log"
