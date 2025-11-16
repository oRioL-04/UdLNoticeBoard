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
  });

  useEffect(() => {
    cargarAnuncios();
  }, [categoriaSeleccionada]);

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
      });
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
        </div>

        {mostrarFormulario && (
          <div className="modal" onClick={() => setMostrarFormulario(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Create New Post</h2>
              <form onSubmit={handleCrearAnuncio}>
                <input
                  type="text"
                  placeholder="Title"
                  value={nuevoAnuncio.titulo}
                  onChange={(e) => setNuevoAnuncio({...nuevoAnuncio, titulo: e.target.value})}
                  required
                />
                <textarea
                  placeholder="Description"
                  value={nuevoAnuncio.descripcion}
                  onChange={(e) => setNuevoAnuncio({...nuevoAnuncio, descripcion: e.target.value})}
                  required
                />
                <select
                  value={nuevoAnuncio.categoria}
                  onChange={(e) => setNuevoAnuncio({...nuevoAnuncio, categoria: e.target.value})}
                >
                  <option value="evento">Event</option>
                  <option value="servicio">Service</option>
                  <option value="producto">Product/Rental</option>
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
                <div className="form-buttons">
                  <button type="submit" className="btn-submit">Create</button>
                  <button type="button" className="btn-cancel" onClick={() => setMostrarFormulario(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {anuncioSeleccionado && (
          <div className="modal" onClick={() => setAnuncioSeleccionado(null)}>
            <div className="modal-content detalle-anuncio" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setAnuncioSeleccionado(null)}>✕</button>
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
