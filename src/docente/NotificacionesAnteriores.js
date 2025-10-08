import { useState } from 'react';
import './docente.css';
import Menu from '../components/Menu';
import Header from '../components/Header';

const NotificacionesAnteriores = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recordsPerPage, setRecordsPerPage] = useState(50);

  const notificaciones = [];

  return (
    <div className="Docente">
     <Header />

      <div className="docente_body">
        <nav>
          <Menu />
        </nav>

    <div className="notificaciones-container">
        <main>
            <div className='head_part'>
                <div className='left_title'>
                    <span class="material-symbols-outlined">book_2</span>
                    <h3>Información notificaciones</h3>
                </div>

                    <div className='right_title'>
                        <a href='#'>Principal</a> / <a href='#'>IDocente</a> / <a href='#'>Estudiante</a>
                    </div>
            </div>

                <div className='second_part'>
                    <div>
                        <p>Lista de notificaciones</p>
                    </div>

                </div>
        </main>
      <div className="controls-bar">
        <div className="records-control">
          <span>Mostrar</span>
          <select 
            className="records-select"
            value={recordsPerPage}
            onChange={(e) => setRecordsPerPage(parseInt(e.target.value))}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span>Registros</span>
        </div>
        
        <div className="search-control">
          <label htmlFor="search">Buscar:</label>
          <input 
            type="text" 
            id="search"
            className="search-input"
            placeholder=""
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla de datos */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nº</th>
              <th>Título</th>
              <th>Descripción</th>
              <th>Hasta</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {notificaciones.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data-message">
                  Ningún dato disponible en esta tabla
                </td>
              </tr>
            ) : (
              notificaciones.map(notificacion => (
                <tr key={notificacion.id}>
                  <td>{notificacion.numero}</td>
                  <td>{notificacion.titulo}</td>
                  <td>{notificacion.descripcion}</td>
                  <td>{notificacion.hasta}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn view-btn" title="Ver">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </button>
                      <button className="action-btn edit-btn" title="Editar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button className="action-btn delete-btn" title="Eliminar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pie de tabla */}
      <div className="table-footer">
        <div className="records-info">
          Mostrando registros de 0 a 1 de un total de 0 registros
        </div>
        <div className="pagination">
          <button className="pagination-btn prev-btn">Anterior</button>
          <button className="pagination-btn next-btn">Siguiente</button>
        </div>
      </div>
      </div>
      </div>
    </div>
  );
};

export default NotificacionesAnteriores;