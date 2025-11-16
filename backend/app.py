from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import sqlite3
from datetime import datetime
import os
import requests
import json
from werkzeug.utils import secure_filename
import base64

app = Flask(__name__)
CORS(app)

# Configuración para subida de imágenes
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB max

# Crear carpeta de uploads si no existe
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

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

# ==================== IMAGE UPLOAD ====================

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/upload-image', methods=['POST'])
def upload_image():
    """
    Endpoint para subir imágenes. Acepta:
    1. Archivo directo (multipart/form-data)
    2. Base64 en JSON
    """
    try:
        # Caso 1: Archivo directo
        if 'file' in request.files:
            file = request.files['file']
            if file.filename == '':
                return jsonify({'error': 'No file selected'}), 400
            
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                # Añadir timestamp para evitar colisiones
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                filename = f"{timestamp}_{filename}"
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
                
                # Devolver URL relativa
                image_url = f"/uploads/{filename}"
                return jsonify({'image_url': image_url, 'message': 'Image uploaded successfully'}), 200
            else:
                return jsonify({'error': 'File type not allowed'}), 400
        
        # Caso 2: Base64 en JSON
        elif request.is_json:
            data = request.get_json()
            if 'image_data' in data:
                # Decodificar base64
                image_data = data['image_data']
                if ',' in image_data:
                    image_data = image_data.split(',')[1]  # Remover prefijo data:image/...
                
                image_bytes = base64.b64decode(image_data)
                
                # Generar nombre de archivo
                extension = data.get('extension', 'png')
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                filename = f"{timestamp}_upload.{extension}"
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                
                with open(filepath, 'wb') as f:
                    f.write(image_bytes)
                
                image_url = f"/uploads/{filename}"
                return jsonify({'image_url': image_url, 'message': 'Image uploaded successfully'}), 200
            else:
                return jsonify({'error': 'No image_data provided'}), 400
        else:
            return jsonify({'error': 'No file or image data provided'}), 400
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/uploads/<filename>')
def serve_upload(filename):
    """Servir imágenes subidas"""
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# ==================== AI FUNCTIONALITY ====================

def categorizar_con_ia(titulo, descripcion):
    """
    Categoriza un anuncio usando IA (Ollama) con fallback a keywords.
    Retorna: 'evento', 'servicio', o 'producto'
    """
    # Intentar usar Ollama primero
    try:
        response = requests.post(
            'http://localhost:11434/api/generate',
            json={
                "model": "llama3.2:1b",
                "prompt": f"""You are a categorization assistant for a university notice board.
Categorize this post into EXACTLY ONE category:

Categories:
- evento: parties, events, tournaments, talks, deadlines, reminders, conferences
- servicio: tutoring, classes, teaching, courses, lessons, services offered
- producto: apartments, rooms, books, notes, items for sale, rentals, equipment

Post to categorize:
Title: {titulo}
Description: {descripcion}

Think about the main purpose. Is it announcing an event, offering a service, or selling/renting something?

Answer with ONLY ONE WORD (evento, servicio, or producto):""",
                "stream": False,
                "options": {
                    "temperature": 0.1,  # Más determinista
                    "num_predict": 5     # Solo necesitamos una palabra
                }
            },
            timeout=3
        )
        
        if response.status_code == 200:
            resultado = response.json()['response'].strip().lower()
            
            # Extraer solo la palabra clave
            if 'evento' in resultado:
                return 'evento', 'ai', 0.95
            elif 'servicio' in resultado:
                return 'servicio', 'ai', 0.95
            elif 'producto' in resultado:
                return 'producto', 'ai', 0.95
    
    except Exception as e:
        print(f"Ollama no disponible, usando fallback: {e}")
    
    # Fallback: Sistema de keywords inteligente
    return categorizar_con_keywords(titulo, descripcion)

