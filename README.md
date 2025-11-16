# UdL Notice Board

Web application for university notice board (Wallapop style) with React and Flask.

## Features

- **3 Post Categories:**
  - 🎭 Events
  - 💼 Services (tutoring classes, etc.)
  - 🛍️ Products and Rentals

- **Functionality:**
  - View posts in grid format (Wallapop style)
  - Filter by category
  - View full details on click
  - Create new posts
  - Local SQLite database
  - Pre-loaded sample posts
  - UdL corporate colors (#8c0f57)

## Project Structure

```
tablero-anuncios/
├── backend/
│   ├── app.py              # API Flask
│   ├── requirements.txt    # Dependencias Python
│   └── anuncios.db         # Base de datos SQLite (se crea automáticamente)
└── frontend/
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── App.js          # Componente principal
        ├── App.css         # Estilos
        ├── index.js
        └── index.css
```

## Installation and Execution

### Backend (Flask)

1. Navigate to backend folder:
```bash
cd backend
```

2. Instala las dependencias:
```bash
pip install -r requirements.txt
```

3. Run the server:
```bash
python app.py
```

Server will be available at: http://localhost:5000

### Frontend (React)

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Instala las dependencias:
```bash
npm install
```

3. Run the application:
```bash
npm start
```

Application will open at: http://localhost:3000

## Usage

1. **Filter posts:** Use the buttons at the top to filter by category
2. **View details:** Click on any post to see full information
3. **Create post:** Click "➕ Create Post" and fill out the form
4. Database includes 12 sample posts to test the application

## Technologies

- **Frontend:** React, Axios
- **Backend:** Python Flask, Flask-CORS
- **Database:** SQLite
- **Styles:** Pure CSS (responsive design) with UdL corporate colors
