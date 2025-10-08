import Header from "../components/Header";
import Menu from "../components/Menu";

import './docente.css';

const Designaciones = () => {
  return (
    <div className="Docente">
     <Header />

      <div className="docente_body">
        <nav>
          <Menu />
        </nav>
    <div className="historial-container">
          <main>
            <div className='head_part'>
                <div className='left_title'>
                    <span class="material-symbols-outlined">person</span>
                    <h3>Docente</h3>
                </div>

                    <div className='right_title'>
                        <a href='#'>Principal</a> / <a href='#'>IDocente</a> / <a href='#'>Estudiante</a>
                    </div>
            </div>

                <div className='second_part'>
                    <div>
                        <p>Designación</p>
                    </div>

                </div>
        </main>
      <div className="header-bar">
        <h1 className="page-title">HISTORIAL DE DESIGNACIONES</h1>
        <div className="search-container">
          <input 
            type="text" 
            className="search-input" 
            placeholder="Buscar..." 
          />
          <button className="search-button">BUSCAR</button>
        </div>
      </div>

      {/* Tabla de datos */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Empleado</th>
              <th>Puesto</th>
              <th>Departamento</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {/* Aquí irían los datos de la tabla */}
            <tr>
              <td colSpan="6" className="no-data">No hay datos disponibles</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="pagination">
        <button className="page-btn prev-btn">&lt;</button>
        <div className="page-numbers">
          {[...Array(10)].map((_, i) => (
            <button key={i} className={`page-number ${i === 0 ? 'active' : ''}`}>
              {i + 1}
            </button>
          ))}
        </div>
        <button className="page-btn next-btn">&gt;</button>
       </div>
      </div>
     </div>
    </div>
  );
};

export default Designaciones;