def categorizar_con_keywords(titulo, descripcion):
    """
    Sistema de categorización basado en keywords (fallback sin IA)
    """
    texto = f"{titulo} {descripcion}".lower()
    
    # Keywords para cada categoría
    evento_keywords = {
        'strong': ['party', 'event', 'tournament', 'conference', 'talk', 'seminar', 'workshop'],
        'medium': ['deadline', 'reminder', 'date', 'registration', 'open', 'invitation'],
        'weak': ['november', 'december', 'time', 'schedule']
    }
    
    servicio_keywords = {
        'strong': ['tutoring', 'class', 'lesson', 'teacher', 'teaching', 'course', 'instructor'],
        'medium': ['help', 'preparation', 'exam', 'learning', 'study', 'private'],
        'weak': ['experience', 'student', 'professional']
    }
    
    producto_keywords = {
        'strong': ['room', 'apartment', 'rent', 'rental', 'sell', 'selling', 'book', 'textbook'],
        'medium': ['notes', 'available', 'furnished', 'bedroom', 'shared', 'price'],
        'weak': ['new', 'used', 'condition', 'includes']
    }
    
    # Calcular scores ponderados
    def calcular_score(keywords_dict):
        score = 0
        for word in keywords_dict['strong']:
            if word in texto:
                score += 3
        for word in keywords_dict['medium']:
            if word in texto:
                score += 2
        for word in keywords_dict['weak']:
            if word in texto:
                score += 1
        return score
    
    scores = {
        'evento': calcular_score(evento_keywords),
        'servicio': calcular_score(servicio_keywords),
        'producto': calcular_score(producto_keywords)
    }
    
    categoria = max(scores, key=scores.get)
    max_score = scores[categoria]
    
    # Calcular confianza
    total_score = sum(scores.values())
    confianza = max_score / total_score if total_score > 0 else 0.33
    
    return categoria, 'keywords', round(confianza, 2)

@app.route('/api/anuncios/generate-description', methods=['POST'])
def generate_description():
    """
    Endpoint para generar descripción automática desde el título
    """
    data = request.get_json()
    titulo = data.get('titulo', '').strip()
    categoria = data.get('categoria', 'evento')
    
    # Validar que hay título
    if len(titulo) < 3:
        return jsonify({
            'descripcion': '',
            'method': 'none',
            'message': 'Title too short'
        }), 400
    
    # Generar descripción con IA
    descripcion_generada = generar_descripcion_con_ia(titulo, categoria)
    
    return jsonify({
        'descripcion': descripcion_generada,
        'method': 'ai',
        'message': 'Description generated successfully'
    }), 200

def generar_descripcion_con_ia(titulo, categoria):
    """
    Genera una descripción atractiva a partir del título usando IA
    """
    # Detectar el idioma del título
    idioma_titulo = detectar_idioma(titulo)
    
    # Intentar usar Ollama primero
    try:
        # Contexto según la categoría e idioma
        context_map = {
            'evento': {
                'english': 'university event, party, tournament, talk, or deadline',
                'spanish': 'evento universitario, fiesta, torneo, charla o fecha límite',
                'catalan': 'esdeveniment universitari, festa, torneig, xerrada o data límit'
            },
            'servicio': {
                'english': 'tutoring service, class, course, or lesson offered',
                'spanish': 'servicio de tutoría, clase, curso o lección ofrecida',
                'catalan': 'servei de tutoria, classe, curs o lliçó oferida'
            },
            'producto': {
                'english': 'product for sale, room rental, or apartment listing',
                'spanish': 'producto en venta, alquiler de habitación o piso',
                'catalan': 'producte en venda, lloguer d\'habitació o pis'
            }
        }
        
        context = context_map.get(categoria, {}).get(idioma_titulo, 
                                                      'university notice board post')
        
        # Instrucciones según idioma
        instrucciones = {
            'spanish': f"""Eres un asistente para un tablón de anuncios universitario.
Escribe una descripción clara, concisa y atractiva para este anuncio EN ESPAÑOL.

Categoría: {context}
Título: {titulo}

Escribe una descripción (2-3 frases, 40-80 palabras) que:
- Amplíe el título con detalles relevantes
- Sea profesional pero amigable
- Incluya información clave para estudiantes
- Use contexto universitario apropiado
- DEBE estar completamente EN ESPAÑOL

Descripción en español:""",
            'catalan': f"""Ets un assistent per a un tauler d'anuncis universitari.
Escriu una descripció clara, concisa i atractiva per aquest anunci EN CATALÀ.

Categoria: {context}
Títol: {titulo}

Escriu una descripció (2-3 frases, 40-80 paraules) que:
- Ampliï el títol amb detalls rellevants
- Sigui professional però amigable
- Inclogui informació clau per estudiants
- Utilitzi context universitari apropiat
- HA D'ESTAR completament EN CATALÀ

Descripció en català:""",
            'english': f"""You are a helpful assistant for a university notice board. 
Write a clear, concise, and attractive description for this post IN ENGLISH.

Category: {context}
Title: {titulo}

Write a description (2-3 sentences, 40-80 words) that:
- Expands on the title with relevant details
- Is professional but friendly
- Includes key information a student would want to know
- Uses appropriate university context
- MUST be completely IN ENGLISH

Description in English:"""
        }
        
        prompt = instrucciones.get(idioma_titulo, instrucciones['english'])
        
        response = requests.post(
            'http://localhost:11434/api/generate',
            json={
                "model": "llama3.2:1b",
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.7,
                    "num_predict": 120
                }
            },
            timeout=5
        )
        
        if response.status_code == 200:
            descripcion = response.json()['response'].strip()
            
            # Limpiar la respuesta de la IA
            # Remover prefijos comunes
            prefixes_to_remove = [
                "Here's a possible description for the post:",
                "Here's a description:",
                "Here is a description:",
                "Description:",
                "Here's the description:",
                "Possible description:",
            ]
            
            for prefix in prefixes_to_remove:
                if descripcion.lower().startswith(prefix.lower()):
                    descripcion = descripcion[len(prefix):].strip()
                    break
            
            # Remover comillas al inicio y final
            descripcion = descripcion.strip('"').strip("'").strip()
            
            # Reemplazar saltos de línea con espacios
            descripcion = descripcion.replace('\n', ' ').strip()
            
            # Remover espacios múltiples
            while '  ' in descripcion:
                descripcion = descripcion.replace('  ', ' ')
            
            if len(descripcion) > 10:
                return descripcion
    
    except Exception as e:
        print(f"Ollama no disponible, usando fallback: {e}")
    
    # Fallback: Generar descripción simple basada en templates
    return generar_descripcion_template(titulo, categoria)

