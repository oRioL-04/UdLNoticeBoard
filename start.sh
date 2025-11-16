#!/bin/bash

echo "🚀 Iniciando Tablero de Anuncios..."
echo ""

# Iniciar Backend
echo "📦 Iniciando Backend (Flask)..."
cd backend
./venv/bin/python app.py &
BACKEND_PID=$!
cd ..

echo "✅ Backend iniciado en http://localhost:5000"
echo ""

# Esperar a que el backend esté listo
sleep 3

# Iniciar Frontend
echo "🎨 Iniciando Frontend (React)..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Frontend iniciado en http://localhost:3000"
echo ""
echo "📝 Instrucciones:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend API: http://localhost:5000/api/anuncios"
echo ""
echo "Para detener los servicios, presiona Ctrl+C"
echo ""

# Esperar a que el usuario presione Ctrl+C
wait
