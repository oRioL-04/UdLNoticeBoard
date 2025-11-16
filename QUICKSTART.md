## UdL Notice Board - Quick Start Guide

### Current Status
✅ Backend is running on: http://localhost:5000
✅ Frontend is running on: http://localhost:3000

### Application Features

**Language:** English
**UdL Corporate Colors:** #8c0f57 (burgundy) combined with white

**Categories:**
- 🎭 Events (university parties, deadlines, talks)
- 💼 Services (tutoring classes, language courses)
- 🛍️ Products/Rentals (apartments, textbooks, notes, equipment)

**Sample Posts Include:**
- University Party - Welcome 2025
- Room in Shared Apartment
- Tutoring Classes - Calculus I
- Complete Programming Notes
- Deadline Reminder - Final Project
- Cross-Curricular Course - Digital Photography
- English B2 Classes
- Complete Apartment Rental
- Career Talk
- Textbooks for sale
- Statistics Classes
- Football Tournament

### Usage

1. **Browse Posts:** View all university posts in grid format
2. **Filter:** Click category buttons (All, Events, Services, Products/Rentals)
3. **View Details:** Click any post card to see full information
4. **Create Post:** Click "➕ Create Post" button to add a new post

### Files Structure

```
tablero-anuncios/
├── backend/
│   ├── app.py              # Flask API (English text)
│   ├── anuncios.db         # SQLite database with sample posts
│   └── venv/               # Python virtual environment
└── frontend/
    └── src/
        ├── App.js          # React component (English UI)
        └── App.css         # UdL corporate colors (#8c0f57)
```

### To Stop Servers

Backend: `pkill -f "python app.py"`
Frontend: `Ctrl+C` in the terminal running npm

### To Restart Everything

```bash
cd /home/oriol/Escritorio/UdL/4t/DCU/tablero-anuncios

# Backend
cd backend
./venv/bin/python app.py &

# Frontend
cd ../frontend
npm start
```

Enjoy your UdL Notice Board! 🎓