def generar_descripcion_template(titulo, categoria):
    """
    Genera descripción usando templates predefinidos (fallback sin IA)
    """
    templates = {
        'evento': [
            f"Join us for {titulo}! This is a great opportunity for students to participate and have fun. Don't miss out!",
            f"We're excited to announce {titulo}. All students are welcome to attend. See you there!",
            f"{titulo} is coming soon! Mark your calendar and join fellow students for this event."
        ],
        'servicio': [
            f"Looking for help? I'm offering {titulo} for university students. Contact me for more details and schedule.",
            f"Professional {titulo} available for students. Flexible schedule, all levels welcome. Get in touch!",
            f"Need assistance? {titulo} offered by experienced student. Affordable rates and proven results."
        ],
        'producto': [
            f"{titulo} - Available now for students. Great condition and fair price. Contact me for more information.",
            f"Offering {titulo} near campus. Perfect for students. Message me for details and viewing.",
            f"{titulo} in excellent condition. Ideal for university students. Serious inquiries only."
        ]
    }
    
    import random
    return random.choice(templates.get(categoria, templates['evento']))

@app.route('/api/ai/status', methods=['GET'])
def ai_status():
    """
    Verifica si Ollama está disponible
    """
    try:
        response = requests.get('http://localhost:11434/api/tags', timeout=1)
        if response.status_code == 200:
            return jsonify({
                'status': 'available',
                'service': 'ollama',
                'models': ['llama3.2:1b']
            }), 200
    except:
        pass
    
    return jsonify({
        'status': 'fallback',
        'service': 'keywords',
        'message': 'Using keyword-based categorization'
    }), 200

@app.route('/api/chat', methods=['POST'])
def chat():
    """
    Chatbot que responde preguntas sobre los anuncios
    """
    data = request.get_json()
    pregunta = data.get('pregunta', '').strip()
    
    if not pregunta:
        return jsonify({
            'respuesta': 'Please ask me something!',
            'method': 'none'
        }), 400
    
    # Detectar idioma de la pregunta
    idioma = detectar_idioma(pregunta)
    
    # Obtener todos los anuncios actuales
    conn = get_db_connection()
    anuncios = conn.execute('SELECT * FROM anuncios ORDER BY fecha_creacion DESC').fetchall()
    conn.close()
    
    # Generar respuesta con IA
    respuesta, posts_mencionados = generar_respuesta_chat(pregunta, anuncios, idioma)
    
    return jsonify({
        'respuesta': respuesta,
        'method': 'ai',
        'posts': posts_mencionados,
        'idioma': idioma
    }), 200

