from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

DATABASE = 'anuncios.db'

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Crear tabla de anuncios
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS anuncios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            descripcion TEXT NOT NULL,
            categoria TEXT NOT NULL,
            precio REAL,
            ubicacion TEXT,
            fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            contacto TEXT,
            imagen_url TEXT
        )
    ''')
    
    # Insertar datos de ejemplo
    cursor.execute('SELECT COUNT(*) FROM anuncios')
    if cursor.fetchone()[0] == 0:
        anuncios_ejemplo = [
            ('University Party - Welcome 2025', 'Great welcome party for new students. Live DJ, drinks and amazing atmosphere. Date: November 20th, 23:00h', 'evento', 5.00, 'UdL Campus Pub', datetime.now(), 'party@udl.cat', 'https://picsum.photos/300/200?random=1'),
            ('Room in Shared Apartment', 'Large room near UdL, 3 bedrooms, fiber internet, utilities included. Available from December', 'producto', 250.00, '5 min from UdL', datetime.now(), '666123456', 'https://picsum.photos/300/200?random=2'),
            ('Tutoring Classes - Calculus I', '4th year student offers private Calculus I classes. You will pass for sure! Small groups or individual', 'servicio', 15.00, 'UdL Campus', datetime.now(), 'calculus@student.udl.cat', 'https://picsum.photos/300/200?random=3'),
            ('Complete Programming Notes', 'Selling complete OOP and Data Structures notes. Includes solved exercises and examples', 'producto', 25.00, 'UdL', datetime.now(), 'notes@udl.cat', 'https://picsum.photos/300/200?random=4'),
            ('Deadline Reminder - Final Project', 'Reminder: Deadline to submit the Final Project is November 30th. Don\'t forget to upload your work to the platform', 'evento', 0.00, 'UdL Secretary', datetime.now(), 'secretary@udl.cat', 'https://picsum.photos/300/200?random=5'),
            ('Cross-Curricular Course - Digital Photography', 'Cross-curricular course on digital photography. Limited places. Registration open until November 25th', 'evento', 0.00, 'Faculty of Fine Arts', datetime.now(), 'crosscurricular@udl.cat', 'https://picsum.photos/300/200?random=6'),
            ('English B2 Classes', 'Cambridge B2 exam preparation. Native teacher with experience. Groups of maximum 4 people', 'servicio', 20.00, 'Campus Area', datetime.now(), 'english@udl.cat', 'https://picsum.photos/300/200?random=7'),
            ('Complete Apartment Rental', '2 bedroom apartment near the university. Furnished, with appliances. Ideal for 2 students', 'producto', 500.00, 'C/ Jaume II, Lleida', datetime.now(), '666789012', 'https://picsum.photos/300/200?random=8'),
            ('Talk: Computer Science Career Paths', 'Informative event about career paths in the technology sector. With invited companies. Date: November 28th', 'evento', 0.00, 'UdL Main Hall', datetime.now(), 'events@eps.udl.cat', 'https://picsum.photos/300/200?random=9'),
            ('Textbooks - Engineering', 'Selling 2nd year Computer Engineering books. Like new. Price negotiable if you buy several', 'producto', 45.00, 'UdL', datetime.now(), '666555444', 'https://picsum.photos/300/200?random=10'),
            ('Statistics Classes', 'Mathematics student offers Statistics and Probability classes. All levels. Teaching experience', 'servicio', 18.00, 'UdL Campus', datetime.now(), 'statistics@udl.cat', 'https://picsum.photos/300/200?random=11'),
            ('University Football Tournament', 'Registration open for inter-faculty tournament. Teams of 7 players. Prizes for winners!', 'evento', 10.00, 'UdL Sports Center', datetime.now(), 'sports@udl.cat', 'https://picsum.photos/300/200?random=12'),
        ]
        
        cursor.executemany('''
            INSERT INTO anuncios (titulo, descripcion, categoria, precio, ubicacion, fecha_creacion, contacto, imagen_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', anuncios_ejemplo)
    
    conn.commit()
    conn.close()

# Inicializar la base de datos al arrancar
init_db()

@app.route('/api/anuncios', methods=['GET'])
def get_anuncios():
    categoria = request.args.get('categoria')
    conn = get_db_connection()
    
    if categoria and categoria != 'todos':
        anuncios = conn.execute('SELECT * FROM anuncios WHERE categoria = ? ORDER BY fecha_creacion DESC', (categoria,)).fetchall()
    else:
        anuncios = conn.execute('SELECT * FROM anuncios ORDER BY fecha_creacion DESC').fetchall()
    
    conn.close()
    
    return jsonify([dict(anuncio) for anuncio in anuncios])

@app.route('/api/anuncios/<int:id>', methods=['GET'])
def get_anuncio(id):
    conn = get_db_connection()
    anuncio = conn.execute('SELECT * FROM anuncios WHERE id = ?', (id,)).fetchone()
    conn.close()
    
    if anuncio is None:
        return jsonify({'error': 'Anuncio no encontrado'}), 404
    
    return jsonify(dict(anuncio))

@app.route('/api/anuncios', methods=['POST'])
def create_anuncio():
    data = request.get_json()
    
    required_fields = ['titulo', 'descripcion', 'categoria']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Faltan campos requeridos'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO anuncios (titulo, descripcion, categoria, precio, ubicacion, contacto, imagen_url)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (
        data['titulo'],
        data['descripcion'],
        data['categoria'],
        data.get('precio', 0),
        data.get('ubicacion', ''),
        data.get('contacto', ''),
        data.get('imagen_url', 'https://picsum.photos/300/200?random=99')
    ))
    
    anuncio_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return jsonify({'id': anuncio_id, 'message': 'Anuncio creado correctamente'}), 201

@app.route('/api/anuncios/<int:id>', methods=['DELETE'])
def delete_anuncio(id):
    conn = get_db_connection()
    conn.execute('DELETE FROM anuncios WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Anuncio eliminado correctamente'}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
