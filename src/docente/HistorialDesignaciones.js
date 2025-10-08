import Header from "../components/Header";
import Menu from "../components/Menu";

const HistorialDesignaciones = () => {
  return (
    <div className="Docente">
     <Header />

      <div className="docente_body">
        <nav>
          <Menu />
        </nav>
        
    <div className="historialDesig-container">
      {/* Barra superior */}
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
              <th>N°</th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {}
            <tr>
              <td colSpan="6" className="empty-table"></td>
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

export default HistorialDesignaciones;