def detectar_idioma(texto):
    """
    Detecta el idioma del texto (español, catalán o inglés)
    """
    texto_lower = texto.lower()
    
    # Keywords específicos de cada idioma (más completos)
    catalan_words = ['què', 'quin', 'quina', 'quins', 'quines', 'com', 'on', 'quan', 'perquè', 
                     'per què', 'hi ha', 'és', 'són', 'està', 'estan', 'puc', 'pots', 
                     'vull', 'vols', 'tinc', 'tens', 'aquest', 'aquesta', 'això',
                     'esdeveniments', 'serveis', 'habitació', 'pis']
    
    spanish_words = ['qué', 'cuál', 'cuáles', 'cómo', 'dónde', 'cuándo', 'por qué', 'porqué',
                     'hay', 'está', 'están', 'puedo', 'puedes', 'quiero', 'quieres', 
                     'tengo', 'tienes', 'este', 'esta', 'esto', 'algún', 'alguna',
                     'eventos', 'servicios', 'habitación', 'disponibles', 'clases',
                     'matemáticas', 'mates', 'cada', 'semana', 'repaso']
    
    english_words = ['what', 'which', 'how', 'where', 'when', 'why', 'is', 'are', 'can', 
                     'could', 'want', 'have', 'has', 'this', 'that', 'some', 'any',
                     'events', 'services', 'room', 'available', 'classes', 'tutoring']
    
    # Contar coincidencias
    catalan_count = sum(1 for word in catalan_words if word in texto_lower)
    spanish_count = sum(1 for word in spanish_words if word in texto_lower)
    english_count = sum(1 for word in english_words if word in texto_lower)
    
    # Patrones específicos de español (acentos característicos)
    spanish_patterns = ['á', 'é', 'í', 'ó', 'ú', 'ñ', '¿', '¡']
    for pattern in spanish_patterns:
        if pattern in texto_lower:
            spanish_count += 2  # Peso extra para acentos españoles
    
    # Determinar idioma por mayoría
    if catalan_count > spanish_count and catalan_count > english_count:
        return 'catalan'
    elif spanish_count > english_count:
        return 'spanish'
    else:
        return 'english'

