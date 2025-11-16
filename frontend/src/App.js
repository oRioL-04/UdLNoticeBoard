import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [anuncios, setAnuncios] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todos');
  const [anuncioSeleccionado, setAnuncioSeleccionado] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevoAnuncio, setNuevoAnuncio] = useState({
    titulo: '',
    descripcion: '',
    categoria: 'evento',
    precio: '',
    ubicacion: '',
    contacto: '',
    imagen_url: ''
  });
  const [aiStatus, setAiStatus] = useState({ status: 'checking', method: '' });
  const [generatingDescription, setGeneratingDescription] = useState(false);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [mostrarChat, setMostrarChat] = useState(false);
  const [mensajesChat, setMensajesChat] = useState([]);
  const [preguntaChat, setPreguntaChat] = useState('');
  const [esperandoRespuesta, setEsperandoRespuesta] = useState(false);
  const [chatActivo, setChatActivo] = useState(false); // Para mantener el chat abierto

  useEffect(() => {
    cargarAnuncios();
  }, [categoriaSeleccionada]);

  // Check AI status on mount
  useEffect(() => {
    axios.get(`${API_URL}/ai/status`)
      .then(res => setAiStatus(res.data))
      .catch(() => setAiStatus({ status: 'fallback', method: 'keywords' }));
  }, []);

  // Function to generate description from title
  const handleGenerateDescription = async () => {
    if (nuevoAnuncio.titulo.length < 3) {
      alert('Please enter a title first');
      return;
    }
    
    setGeneratingDescription(true);
    
    try {
      const response = await axios.post(`${API_URL}/anuncios/generate-description`, {
        titulo: nuevoAnuncio.titulo,
        categoria: nuevoAnuncio.categoria
      });
      
      setNuevoAnuncio(prev => ({
        ...prev,
        descripcion: response.data.descripcion
      }));
    } catch (error) {
      console.error('Error generating description:', error);
      alert('Could not generate description. Please try again.');
    }
    
    setGeneratingDescription(false);
  };

  // Function to handle chat
  const handleEnviarPregunta = async (e) => {
    e.preventDefault();
    
    if (!preguntaChat.trim()) return;
    
    // Añadir pregunta del usuario al chat
    const nuevaPregunta = { tipo: 'usuario', texto: preguntaChat };
    setMensajesChat(prev => [...prev, nuevaPregunta]);
    setPreguntaChat('');
    setEsperandoRespuesta(true);
    
    try {
      const response = await axios.post(`${API_URL}/chat`, {
        pregunta: preguntaChat
      });
      
      // Añadir respuesta de la IA al chat con posts mencionados
      const respuestaIA = { 
        tipo: 'ia', 
        texto: response.data.respuesta,
        posts: response.data.posts || []
      };
      setMensajesChat(prev => [...prev, respuestaIA]);
    } catch (error) {
      console.error('Error in chat:', error);
      const errorMsg = { tipo: 'ia', texto: 'Sorry, I could not process your question. Please try again.' };
      setMensajesChat(prev => [...prev, errorMsg]);
    }
    
    setEsperandoRespuesta(false);
  };

  const handleClickPost = (postId) => {
    // Buscar el post por ID
    const post = anuncios.find(a => a.id === postId);
    if (post) {
      setAnuncioSeleccionado(post);
      setChatActivo(mostrarChat); // Guardar si el chat estaba abierto
      setMostrarChat(false); // Cerrar el chat temporalmente
    }
  };

  const handleCerrarPost = () => {
    setAnuncioSeleccionado(null);
    if (chatActivo) {
      setMostrarChat(true); // Reabrir el chat si estaba activo
      setChatActivo(false);
    }
  };

  const handleLimpiarChat = () => {
    setMensajesChat([]);
  };

  const renderMensajeConLinks = (mensaje) => {
    // Buscar patrones [ID:X] en el texto
    const regex = /\[ID:(\d+)\]/g;
    const partes = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(mensaje.texto)) !== null) {
      // Añadir texto antes del match
      if (match.index > lastIndex) {
        partes.push({
          tipo: 'texto',
          contenido: mensaje.texto.substring(lastIndex, match.index)
        });
      }
      
      // Añadir el link
      partes.push({
        tipo: 'link',
        id: parseInt(match[1]),
        contenido: match[0]
      });
      
      lastIndex = match.index + match[0].length;
    }
    
    // Añadir texto restante
    if (lastIndex < mensaje.texto.length) {
      partes.push({
        tipo: 'texto',
        contenido: mensaje.texto.substring(lastIndex)
      });
    }
    
    return partes.length > 0 ? partes : [{ tipo: 'texto', contenido: mensaje.texto }];
  };

  const cargarAnuncios = async () => {
    try {
      const response = await axios.get(`${API_URL}/anuncios`, {
        params: { categoria: categoriaSeleccionada }
      });
      setAnuncios(response.data);
    } catch (error) {
      console.error('Error al cargar anuncios:', error);
    }
  };

  const handleImagenChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Verificar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image is too large. Maximum size is 5MB.');
      return;
    }

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagenPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Subir al servidor
    setSubiendoImagen(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${API_URL}/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Actualizar URL de la imagen
      const imageUrl = `http://localhost:5000${response.data.image_url}`;
      setNuevoAnuncio({...nuevoAnuncio, imagen_url: imageUrl});
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setSubiendoImagen(false);
    }
  };

  const handleCrearAnuncio = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/anuncios`, nuevoAnuncio);
      setMostrarFormulario(false);
      setNuevoAnuncio({
        titulo: '',
        descripcion: '',
        categoria: 'evento',
        precio: '',
        ubicacion: '',
        contacto: '',
        imagen_url: ''
      });
      setImagenPreview(null);
      cargarAnuncios();
    } catch (error) {
      console.error('Error al crear anuncio:', error);
    }
  };

  const getCategoriaLabel = (categoria) => {
    const labels = {
      'evento': 'Events',
      'servicio': 'Services',
      'producto': 'Products/Rentals'
    };
    return labels[categoria] || categoria;
  };

  const getCategoriaColor = (categoria) => {
    const colors = {
      'evento': '#13c2c2',
      'servicio': '#52c41a',
      'producto': '#fa8c16'
    };
    return colors[categoria] || '#666';
  };

  return (
    <div className="App">
      <header className="header">
        <h1>📋 UdL Notice Board</h1>
        <p>Find events, services and products at your university</p>
      </header>

      <div className="container">
        <div className="filtros">
          <button
            className={categoriaSeleccionada === 'todos' ? 'filtro-btn active' : 'filtro-btn'}
            onClick={() => setCategoriaSeleccionada('todos')}
          >
            All
          </button>
          <button
            className={categoriaSeleccionada === 'evento' ? 'filtro-btn active' : 'filtro-btn'}
            onClick={() => setCategoriaSeleccionada('evento')}
          >
            🎭 Events
          </button>
          <button
            className={categoriaSeleccionada === 'servicio' ? 'filtro-btn active' : 'filtro-btn'}
            onClick={() => setCategoriaSeleccionada('servicio')}
          >
            💼 Services
          </button>
          <button
            className={categoriaSeleccionada === 'producto' ? 'filtro-btn active' : 'filtro-btn'}
            onClick={() => setCategoriaSeleccionada('producto')}
          >
            🛍️ Products/Rentals
          </button>
          <button
            className="crear-btn"
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
          >
            ➕ Create Post
          </button>
          <button
            className="chat-btn"
            onClick={() => setMostrarChat(!mostrarChat)}
          >
            💬 AI Assistant
          </button>
        </div>

        {mostrarFormulario && (
          <div className="modal" onClick={() => setMostrarFormulario(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Create New Post {aiStatus.status === 'available' && '🤖'}</h2>
              {aiStatus.status === 'available' && (
                <div style={{background: '#f0f9ff', padding: '8px 12px', borderRadius: '6px', marginBottom: '12px', fontSize: '0.85rem', color: '#0369a1'}}>
                  ✨ AI description generator available
                </div>
              )}
              <form onSubmit={handleCrearAnuncio}>
                <input
                  type="text"
                  placeholder="Title"
                  value={nuevoAnuncio.titulo}
                  onChange={(e) => setNuevoAnuncio({...nuevoAnuncio, titulo: e.target.value})}
                  required
                />
                <div style={{position: 'relative'}}>
                  <textarea
                    placeholder="Description"
                    value={nuevoAnuncio.descripcion}
                    onChange={(e) => setNuevoAnuncio({...nuevoAnuncio, descripcion: e.target.value})}
                    required
                    style={{width: '100%'}}
                  />
                  <button
                    type="button"
                    onClick={handleGenerateDescription}
                    disabled={generatingDescription || nuevoAnuncio.titulo.length < 3}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      bottom: '10px',
                      background: '#8c0f57',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      cursor: generatingDescription ? 'wait' : 'pointer',
                      fontSize: '0.85rem',
                      opacity: generatingDescription || nuevoAnuncio.titulo.length < 3 ? 0.5 : 1
                    }}
                  >
                    {generatingDescription ? '🤖 Generating...' : '✨ AI Generate'}
                  </button>
                </div>
                {generatingDescription && (
                  <small style={{color: '#8c0f57', fontSize: '0.8rem', marginTop: '-8px'}}>
                    🤖 AI is writing a description for you...
                  </small>
                )}
                <select
                  value={nuevoAnuncio.categoria}
                  onChange={(e) => setNuevoAnuncio({...nuevoAnuncio, categoria: e.target.value})}
                >
                  <option value="evento">🎭 Event</option>
                  <option value="servicio">💼 Service</option>
                  <option value="producto">🛍️ Product/Rental</option>
                </select>
                <input
                  type="number"
                  placeholder="Price (€)"
                  value={nuevoAnuncio.precio}
                  onChange={(e) => setNuevoAnuncio({...nuevoAnuncio, precio: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={nuevoAnuncio.ubicacion}
                  onChange={(e) => setNuevoAnuncio({...nuevoAnuncio, ubicacion: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="Contact (email or phone)"
                  value={nuevoAnuncio.contacto}
                  onChange={(e) => setNuevoAnuncio({...nuevoAnuncio, contacto: e.target.value})}
                />
                
                <div style={{marginTop: '1rem'}}>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#8c0f57'}}>
                    📸 Upload Image (optional)
                  </label>
                  {imagenPreview && (
                    <div style={{marginBottom: '1rem', textAlign: 'center'}}>
                      <img 
                        src={imagenPreview} 
                        alt="Preview" 
                        style={{maxWidth: '200px', maxHeight: '200px', borderRadius: '8px', border: '2px solid #8c0f57'}}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagenPreview(null);
                          setNuevoAnuncio({...nuevoAnuncio, imagen_url: ''});
                        }}
                        style={{
                          display: 'block',
                          margin: '0.5rem auto',
                          background: '#ff4d4f',
                          color: 'white',
                          border: 'none',
                          padding: '4px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                      >
                        ✕ Remove
                      </button>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImagenChange}
                    disabled={subiendoImagen}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px dashed #8c0f57',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: '#fafafa'
                    }}
                  />
                  {subiendoImagen && (
                    <small style={{color: '#8c0f57', fontSize: '0.8rem'}}>
                      📤 Uploading image...
                    </small>
                  )}
                  <small style={{display: 'block', marginTop: '0.3rem', color: '#666', fontSize: '0.75rem'}}>
                    PNG, JPG, GIF up to 5MB
                  </small>
                </div>

                <div className="form-buttons">
                  <button type="submit" className="btn-submit">Create</button>
                  <button type="button" className="btn-cancel" onClick={() => setMostrarFormulario(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {mostrarChat && (
          <div className="modal" onClick={() => setMostrarChat(false)}>
            <div className="modal-content chat-modal" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setMostrarChat(false)}>✕</button>
              <h2>💬 AI Assistant</h2>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                <p style={{fontSize: '0.9rem', color: '#666', margin: 0}}>
                  Ask me anything about the posts on the board!
                </p>
                {mensajesChat.length > 0 && (
                  <button 
                    className="limpiar-chat-btn" 
                    onClick={handleLimpiarChat}
                    title="Clear conversation"
                  >
                    🗑️ Clear
                  </button>
                )}
              </div>
              
              <div className="chat-mensajes">
                {mensajesChat.length === 0 && (
                  <div style={{textAlign: 'center', padding: '2rem', color: '#999'}}>
                    <p>👋 Hi! I'm your AI assistant.</p>
                    <p style={{fontSize: '0.85rem', marginTop: '0.5rem'}}>
                      Try asking:<br/>
                      "What events are available?"<br/>
                      "Are there any tutoring services?"<br/>
                      "Show me rooms for rent"
                    </p>
                  </div>
                )}
                
                {mensajesChat.map((mensaje, index) => (
                  <div 
                    key={index} 
                    className={`chat-mensaje ${mensaje.tipo === 'usuario' ? 'usuario' : 'ia'}`}
                  >
                    <div className="mensaje-icono">
                      {mensaje.tipo === 'usuario' ? '👤' : '🤖'}
                    </div>
                    <div className="mensaje-texto">
                      {mensaje.tipo === 'usuario' ? (
                        mensaje.texto
                      ) : (
                        renderMensajeConLinks(mensaje).map((parte, idx) => (
                          parte.tipo === 'link' ? (
                            <span 
                              key={idx}
                              className="post-link"
                              onClick={() => handleClickPost(parte.id)}
                            >
                              {parte.contenido}
                            </span>
                          ) : (
                            <span key={idx}>{parte.contenido}</span>
                          )
                        ))
                      )}
                    </div>
                  </div>
                ))}
                
                {esperandoRespuesta && (
                  <div className="chat-mensaje ia">
                    <div className="mensaje-icono">🤖</div>
                    <div className="mensaje-texto">
                      <span className="typing-indicator">Thinking...</span>
                    </div>
                  </div>
                )}
              </div>
              
              <form onSubmit={handleEnviarPregunta} className="chat-input-form">
                <input
                  type="text"
                  placeholder="Ask me about the posts..."
                  value={preguntaChat}
                  onChange={(e) => setPreguntaChat(e.target.value)}
                  disabled={esperandoRespuesta}
                  className="chat-input"
                />
                <button 
                  type="submit" 
                  disabled={!preguntaChat.trim() || esperandoRespuesta}
                  className="chat-send-btn"
                >
                  {esperandoRespuesta ? '⏳' : '📤'}
                </button>
              </form>
            </div>
          </div>
        )}

        {anuncioSeleccionado && (
          <div className="modal" onClick={handleCerrarPost}>
            <div className="modal-content detalle-anuncio" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={handleCerrarPost}>✕</button>
              <img src={anuncioSeleccionado.imagen_url} alt={anuncioSeleccionado.titulo} />
              <div className="detalle-header">
                <h2>{anuncioSeleccionado.titulo}</h2>
                <span 
                  className="categoria-badge"
                  style={{backgroundColor: getCategoriaColor(anuncioSeleccionado.categoria)}}
                >
                  {getCategoriaLabel(anuncioSeleccionado.categoria)}
                </span>
              </div>
              <p className="descripcion">{anuncioSeleccionado.descripcion}</p>
              <div className="detalle-info">
                <p><strong>💰 Price:</strong> {anuncioSeleccionado.precio === 0 ? 'Free' : `€${anuncioSeleccionado.precio}`}</p>
                <p><strong>📍 Location:</strong> {anuncioSeleccionado.ubicacion}</p>
                <p><strong>📞 Contact:</strong> {anuncioSeleccionado.contacto}</p>
                <p><strong>📅 Published:</strong> {new Date(anuncioSeleccionado.fecha_creacion).toLocaleDateString('en-US')}</p>
              </div>
            </div>
          </div>
        )}

        <div className="anuncios-grid">
          {anuncios.length === 0 ? (
            <p className="no-anuncios">No posts in this category</p>
          ) : (
            anuncios.map((anuncio) => (
              <div 
                key={anuncio.id} 
                className="anuncio-card"
                onClick={() => setAnuncioSeleccionado(anuncio)}
              >
                <img src={anuncio.imagen_url} alt={anuncio.titulo} />
                <div className="anuncio-content">
                  <div className="anuncio-header">
                    <h3>{anuncio.titulo}</h3>
                    <span 
                      className="categoria-badge"
                      style={{backgroundColor: getCategoriaColor(anuncio.categoria)}}
                    >
                      {getCategoriaLabel(anuncio.categoria)}
                    </span>
                  </div>
                  <p className="descripcion-corta">
                    {anuncio.descripcion.length > 80 
                      ? anuncio.descripcion.substring(0, 80) + '...' 
                      : anuncio.descripcion}
                  </p>
                  <div className="anuncio-footer">
                    <span className="precio">
                      {anuncio.precio === 0 ? 'Free' : `€${anuncio.precio}`}
                    </span>
                    <span className="ubicacion">📍 {anuncio.ubicacion}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
