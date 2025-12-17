import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000/api';

// Traducciones
const translations = {
  es: {
    title: 'Tablero de Anuncios UdL',
    subtitle: 'Encuentra eventos, servicios y productos en tu universidad',
    all: 'Todos',
    events: '🎭 Eventos',
    services: '💼 Servicios',
    products: '🛍️ Productos/Alquileres',
    createPost: 'Crear Anuncio',
    aiAssistant: 'Asistente IA',
    calendar: 'Calendario',
    search: 'Buscar anuncios por título o descripción...',
    noResults: 'No se encontraron resultados para',
    noPosts: 'No hay anuncios en esta categoría',
    free: 'Gratis',
    price: 'Precio',
    location: 'Ubicación',
    contact: 'Contacto',
    published: 'Publicado',
    eventDate: 'Fecha del evento',
    edit: 'Editar',
    delete: 'Eliminar',
    report: 'Reportar',
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
    termsRequired: 'Debes aceptar las condiciones de uso para continuar',
    // Grupos
    groups: 'Grupos',
    myGroups: 'Mis Grupos',
    allGroups: 'Todos los Grupos',
    joinGroup: 'Unirse',
    leaveGroup: 'Salir',
    members: 'miembros',
    schedule: 'Horario',
    full: 'LLENO',
    joined: 'UNIDO',
    noGroups: 'No hay grupos disponibles',
    noMyGroups: 'No te has unido a ningún grupo todavía',
    joinSuccess: 'Te has unido al grupo exitosamente',
    leaveSuccess: 'Has salido del grupo',
    groupFull: 'El grupo está lleno',
    leaveConfirm: '¿Estás seguro de que quieres salir de este grupo?',
    groupChat: 'Chat del Grupo',
    sendMessage: 'Enviar mensaje',
    typeMessage: 'Escribe un mensaje...',
    shareAnnouncement: 'Compartir en Grupo',
    sharedAnnouncement: 'compartió un anuncio',
    favorites: 'Favoritos',
    addToFavorites: 'Añadir a favoritos',
    removeFromFavorites: 'Quitar de favoritos',
    noFavorites: 'No tienes favoritos todavía',
    openChat: 'Abrir Chat',
    shareFavorite: 'Compartir Favorito',
    recommended: 'Recomendado para ti',
    basedOnPreferences: 'Basado en tus preferencias'
  },
  ca: {
    title: 'Tauler d\'Anuncis UdL',
    subtitle: 'Troba esdeveniments, serveis i productes a la teva universitat',
    all: 'Tots',
    events: '🎭 Esdeveniments',
    services: '💼 Serveis',
    products: '🛍️ Productes/Lloguers',
    createPost: 'Crear Anunci',
    aiAssistant: 'Assistant IA',
    calendar: 'Calendari',
    search: 'Cercar anuncis per títol o descripció...',
    noResults: 'No s\'han trobat resultats per',
    noPosts: 'No hi ha anuncis en aquesta categoria',
    free: 'Gratuït',
    price: 'Preu',
    location: 'Ubicació',
    contact: 'Contacte',
    published: 'Publicat',
    eventDate: 'Data de l\'esdeveniment',
    edit: 'Editar',
    delete: 'Eliminar',
    report: 'Reportar',
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
    termsRequired: 'Has d\'acceptar les condicions d\'ús per continuar',
    // Grupos
    groups: 'Grups',
    myGroups: 'Els Meus Grups',
    allGroups: 'Tots els Grups',
    joinGroup: 'Unir-se',
    leaveGroup: 'Sortir',
    members: 'membres',
    schedule: 'Horari',
    full: 'COMPLET',
    joined: 'UNIT',
    noGroups: 'No hi ha grups disponibles',
    noMyGroups: 'No t\'has unit a cap grup encara',
    joinSuccess: 'T\'has unit al grup exitosament',
    leaveSuccess: 'Has sortit del grup',
    groupFull: 'El grup està complet',
    leaveConfirm: 'Estàs segur que vols sortir d\'aquest grup?',
    groupChat: 'Xat del Grup',
    sendMessage: 'Enviar missatge',
    typeMessage: 'Escriu un missatge...',
    shareAnnouncement: 'Compartir al Grup',
    sharedAnnouncement: 'ha compartit un anunci',
    favorites: 'Favorits',
    addToFavorites: 'Afegir a favorits',
    removeFromFavorites: 'Treure de favorits',
    noFavorites: 'No tens favorits encara',
    openChat: 'Obrir Xat',
    shareFavorite: 'Compartir Favorit',
    recommended: 'Recomanat per a tu',
    basedOnPreferences: 'Basat en les teves preferències'
  },
  en: {
    title: 'UdL Notice Board',
    subtitle: 'Find events, services and products at your university',
    all: 'All',
    events: '🎭 Events',
    services: '💼 Services',
    products: '🛍️ Products/Rentals',
    createPost: 'Create Post',
    aiAssistant: 'AI Assistant',
    calendar: 'Calendar',
    search: 'Search posts by title or description...',
    noResults: 'No results found for',
    noPosts: 'No posts in this category',
    free: 'Free',
    price: 'Price',
    location: 'Location',
    contact: 'Contact',
    published: 'Published',
    eventDate: 'Event Date',
    edit: 'Edit',
    delete: 'Delete',
    report: 'Report',
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
    termsRequired: 'You must accept the terms of use to continue',
    // Grupos
    groups: 'Groups',
    myGroups: 'My Groups',
    allGroups: 'All Groups',
    joinGroup: 'Join',
    leaveGroup: 'Leave',
    members: 'members',
    schedule: 'Schedule',
    full: 'FULL',
    joined: 'JOINED',
    noGroups: 'No groups available',
    noMyGroups: 'You haven\'t joined any groups yet',
    joinSuccess: 'You have joined the group successfully',
    leaveSuccess: 'You have left the group',
    groupFull: 'The group is full',
    leaveConfirm: 'Are you sure you want to leave this group?',
    groupChat: 'Group Chat',
    sendMessage: 'Send message',
    typeMessage: 'Type a message...',
    shareAnnouncement: 'Share to Group',
    sharedAnnouncement: 'shared an announcement',
    favorites: 'Favorites',
    addToFavorites: 'Add to favorites',
    removeFromFavorites: 'Remove from favorites',
    noFavorites: 'You don\'t have any favorites yet',
    openChat: 'Open Chat',
    shareFavorite: 'Share Favorite',
    recommended: 'Recommended for you',
    basedOnPreferences: 'Based on your preferences'
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
  const [mostrarGrupos, setMostrarGrupos] = useState(false);
  const [vistaGrupos, setVistaGrupos] = useState('todos'); // 'todos' o 'mis-grupos'
  const [grupos, setGrupos] = useState([]);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);
  const [mensajesGrupo, setMensajesGrupo] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [favoritos, setFavoritos] = useState([]);
  const [mostrarFavoritos, setMostrarFavoritos] = useState(false);
  const [mostrarChatGrupo, setMostrarChatGrupo] = useState(false);
  const [preferenciasUsuario, setPreferenciasUsuario] = useState(() => {
    const saved = localStorage.getItem('preferenciasUsuario');
    return saved ? JSON.parse(saved) : { evento: 0, servicio: 0, producto: 0 };
  });

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

  const cargarGrupos = async () => {
    try {
      const endpoint = vistaGrupos === 'mis-grupos' ? `${API_URL}/grupos/mis-grupos` : `${API_URL}/grupos`;
      const response = await axios.get(endpoint);
      setGrupos(response.data);
    } catch (error) {
      console.error('Error al cargar grupos:', error);
    }
  };

  const abrirGrupos = () => {
    setVistaGrupos('todos');
    setMostrarGrupos(true);
    cargarGrupos();
  };

  const handleUnirseGrupo = async (grupoId) => {
    try {
      await axios.post(`${API_URL}/grupos/${grupoId}/unirse`);
      alert(t.joinSuccess);
      cargarGrupos();
    } catch (error) {
      if (error.response && error.response.data.error) {
        alert(error.response.data.error);
      } else {
        console.error('Error al unirse al grupo:', error);
      }
    }
  };

  const handleSalirGrupo = async (grupoId) => {
    if (window.confirm(t.leaveConfirm)) {
      try {
        await axios.post(`${API_URL}/grupos/${grupoId}/salir`);
        alert(t.leaveSuccess);
        if (grupoSeleccionado && grupoSeleccionado.id === grupoId) {
          setGrupoSeleccionado(null);
        }
        cargarGrupos();
      } catch (error) {
        console.error('Error al salir del grupo:', error);
      }
    }
  };

  useEffect(() => {
    if (mostrarGrupos) {
      cargarGrupos();
    }
  }, [vistaGrupos, mostrarGrupos]);

  useEffect(() => {
    if (grupoSeleccionado) {
      cargarMensajesGrupo(grupoSeleccionado.id);
    }
  }, [grupoSeleccionado]);

  const cargarMensajesGrupo = async (grupoId) => {
    try {
      const response = await axios.get(`${API_URL}/grupos/${grupoId}/mensajes`);
      setMensajesGrupo(response.data);
    } catch (error) {
      console.error('Error al cargar mensajes del grupo:', error);
    }
  };

  const handleEnviarMensaje = async (e) => {
    e.preventDefault();
    if (!nuevoMensaje.trim() || !grupoSeleccionado) return;

    try {
      await axios.post(`${API_URL}/grupos/${grupoSeleccionado.id}/mensajes`, {
        mensaje: nuevoMensaje
      });
      setNuevoMensaje('');
      cargarMensajesGrupo(grupoSeleccionado.id);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      if (error.response && error.response.data.error) {
        alert(error.response.data.error);
      }
    }
  };

  const handleCompartirAnuncio = async (anuncioId) => {
    if (!grupoSeleccionado) return;

    try {
      await axios.post(`${API_URL}/grupos/${grupoSeleccionado.id}/mensajes`, {
        anuncio_id: anuncioId,
        mensaje: ''
      });
      cargarMensajesGrupo(grupoSeleccionado.id);
    } catch (error) {
      console.error('Error al compartir anuncio:', error);
      if (error.response && error.response.data.error) {
        alert(error.response.data.error);
      }
    }
  };

  const cargarFavoritos = async () => {
    try {
      const response = await axios.get(`${API_URL}/favoritos`);
      setFavoritos(response.data);
    } catch (error) {
      console.error('Error al cargar favoritos:', error);
    }
  };

  const toggleFavorito = async (anuncioId, esFavorito) => {
    try {
      if (esFavorito) {
        await axios.delete(`${API_URL}/favoritos/${anuncioId}`);
      } else {
        await axios.post(`${API_URL}/favoritos/${anuncioId}`);
      }
      cargarAnuncios();
      if (mostrarFavoritos) {
        cargarFavoritos();
      }
    } catch (error) {
      console.error('Error al cambiar favorito:', error);
    }
  };

  const verificarFavorito = async (anuncioId) => {
    try {
      const response = await axios.get(`${API_URL}/anuncios/${anuncioId}/es-favorito`);
      return response.data.es_favorito;
    } catch (error) {
      console.error('Error al verificar favorito:', error);
      return false;
    }
  };

  const actualizarPreferencias = (categoria) => {
    const nuevasPreferencias = { ...preferenciasUsuario };
    nuevasPreferencias[categoria] = (nuevasPreferencias[categoria] || 0) + 1;
    setPreferenciasUsuario(nuevasPreferencias);
    localStorage.setItem('preferenciasUsuario', JSON.stringify(nuevasPreferencias));
  };

  const obtenerAnunciosRecomendados = () => {
    if (!anuncios.length) return [];
    
    const categoriaFavorita = Object.keys(preferenciasUsuario).reduce((a, b) => 
      preferenciasUsuario[a] > preferenciasUsuario[b] ? a : b
    );
    
    const totalInteracciones = Object.values(preferenciasUsuario).reduce((sum, val) => sum + val, 0);
    if (totalInteracciones === 0) return [];
    
    return anuncios
      .filter(a => a.categoria === categoriaFavorita)
      .slice(0, 3);
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
              ES
            </button>
            <button 
              className={idioma === 'ca' ? 'lang-btn active' : 'lang-btn'}
              onClick={() => setIdioma('ca')}
            >
              CAT
            </button>
            <button 
              className={idioma === 'en' ? 'lang-btn active' : 'lang-btn'}
              onClick={() => setIdioma('en')}
            >
              EN
            </button>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="filtros">
          <div className="filtros-categorias">
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
          </div>
          <div className="acciones-toolbar">
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
              className="groups-btn"
              onClick={abrirGrupos}
            >
              {t.groups}
            </button>
            <button
              className="favorites-btn"
              onClick={() => {
                setMostrarFavoritos(true);
                cargarFavoritos();
              }}
            >
              {t.favorites}
            </button>
          </div>
        </div>

        <button
          className="chat-btn-flotante"
          onClick={() => setMostrarChat(!mostrarChat)}
          title={t.aiAssistant}
        >
          💬
        </button>

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
                      required={!modoEdicion}
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

        {mostrarGrupos && (
          <div className="modal" onClick={() => setMostrarGrupos(false)}>
            <div className="modal-content grupos-modal" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setMostrarGrupos(false)}>✕</button>
              <h2>{t.groups}</h2>
              
              <div className="grupos-tabs">
                <button 
                  className={vistaGrupos === 'todos' ? 'tab-btn active' : 'tab-btn'}
                  onClick={() => setVistaGrupos('todos')}
                >
                  {t.allGroups}
                </button>
                <button 
                  className={vistaGrupos === 'mis-grupos' ? 'tab-btn active' : 'tab-btn'}
                  onClick={() => setVistaGrupos('mis-grupos')}
                >
                  {t.myGroups}
                </button>
              </div>

              <div className="grupos-lista">
                {grupos.length === 0 ? (
                  <p style={{textAlign: 'center', padding: '2rem', color: '#999'}}>
                    {vistaGrupos === 'mis-grupos' ? t.noMyGroups : t.noGroups}
                  </p>
                ) : (
                  grupos.map((grupo) => (
                    <div 
                      key={grupo.id} 
                      className="grupo-card"
                      onClick={() => setGrupoSeleccionado(grupo)}
                    >
                      <img src={grupo.imagen_url} alt={grupo.nombre} className="grupo-imagen" />
                      <div className="grupo-info">
                        <div className="grupo-header">
                          <h3>{grupo.nombre}</h3>
                          <span className="grupo-categoria">{grupo.categoria}</span>
                        </div>
                        <p className="grupo-descripcion">{grupo.descripcion.substring(0, 100)}...</p>
                        <div className="grupo-detalles">
                          <span>📍 {grupo.ubicacion}</span>
                          <span>👥 {grupo.miembros_actuales}/{grupo.max_miembros} {t.members}</span>
                        </div>
                        <div className="grupo-horario">
                          {t.schedule}: {grupo.horario}
                        </div>
                        <div className="grupo-acciones">
                          {grupo.es_miembro ? (
                            <>
                              <span className="badge-unido">{t.joined}</span>
                              <button 
                                className="btn-salir-grupo"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSalirGrupo(grupo.id);
                                }}
                              >
                                {t.leaveGroup}
                              </button>
                            </>
                          ) : (
                            <button 
                              className="btn-unirse-grupo"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUnirseGrupo(grupo.id);
                              }}
                              disabled={grupo.miembros_actuales >= grupo.max_miembros}
                            >
                              {grupo.miembros_actuales >= grupo.max_miembros ? t.full : t.joinGroup}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {grupoSeleccionado && (
          <div className="modal" onClick={() => setGrupoSeleccionado(null)}>
            <div className="modal-content detalle-grupo" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setGrupoSeleccionado(null)}>✕</button>
              <img src={grupoSeleccionado.imagen_url} alt={grupoSeleccionado.nombre} />
              <div className="detalle-header">
                <h2>{grupoSeleccionado.nombre}</h2>
                <span className="categoria-badge" style={{backgroundColor: '#52c41a'}}>
                  {grupoSeleccionado.categoria}
                </span>
              </div>
              <p className="descripcion">{grupoSeleccionado.descripcion}</p>
              <div className="detalle-info">
                <p><strong>📍 {t.location}:</strong> {grupoSeleccionado.ubicacion}</p>
                <p><strong>{t.schedule}:</strong> {grupoSeleccionado.horario}</p>
                <p><strong>👥 {t.members}:</strong> {grupoSeleccionado.miembros_actuales}/{grupoSeleccionado.max_miembros}</p>
              </div>
              
              <div className="detalle-acciones">
                {grupoSeleccionado.es_miembro ? (
                  <>
                    <button 
                      className="btn-editar"
                      onClick={() => {
                        setMostrarChatGrupo(true);
                        cargarMensajesGrupo(grupoSeleccionado.id);
                      }}
                    >
                      {t.openChat}
                    </button>
                    <button 
                      className="btn-eliminar"
                      onClick={() => handleSalirGrupo(grupoSeleccionado.id)}
                    >
                      {t.leaveGroup}
                    </button>
                  </>
                ) : (
                  <button 
                    className="btn-editar"
                    onClick={() => handleUnirseGrupo(grupoSeleccionado.id)}
                    disabled={grupoSeleccionado.miembros_actuales >= grupoSeleccionado.max_miembros}
                  >
                    {grupoSeleccionado.miembros_actuales >= grupoSeleccionado.max_miembros ? t.full : t.joinGroup}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {mostrarFavoritos && (
          <div className="modal" onClick={() => setMostrarFavoritos(false)}>
            <div className="modal-content favoritos-modal" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setMostrarFavoritos(false)}>✕</button>
              <h2>{t.favorites}</h2>
              {grupoSeleccionado && (
                <p style={{textAlign: 'center', padding: '1rem', background: '#f0f9ff', borderRadius: '8px', marginBottom: '1rem', color: '#0369a1'}}>
                  Haz click en un favorito para compartirlo en el chat de "{grupoSeleccionado.nombre}"
                </p>
              )}
              
              <div className="favoritos-grid">
                {favoritos.length === 0 ? (
                  <p style={{textAlign: 'center', padding: '2rem', color: '#999'}}>
                    {t.noFavorites}
                  </p>
                ) : (
                  favoritos.map((anuncio) => (
                    <div 
                      key={anuncio.id} 
                      className="anuncio-card"
                      onClick={async () => {
                        if (grupoSeleccionado) {
                          await handleCompartirAnuncio(anuncio.id);
                          setMostrarFavoritos(false);
                          setMostrarChatGrupo(true);
                        } else {
                          setAnuncioSeleccionado(anuncio);
                          setMostrarFavoritos(false);
                        }
                      }}
                    >
                      <div className="anuncio-card-clickable">
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
                              {anuncio.precio === 0 ? t.free : `€${anuncio.precio}`}
                            </span>
                            <span className="ubicacion">📍 {anuncio.ubicacion}</span>
                          </div>
                        </div>
                      </div>
                      {!grupoSeleccionado && (
                        <button 
                          className="btn-remove-favorito"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorito(anuncio.id, true);
                          }}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {mostrarChatGrupo && grupoSeleccionado && (
          <div className="modal" onClick={() => setMostrarChatGrupo(false)}>
            <div className="modal-content chat-grupo-modal" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setMostrarChatGrupo(false)}>✕</button>
              <h2>{t.groupChat} - {grupoSeleccionado.nombre}</h2>
              
              <div className="chat-container-grande">
                <div className="mensajes-grupo-grande">
                  {mensajesGrupo.map((mensaje, idx) => (
                    <div key={idx} className="mensaje-item">
                      {mensaje.anuncio_id ? (
                        <div className="mensaje-anuncio-compartido">
                          <p className="mensaje-texto">
                            <strong>Usuario {mensaje.usuario_id}</strong> {t.sharedAnnouncement}
                          </p>
                          <div className="anuncio-compartido-preview">
                            {mensaje.anuncio_imagen && (
                              <img src={mensaje.anuncio_imagen} alt={mensaje.anuncio_titulo} />
                            )}
                            <p><strong>{mensaje.anuncio_titulo}</strong></p>
                          </div>
                        </div>
                      ) : (
                        <div className="mensaje-texto-simple">
                          <strong>Usuario {mensaje.usuario_id}:</strong> {mensaje.mensaje}
                        </div>
                      )}
                      <span className="mensaje-fecha">
                        {new Date(mensaje.fecha_creacion).toLocaleString(idioma)}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="acciones-chat">
                  <button
                    className="btn-compartir-favorito"
                    onClick={() => {
                      cargarFavoritos();
                      setMostrarChatGrupo(false);
                      setMostrarFavoritos(true);
                    }}
                  >
                    {t.shareFavorite}
                  </button>
                </div>
                
                <form onSubmit={handleEnviarMensaje} className="form-mensaje-grande">
                  <input
                    type="text"
                    placeholder={t.typeMessage}
                    value={nuevoMensaje}
                    onChange={(e) => setNuevoMensaje(e.target.value)}
                    className="input-mensaje"
                  />
                  <button type="submit" className="btn-enviar-mensaje">
                    {t.sendMessage}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {mostrarChat && (
          <div className="modal" onClick={() => setMostrarChat(false)}>
            <div className="modal-content chat-modal" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setMostrarChat(false)}>✕</button>
              <h2>AI Assistant</h2>
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
                <button 
                  className="btn-favorito"
                  onClick={async () => {
                    const esFav = await verificarFavorito(anuncioSeleccionado.id);
                    toggleFavorito(anuncioSeleccionado.id, esFav);
                  }}
                >
                  ❤️ {t.favorites}
                </button>
                {grupoSeleccionado && (
                  <button 
                    className="btn-compartir"
                    onClick={() => {
                      handleCompartirAnuncio(anuncioSeleccionado.id);
                      setAnuncioSeleccionado(null);
                    }}
                  >
                    {t.shareAnnouncement}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {obtenerAnunciosRecomendados().length > 0 && !busqueda && categoriaSeleccionada === 'todos' && (
          <div className="recomendaciones-section">
            <h3>{t.recommended}</h3>
            <p className="recomendaciones-subtitle">{t.basedOnPreferences}</p>
            <div className="recomendaciones-grid">
              {obtenerAnunciosRecomendados().map((anuncio) => (
                <div 
                  key={anuncio.id} 
                  className="anuncio-card recomendado"
                  onClick={() => {
                    setAnuncioSeleccionado(anuncio);
                    actualizarPreferencias(anuncio.categoria);
                  }}
                >
                  <div className="badge-recomendado">⭐ {t.recommended}</div>
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
                        {anuncio.precio === 0 ? t.free : `€${anuncio.precio}`}
                      </span>
                      <span className="ubicacion">{anuncio.ubicacion}</span>
                    </div>
                  </div>
                </div>
              ))}
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
              >
                <div 
                  className="anuncio-card-clickable"
                  onClick={() => {
                    setAnuncioSeleccionado(anuncio);
                    actualizarPreferencias(anuncio.categoria);
                  }}
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
                        {anuncio.precio === 0 ? t.free : `€${anuncio.precio}`}
                      </span>
                      <span className="ubicacion">📍 {anuncio.ubicacion}</span>
                    </div>
                  </div>
                </div>
                <button
                  className="heart-favorito"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorito(anuncio.id, anuncio.es_favorito);
                  }}
                  title={anuncio.es_favorito ? t.removeFromFavorites : t.addToFavorites}
                >
                  {anuncio.es_favorito ? '❤️' : '🤍'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