def generar_respuesta_chat(pregunta, anuncios, idioma='english'):
    """
    Genera respuesta del chatbot usando IA con contexto de los anuncios
    """
    # Preparar contexto con los anuncios incluyendo IDs
    anuncios_texto = []
    posts_map = {}  # Para mapear títulos a IDs
    
    for anuncio in anuncios:
        categoria_label = {
            'evento': 'Event',
            'servicio': 'Service', 
            'producto': 'Product/Rental'
        }.get(anuncio['categoria'], anuncio['categoria'])
        
        precio_text = 'Free' if anuncio['precio'] == 0 else f"€{anuncio['precio']}"
        
        anuncios_texto.append(
            f"- [ID:{anuncio['id']}] [{categoria_label}] {anuncio['titulo']}: {anuncio['descripcion'][:100]}... "
            f"(Price: {precio_text}, Location: {anuncio['ubicacion']})"
        )
        
        # Guardar mapeo de título a ID
        posts_map[anuncio['titulo'].lower()] = anuncio['id']
    
    contexto_anuncios = "\n".join(anuncios_texto[:15])  # Limitar a 15 anuncios para no saturar
    
    # Instrucciones según idioma
    instrucciones_idioma = {
        'spanish': """Responde en ESPAÑOL. 
IMPORTANTE: Cuando menciones un post, SIEMPRE incluye su ID entre corchetes así: [ID:12]
Ejemplo: "Tenemos el [ID:12] Torneo de Fútbol Universitario disponible"
""",
        'catalan': """Respon en CATALÀ.
IMPORTANT: Quan mencionas un post, SEMPRE inclou el seu ID entre claudàtors així: [ID:12]
Exemple: "Tenim el [ID:12] Torneig de Futbol Universitari disponible"
""",
        'english': """Answer in ENGLISH.
IMPORTANT: When mentioning a post, ALWAYS include its ID in brackets like: [ID:12]
Example: "We have the [ID:12] University Football Tournament available"
"""
    }
    
    instruccion = instrucciones_idioma.get(idioma, instrucciones_idioma['english'])
    
    # Usar IA con prompt muy específico y contexto limitado
    try:
        # Construir un contexto MUY específico solo con info relevante
        contexto_simple = "Available posts:\n"
        for anuncio in anuncios:
            precio = "Free" if anuncio['precio'] == 0 else f"€{anuncio['precio']}"
            contexto_simple += f"[ID:{anuncio['id']}] {anuncio['titulo']} - {anuncio['descripcion'][:80]}... Price: {precio}, Location: {anuncio['ubicacion']}\n"
        
        # Prompt ultra-específico
        if idioma == 'spanish':
            system = "Eres un asistente de tablón universitario. Responde de forma natural y conversacional EN ESPAÑOL."
            rules = """REGLAS ESTRICTAS:
1. USA SOLO la información de los posts arriba
2. Si preguntan por algo que NO está en los posts, di "No hay [eso] disponible actualmente"
3. Cuando menciones un post, SIEMPRE incluye [ID:X]
4. Sé conversacional y natural
5. NO inventes detalles que no están en los posts"""
        elif idioma == 'catalan':
            system = "Ets un assistent de tauler universitari. Respon de forma natural i conversacional EN CATALÀ."
            rules = """REGLES ESTRICTES:
1. USA NOMÉS la informació dels posts de dalt
2. Si pregunten per algo que NO hi ha als posts, digues "No hi ha [això] disponible actualment"
3. Quan mencionas un post, SEMPRE inclou [ID:X]
4. Sigues conversacional i natural
5. NO inventis detalls que no hi són als posts"""
        else:
            system = "You are a university notice board assistant. Answer naturally and conversationally IN ENGLISH."
            rules = """STRICT RULES:
1. USE ONLY the information from the posts above
2. If asked about something NOT in the posts, say "There are no [that] available currently"
3. When mentioning a post, ALWAYS include [ID:X]
4. Be conversational and natural
5. DO NOT invent details not in the posts"""
        
        prompt = f"""{system}

{rules}

{contexto_simple}

Question: {pregunta}

Answer (2-3 sentences, natural and friendly):"""

        response = requests.post(
            'http://localhost:11434/api/generate',
            json={
                "model": "llama3.2:1b",
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.2,
                    "num_predict": 120,
                    "top_k": 20,
                    "top_p": 0.7
                }
            },
            timeout=15
        )
        
        if response.status_code == 200:
            respuesta = response.json()['response'].strip()
            
            # Limpiar prefijos
            prefixes = ["Answer:", "Response:", "Respuesta:", "Resposta:"]
            for prefix in prefixes:
                if respuesta.lower().startswith(prefix.lower()):
                    respuesta = respuesta[len(prefix):].strip()
                    break
            
            respuesta = respuesta.strip('"').strip("'").strip()
            
            # Extraer IDs mencionados
            import re
            ids_encontrados = re.findall(r'\[ID:(\d+)\]', respuesta)
            posts_mencionados = [int(id) for id in ids_encontrados]
            
            if len(respuesta) > 10:
                return respuesta, posts_mencionados
    
    except Exception as e:
        print(f"Error en IA: {e}")
    
    # Fallback si la IA falla
    respuesta_simple, posts_ids = generar_respuesta_simple(pregunta, anuncios, idioma)
    return respuesta_simple, posts_ids

