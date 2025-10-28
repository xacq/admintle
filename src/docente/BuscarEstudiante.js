import { useMemo, useState } from 'react';
import './docente.css';
import Menu from '../components/Menu';
import Header from '../components/Header';
import useApiData from '../hooks/useApiData';

const BuscarEstudiantes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: estudiantes, loading, error } = useApiData('/api/estudiantes');

  const filteredEstudiantes = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return estudiantes;
    }

    return estudiantes.filter((estudiante) => {
      const valuesToSearch = [
        estudiante.name,
        estudiante.ci,
        estudiante.ru,
        estudiante.celular,
      ];

      return valuesToSearch.some((value) => value.toLowerCase().includes(term));
    });
  }, [estudiantes, searchTerm]);

  return (
    <div className="Docente">
     <Header />

      <div className="docente_body">
        <nav>
          <Menu />
        </nav>
    <div className="buscar-estudiantes-container">
         <main>
            <div className='head_part'>
                <div className='left_title'>
                    <span className="material-symbols-outlined">person</span>
                    <h3>Docente</h3>
                </div>

                    <div className='right_title'>
                        <a href='#'>Principal</a> / <a href='#'>IDocente</a> / <a href='#'>Estudiante</a>
                    </div>
            </div>

                <div className='second_part'>
                    <div>
                        <p>Estudiante</p>
                        <p>Carrera</p>
                    </div>

                    <div>
                        <p>Gestión 2/2024</p>
                        <p>Periodo 1</p>
                    </div>

                </div>
        </main>
        

      {/* Área de búsqueda */}
      <div className="search-area">
        <div className="search-controls">
          <button className="search-div">BUSCAR ESTUDIANTES</button>
          <input 
            type="text" 
            className="search-input-div" 
            placeholder="Buscar por nombre, CI, R.U. o celular..."
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
              <th>N°</th>
              <th>R.U.</th>
              <th>NAME</th>
              <th>C.I.</th>
              <th>NOTA</th>
              <th>CELULAR</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="6" className="no-data">
                  Cargando estudiantes...
                </td>
              </tr>
            )}
            {error && !loading && (
              <tr>
                <td colSpan="6" className="no-data">
                  Error al obtener la lista de estudiantes.
                </td>
              </tr>
            )}
            {!loading && !error && filteredEstudiantes.length === 0 && (
              <tr>
                <td colSpan="6" className="no-data">
                  No se encontraron estudiantes con los criterios ingresados.
                </td>
              </tr>
            )}
            {!loading && !error &&
              filteredEstudiantes.map((estudiante, index) => (
                <tr key={estudiante.id}>
                  <td>{index + 1}</td>
                  <td>{estudiante.ru}</td>
                  <td>{estudiante.name}</td>
                  <td>{estudiante.ci}</td>
                  <td className={`nota ${estudiante.nota >= 60 ? 'aprobado' : 'reprobado'}`}>
                    {estudiante.nota}
                  </td>
                  <td>{estudiante.celular}</td>
                </tr>
              ))}
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

export default BuscarEstudiantes;