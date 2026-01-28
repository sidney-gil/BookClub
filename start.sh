#!/bin/bash
# Railway start script for frontend

cd frontend
npm install
npm run build
npx serve -s build -p $PORT