def generar_respuesta_simple(pregunta, anuncios, idioma='english'):
    """
    Genera respuesta simple sin IA (fallback) - búsqueda por keywords
    """
    pregunta_lower = pregunta.lower()
    
    # Buscar posts que coincidan con palabras clave de la pregunta
    palabras_pregunta = pregunta_lower.split()
    posts_relevantes = []
    
    for anuncio in anuncios:
        titulo_lower = anuncio['titulo'].lower()
        desc_lower = anuncio['descripcion'].lower()
        
        # Si alguna palabra de la pregunta está en el título o descripción
        for palabra in palabras_pregunta:
            if len(palabra) > 3:  # Solo palabras significativas
                if palabra in titulo_lower or palabra in desc_lower:
                    if anuncio not in posts_relevantes:
                        posts_relevantes.append(anuncio)
                    break
    
    # Si encontramos posts relevantes, devolver esos
    if posts_relevantes:
        ids = [p['id'] for p in posts_relevantes[:5]]
        if idioma == 'spanish':
            msg = f"Encontré {len(posts_relevantes)} anuncios relevantes: "
        elif idioma == 'catalan':
            msg = f"He trobat {len(posts_relevantes)} anuncis rellevants: "
        else:
            msg = f"Found {len(posts_relevantes)} relevant posts: "
        
        titulos = [f"[ID:{p['id']}] {p['titulo']}" for p in posts_relevantes[:5]]
        return msg + ', '.join(titulos), ids
    
    # Si no encontramos nada específico, usar categorías
    # Contar por categorías
    eventos = [a for a in anuncios if a['categoria'] == 'evento']
    servicios = [a for a in anuncios if a['categoria'] == 'servicio']
    productos = [a for a in anuncios if a['categoria'] == 'producto']
    
    # Traducciones según idioma
    traducciones = {
        'english': {
            'total': f"Currently we have {len(anuncios)} posts available: {len(eventos)} events, {len(servicios)} services, and {len(productos)} products/rentals.",
            'events_found': f"We have {len(eventos)} events available: ",
            'no_events': "No events available at the moment.",
            'services_found': f"We have {len(servicios)} services available: ",
            'no_services': "No tutoring services available at the moment.",
            'products_found': f"We have {len(productos)} products/rentals available: ",
            'no_products': "No products or rentals available at the moment.",
            'check': "Check them out!",
            'contact': "Feel free to contact them!"
        },
        'spanish': {
            'total': f"Actualmente tenemos {len(anuncios)} anuncios disponibles: {len(eventos)} eventos, {len(servicios)} servicios y {len(productos)} productos/alquileres.",
            'events_found': f"Tenemos {len(eventos)} eventos disponibles: ",
            'no_events': "No hay eventos disponibles en este momento.",
            'services_found': f"Tenemos {len(servicios)} servicios disponibles: ",
            'no_services': "No hay servicios de tutoría disponibles en este momento.",
            'products_found': f"Tenemos {len(productos)} productos/alquileres disponibles: ",
            'no_products': "No hay productos o alquileres disponibles en este momento.",
            'check': "¡Échales un vistazo!",
            'contact': "¡No dudes en contactarlos!"
        },
        'catalan': {
            'total': f"Actualment tenim {len(anuncios)} anuncis disponibles: {len(eventos)} esdeveniments, {len(servicios)} serveis i {len(productos)} productes/lloguers.",
            'events_found': f"Tenim {len(eventos)} esdeveniments disponibles: ",
            'no_events': "No hi ha esdeveniments disponibles en aquest moment.",
            'services_found': f"Tenim {len(servicios)} serveis disponibles: ",
            'no_services': "No hi ha serveis de tutoria disponibles en aquest moment.",
            'products_found': f"Tenim {len(productos)} productes/lloguers disponibles: ",
            'no_products': "No hi ha productes o lloguers disponibles en aquest moment.",
            'check': "Dona'ls una ullada!",
            'contact': "No dubtis en contactar-los!"
        }
    }
    
    t = traducciones.get(idioma, traducciones['english'])
    
    # Extraer IDs de respuestas
    import re
    
    # Respuestas según keywords
    if any(word in pregunta_lower for word in ['how many', 'cuantos', 'quants', 'count', 'total']):
        return t['total'], []
    
    elif any(word in pregunta_lower for word in ['event', 'party', 'parties', 'evento', 'esdeveniments']):
        if eventos:
            ids = [e['id'] for e in eventos[:3]]
            titulos = [f"[ID:{e['id']}] {e['titulo']}" for e in eventos[:3]]
            return t['events_found'] + ', '.join(titulos) + '. ' + t['check'], ids
        return t['no_events'], []
    
    elif any(word in pregunta_lower for word in ['tutor', 'class', 'lesson', 'servicio', 'servei', 'help', 'ayuda']):
        if servicios:
            ids = [s['id'] for s in servicios[:3]]
            titulos = [f"[ID:{s['id']}] {s['titulo']}" for s in servicios[:3]]
            return t['services_found'] + ', '.join(titulos) + '. ' + t['contact'], ids
        return t['no_services'], []
    
    elif any(word in pregunta_lower for word in ['room', 'apartment', 'rent', 'buy', 'producto', 'producte', 'sell', 'habitació', 'pis']):
        if productos:
            ids = [p['id'] for p in productos[:3]]
            titulos = [f"[ID:{p['id']}] {p['titulo']}" for p in productos[:3]]
            return t['products_found'] + ', '.join(titulos) + '. ' + t['check'], ids
        return t['no_products'], []
    
    # Respuesta genérica según idioma
    if idioma == 'spanish':
        return f"Actualmente tenemos {len(anuncios)} anuncios en el tablero. ¿Sobre qué categoría te gustaría saber más?", []
    elif idioma == 'catalan':
        return f"Actualment tenim {len(anuncios)} anuncis al tauler. Sobre quina categoria t'agradaria saber més?", []
    else:
        return f"We currently have {len(anuncios)} posts on the board. What category would you like to know more about?", []

if __name__ == '__main__':
    app.run(debug=True, port=5000)
