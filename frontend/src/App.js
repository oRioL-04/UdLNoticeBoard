import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000/api';

// Traducciones
const translations = {
  es: {
    title: '📋 Tablero de Anuncios UdL',
    subtitle: 'Encuentra eventos, servicios y productos en tu universidad',
    all: 'Todos',
    events: '🎭 Eventos',
    services: '💼 Servicios',
    products: '🛍️ Productos/Alquileres',
    createPost: '➕ Crear Anuncio',
    aiAssistant: '💬 Asistente IA',
    calendar: 'Calendario',
    search: '🔍 Buscar anuncios por título o descripción...',
    noResults: 'No se encontraron resultados para',
    noPosts: 'No hay anuncios en esta categoría',
    free: 'Gratis',
    price: '💰 Precio',
    location: '📍 Ubicación',
    contact: '📞 Contacto',
    published: '📅 Publicado',
    eventDate: '📅 Fecha del evento',
    edit: '✏️ Editar',
    delete: '🗑️ Eliminar',
    report: '⚠️ Reportar',
    createNew: 'Crear Nuevo Anuncio',
    editPost: 'Editar Anuncio',
    title_label: 'Título',
    description: 'Descripción',
    category: 'Categoría',
    priceField: 'Precio (€)',
    eventDateField: 'Fecha del Evento',
    termsAccept: 'Acepto los',
    termsLink: 'términos y condiciones',
    termsText: 'Al publicar, aceptas seguir las normas universitarias y proporcionar información veraz.',
    create: 'Crear',
    update: 'Actualizar',
    cancel: 'Cancelar',
    deleteConfirm: '¿Estás seguro de que quieres eliminar este anuncio?',
    reportConfirm: '¿Quieres reportar este anuncio como inapropiado?',
    reportSuccess: 'Anuncio reportado. Será revisado por los administradores.',
    termsRequired: 'Debes aceptar las condiciones de uso para continuar'
  },
  ca: {
    title: '📋 Tauler d\'Anuncis UdL',
    subtitle: 'Troba esdeveniments, serveis i productes a la teva universitat',
    all: 'Tots',
    events: '🎭 Esdeveniments',
    services: '💼 Serveis',
    products: '🛍️ Productes/Lloguers',
    createPost: '➕ Crear Anunci',
    aiAssistant: '💬 Assistant IA',
    calendar: 'Calendari',
    search: '🔍 Cercar anuncis per títol o descripció...',
    noResults: 'No s\'han trobat resultats per',
    noPosts: 'No hi ha anuncis en aquesta categoria',
    free: 'Gratuït',
    price: '💰 Preu',
    location: '📍 Ubicació',
    contact: '📞 Contacte',
    published: '📅 Publicat',
    eventDate: '📅 Data de l\'esdeveniment',
    edit: '✏️ Editar',
    delete: '🗑️ Eliminar',
    report: '⚠️ Reportar',
    createNew: 'Crear Nou Anunci',
    editPost: 'Editar Anunci',
    title_label: 'Títol',
    description: 'Descripció',
    category: 'Categoria',
    priceField: 'Preu (€)',
    eventDateField: 'Data de l\'Esdeveniment',
    termsAccept: 'Accepto els',
    termsLink: 'termes i condicions',
    termsText: 'En publicar, acceptes seguir les normes universitàries i proporcionar informació veraç.',
    create: 'Crear',
    update: 'Actualitzar',
    cancel: 'Cancel·lar',
    deleteConfirm: 'Estàs segur que vols eliminar aquest anunci?',
    reportConfirm: 'Vols reportar aquest anunci com a inapropiat?',
    reportSuccess: 'Anunci reportat. Serà revisat pels administradors.',
    termsRequired: 'Has d\'acceptar les condicions d\'ús per continuar'
  },
  en: {
    title: '📋 UdL Notice Board',
    subtitle: 'Find events, services and products at your university',
    all: 'All',
    events: '🎭 Events',
    services: '💼 Services',
    products: '🛍️ Products/Rentals',
    createPost: '➕ Create Post',
    aiAssistant: '💬 AI Assistant',
    calendar: 'Calendar',
    search: '🔍 Search posts by title or description...',
    noResults: 'No results found for',
    noPosts: 'No posts in this category',
    free: 'Free',
    price: '💰 Price',
    location: '📍 Location',
    contact: '📞 Contact',
    published: '📅 Published',
    eventDate: '📅 Event Date',
    edit: '✏️ Edit',
    delete: '🗑️ Delete',
    report: '⚠️ Report',
    createNew: 'Create New Post',
    editPost: 'Edit Post',
    title_label: 'Title',
    description: 'Description',
    category: 'Category',
    priceField: 'Price (€)',
    eventDateField: 'Event Date',
    termsAccept: 'I accept the',
    termsLink: 'terms and conditions',
    termsText: 'By posting, you agree to follow university guidelines and provide accurate information.',
    create: 'Create',
    update: 'Update',
    cancel: 'Cancel',
    deleteConfirm: 'Are you sure you want to delete this post?',
    reportConfirm: 'Do you want to report this post as inappropriate?',
    reportSuccess: 'Post reported. It will be reviewed by administrators.',
    termsRequired: 'You must accept the terms of use to continue'
  }
};

function App() {
  const [idioma, setIdioma] = useState('en');
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
    imagen_url: '',
    fecha_evento: ''
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
  const [busqueda, setBusqueda] = useState('');
  const [modoEdicion, setModoEdicion] = useState(false);
  const [anuncioEditando, setAnuncioEditando] = useState(null);
  const [aceptaCondiciones, setAceptaCondiciones] = useState(false);
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [eventosCalendario, setEventosCalendario] = useState([]);

  const t = translations[idioma]; // Helper para traducciones

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
    
    if (!aceptaCondiciones) {
      alert(t.termsRequired);
      return;
    }
    
    try {
      if (modoEdicion && anuncioEditando) {
        // Actualizar anuncio existente
        await axios.put(`${API_URL}/anuncios/${anuncioEditando.id}`, nuevoAnuncio);
      } else {
        // Crear nuevo anuncio
        await axios.post(`${API_URL}/anuncios`, nuevoAnuncio);
      }
      
      setMostrarFormulario(false);
      setModoEdicion(false);
      setAnuncioEditando(null);
      setNuevoAnuncio({
        titulo: '',
        descripcion: '',
        categoria: 'evento',
        precio: '',
        ubicacion: '',
        contacto: '',
        imagen_url: '',
        fecha_evento: ''
      });
      setImagenPreview(null);
      setAceptaCondiciones(false);
      cargarAnuncios();
    } catch (error) {
      console.error('Error al crear/actualizar anuncio:', error);
      alert('Error al procesar el anuncio. Por favor, intenta de nuevo.');
    }
  };

  const handleEditarAnuncio = (anuncio) => {
    setModoEdicion(true);
    setAnuncioEditando(anuncio);
    setNuevoAnuncio({
      titulo: anuncio.titulo,
      descripcion: anuncio.descripcion,
      categoria: anuncio.categoria,
      precio: anuncio.precio,
      ubicacion: anuncio.ubicacion,
      contacto: anuncio.contacto,
      imagen_url: anuncio.imagen_url,
      fecha_evento: anuncio.fecha_evento || ''
    });
    setImagenPreview(anuncio.imagen_url);
    setAceptaCondiciones(true); // Ya aceptó al crear
    setAnuncioSeleccionado(null);
    setMostrarFormulario(true);
  };

  const handleEliminarAnuncio = async (id) => {
    if (window.confirm(t.deleteConfirm)) {
      try {
        await axios.delete(`${API_URL}/anuncios/${id}`);
        setAnuncioSeleccionado(null);
        cargarAnuncios();
      } catch (error) {
        console.error('Error al eliminar anuncio:', error);
        alert('Error al eliminar el anuncio. Por favor, intenta de nuevo.');
      }
    }
  };

  const handleReportarAnuncio = (id) => {
    if (window.confirm(t.reportConfirm)) {
      // Aquí podrías hacer una llamada al backend para registrar el reporte
      alert(t.reportSuccess);
      setAnuncioSeleccionado(null);
    }
  };

  const cargarEventosCalendario = async () => {
    try {
      const response = await axios.get(`${API_URL}/eventos/calendario`);
      setEventosCalendario(response.data);
      setMostrarCalendario(true);
    } catch (error) {
      console.error('Error al cargar eventos del calendario:', error);
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
        <div className="header-content">
          <div>
            <h1>{t.title}</h1>
            <p>{t.subtitle}</p>
          </div>
          <div className="language-selector">
            <button 
              className={idioma === 'es' ? 'lang-btn active' : 'lang-btn'}
              onClick={() => setIdioma('es')}
            >
              🇪🇸 ES
            </button>
            <button 
              className={idioma === 'ca' ? 'lang-btn active' : 'lang-btn'}
              onClick={() => setIdioma('ca')}
            >
              <img src="/bandera-catalana.jpg" alt="CA" style={{width: '20px', height: '14px', marginRight: '5px', borderRadius: '2px'}} /> CA
            </button>
            <button 
              className={idioma === 'en' ? 'lang-btn active' : 'lang-btn'}
              onClick={() => setIdioma('en')}
            >
              🇬🇧 EN
            </button>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="filtros">
          <button
            className={categoriaSeleccionada === 'todos' ? 'filtro-btn active' : 'filtro-btn'}
            onClick={() => setCategoriaSeleccionada('todos')}
          >
            {t.all}
          </button>
          <button
            className={categoriaSeleccionada === 'evento' ? 'filtro-btn active' : 'filtro-btn'}
            onClick={() => setCategoriaSeleccionada('evento')}
          >
            {t.events}
          </button>
          <button
            className={categoriaSeleccionada === 'servicio' ? 'filtro-btn active' : 'filtro-btn'}
            onClick={() => setCategoriaSeleccionada('servicio')}
          >
            {t.services}
          </button>
          <button
            className={categoriaSeleccionada === 'producto' ? 'filtro-btn active' : 'filtro-btn'}
            onClick={() => setCategoriaSeleccionada('producto')}
          >
            {t.products}
          </button>
          <button
            className="crear-btn"
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
          >
            {t.createPost}
          </button>
          <button
            className="calendar-btn"
            onClick={cargarEventosCalendario}
          >
            {t.calendar}
          </button>
          <button
            className="chat-btn"
            onClick={() => setMostrarChat(!mostrarChat)}
          >
            {t.aiAssistant}
          </button>
        </div>

        {mostrarFormulario && (
          <div className="modal" onClick={() => {
            setMostrarFormulario(false);
            setModoEdicion(false);
            setAnuncioEditando(null);
            setAceptaCondiciones(false);
          }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{modoEdicion ? t.editPost : t.createNew} {aiStatus.status === 'available' && '🤖'}</h2>
              {aiStatus.status === 'available' && (
                <div style={{background: '#f0f9ff', padding: '8px 12px', borderRadius: '6px', marginBottom: '12px', fontSize: '0.85rem', color: '#0369a1'}}>
                  ✨ AI description generator available
                </div>
              )}
              <form onSubmit={handleCrearAnuncio}>
                <div style={{position: 'relative'}}>
                  <label style={{display: 'block', marginBottom: '0.3rem', fontWeight: '600', color: '#333'}}>
                    {t.title_label} <span style={{color: '#ff4d4f'}}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder={t.title_label}
                    value={nuevoAnuncio.titulo}
                    onChange={(e) => setNuevoAnuncio({...nuevoAnuncio, titulo: e.target.value})}
                    required
                  />
                </div>
                <div style={{position: 'relative'}}>
                  <label style={{display: 'block', marginBottom: '0.3rem', fontWeight: '600', color: '#333'}}>
                    {t.description} <span style={{color: '#ff4d4f'}}>*</span>
                  </label>
                  <textarea
                    placeholder={t.description}
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
                <div>
                  <label style={{display: 'block', marginBottom: '0.3rem', fontWeight: '600', color: '#333'}}>
                    {t.category} <span style={{color: '#ff4d4f'}}>*</span>
                  </label>
                  <select
                    value={nuevoAnuncio.categoria}
                    onChange={(e) => setNuevoAnuncio({...nuevoAnuncio, categoria: e.target.value})}
                  >
                    <option value="evento">{t.events}</option>
                    <option value="servicio">{t.services}</option>
                    <option value="producto">{t.products}</option>
                  </select>
                </div>
                
                {nuevoAnuncio.categoria === 'evento' && (
                  <div>
                    <label style={{display: 'block', marginBottom: '0.3rem', fontWeight: '600', color: '#333'}}>
                      {t.eventDateField}
                    </label>
                    <input
                      type="date"
                      value={nuevoAnuncio.fecha_evento}
                      onChange={(e) => setNuevoAnuncio({...nuevoAnuncio, fecha_evento: e.target.value})}
                    />
                  </div>
                )}
                
                <div>
                  <label style={{display: 'block', marginBottom: '0.3rem', fontWeight: '600', color: '#333'}}>
                    {t.priceField}
                  </label>
                  <input
                    type="number"
                    placeholder={t.priceField}
                    value={nuevoAnuncio.precio}
                    onChange={(e) => setNuevoAnuncio({...nuevoAnuncio, precio: e.target.value})}
                  />
                  <small style={{display: 'block', marginTop: '0.3rem', color: '#666', fontSize: '0.75rem'}}>
                    {idioma === 'es' ? 'Déjalo vacío si es gratis' : idioma === 'ca' ? 'Deixa-ho buit si és gratuït' : 'Leave empty if free'}
                  </small>
                </div>
                
                <input
                  type="text"
                  placeholder={t.location}
                  value={nuevoAnuncio.ubicacion}
                  onChange={(e) => setNuevoAnuncio({...nuevoAnuncio, ubicacion: e.target.value})}
                />
                <input
                  type="text"
                  placeholder={t.contact}
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

                <div style={{marginTop: '1rem', padding: '1rem', background: '#f9f9f9', borderRadius: '8px'}}>
                  <label style={{display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '0.5rem'}}>
                    <input
                      type="checkbox"
                      checked={aceptaCondiciones}
                      onChange={(e) => setAceptaCondiciones(e.target.checked)}
                      required
                      style={{width: 'auto', cursor: 'pointer'}}
                    />
                    <span style={{fontSize: '0.9rem', color: '#333'}}>
                      {t.termsAccept} <a href="https://www.qad.com/documents/legal/terms-spain.pdf" target="_blank" rel="noopener noreferrer" style={{color: '#8c0f57', textDecoration: 'underline'}}>{t.termsLink}</a> <span style={{color: '#ff4d4f'}}>*</span>
                    </span>
                  </label>
                  <small style={{display: 'block', marginTop: '0.5rem', color: '#666', fontSize: '0.75rem', marginLeft: '1.5rem'}}>
                    {t.termsText}
                  </small>
                </div>

                <div className="form-buttons">
                  <button type="submit" className="btn-submit" disabled={!aceptaCondiciones}>
                    {modoEdicion ? t.update : t.create}
                  </button>
                  <button type="button" className="btn-cancel" onClick={() => {
                    setMostrarFormulario(false);
                    setModoEdicion(false);
                    setAnuncioEditando(null);
                    setAceptaCondiciones(false);
                  }}>{t.cancel}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {mostrarCalendario && (
          <div className="modal" onClick={() => setMostrarCalendario(false)}>
            <div className="modal-content calendario-modal" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setMostrarCalendario(false)}>✕</button>
              <h2>📅 {t.calendar}</h2>
              <div className="eventos-calendario">
                {eventosCalendario.length === 0 ? (
                  <p style={{textAlign: 'center', padding: '2rem', color: '#999'}}>
                    {idioma === 'es' ? 'No hay eventos programados' : idioma === 'ca' ? 'No hi ha esdeveniments programats' : 'No scheduled events'}
                  </p>
                ) : (
                  eventosCalendario.map((evento) => (
                    <div 
                      key={evento.id} 
                      className="evento-calendario-item"
                      onClick={() => {
                        setAnuncioSeleccionado(evento);
                        setMostrarCalendario(false);
                      }}
                    >
                      <div className="evento-fecha">
                        <div className="fecha-dia">
                          {new Date(evento.fecha_evento).getDate()}
                        </div>
                        <div className="fecha-mes">
                          {new Date(evento.fecha_evento).toLocaleDateString(idioma, { month: 'short' })}
                        </div>
                      </div>
                      <div className="evento-info">
                        <h3>{evento.titulo}</h3>
                        <p>{evento.descripcion.substring(0, 100)}...</p>
                        <div className="evento-detalles">
                          <span>📍 {evento.ubicacion}</span>
                          <span>{evento.precio === 0 ? t.free : `€${evento.precio}`}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
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
                  {esperandoRespuesta ? '⏳' : '➤'}
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
                <p><strong>{t.price}:</strong> {anuncioSeleccionado.precio === 0 ? t.free : `€${anuncioSeleccionado.precio}`}</p>
                <p><strong>{t.location}:</strong> {anuncioSeleccionado.ubicacion}</p>
                <p><strong>{t.contact}:</strong> {anuncioSeleccionado.contacto}</p>
                {anuncioSeleccionado.fecha_evento && (
                  <p><strong>{t.eventDate}:</strong> {new Date(anuncioSeleccionado.fecha_evento).toLocaleDateString(idioma, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                )}
                <p><strong>{t.published}:</strong> {new Date(anuncioSeleccionado.fecha_creacion).toLocaleDateString(idioma)}</p>
              </div>
              <div className="detalle-acciones">
                <button 
                  className="btn-editar"
                  onClick={() => handleEditarAnuncio(anuncioSeleccionado)}
                >
                  {t.edit}
                </button>
                <button 
                  className="btn-eliminar"
                  onClick={() => handleEliminarAnuncio(anuncioSeleccionado.id)}
                >
                  {t.delete}
                </button>
                <button 
                  className="btn-reportar"
                  onClick={() => handleReportarAnuncio(anuncioSeleccionado.id)}
                >
                  {t.report}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="buscador-container">
          <input
            type="text"
            placeholder={t.search}
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="buscador-input"
          />
          {busqueda && (
            <button 
              className="limpiar-busqueda-btn"
              onClick={() => setBusqueda('')}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <div className="anuncios-grid">
          {anuncios.filter(anuncio => {
            if (!busqueda) return true;
            const searchLower = busqueda.toLowerCase();
            return anuncio.titulo.toLowerCase().includes(searchLower) || 
                   anuncio.descripcion.toLowerCase().includes(searchLower) ||
                   anuncio.ubicacion.toLowerCase().includes(searchLower);
          }).length === 0 ? (
            <p className="no-anuncios">
              {busqueda ? `${t.noResults} "${busqueda}"` : t.noPosts}
            </p>
          ) : (
            anuncios.filter(anuncio => {
              if (!busqueda) return true;
              const searchLower = busqueda.toLowerCase();
              return anuncio.titulo.toLowerCase().includes(searchLower) || 
                     anuncio.descripcion.toLowerCase().includes(searchLower) ||
                     anuncio.ubicacion.toLowerCase().includes(searchLower);
            }).map((anuncio) => (
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
