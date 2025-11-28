import { useEffect, useMemo, useState } from 'react';
import './docente.css';
import Menu from '../components/Menu';
import Header from '../components/Header';
import useApiData from '../hooks/useApiData';
import useSystemParameters from '../hooks/useSystemParameters';
import buildManagementLabels from '../utils/managementLabels';

const BuscarEstudiantes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: estudiantes, loading, error } = useApiData('/api/estudiantes');
  const { summary, loading: parametrosLoading } = useSystemParameters();
  const { gestion, periodo } = buildManagementLabels(summary, parametrosLoading);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const estudiantesList = useMemo(() => {
    if (Array.isArray(estudiantes?.data)) {
      return estudiantes.data;
    }

    return Array.isArray(estudiantes) ? estudiantes : [];
  }, [estudiantes]);

  const filteredEstudiantes = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return estudiantesList;
    }

    return estudiantesList.filter((estudiante) => {
      const valuesToSearch = [
        estudiante?.name,
        estudiante?.ci,
        estudiante?.ru,
        estudiante?.celular,
      ]
        .filter((value) => value !== null && value !== undefined)
        .map((value) => value.toString().toLowerCase());

      return valuesToSearch.some((value) => value.includes(term));
    });
  }, [estudiantesList, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, estudiantesList]);

  const totalPages = Math.max(1, Math.ceil(filteredEstudiantes.length / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedEstudiantes = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEstudiantes.slice(start, start + itemsPerPage);
  }, [filteredEstudiantes, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

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

                    <div className='right_title' aria-label="Ruta de navegaci\u00f3n">
                        <span className="breadcrumb-part">Principal</span> / <span className="breadcrumb-part">Docente</span> / <span className="breadcrumb-part" aria-current="page">Estudiante</span>
                    </div>
            </div>

                    <div className='second_part'>
                    <div>
                        <p>Estudiante</p>
                        <p>Carrera</p>
                    </div>

                    <div>
                        <p>{gestion}</p>
                        <p>{periodo}</p>
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
            {!loading && !error && paginatedEstudiantes.length > 0 &&
              paginatedEstudiantes.map((estudiante, index) => {
                const notaNumerica = Number(estudiante.nota);
                const notaValida = Number.isFinite(notaNumerica);

                return (
                  <tr key={estudiante.id}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{estudiante.ru}</td>
                    <td>{estudiante.name}</td>
                    <td>{estudiante.ci}</td>
                    <td className={`nota ${notaValida && notaNumerica >= 60 ? 'aprobado' : 'reprobado'}`}>
                      {notaValida ? notaNumerica : '—'}
                    </td>
                    <td>{estudiante.celular}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {filteredEstudiantes.length > 0 && (
        <div className="pagination">
          <button
            className="page-btn prev-btn"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            type="button"
          >
            &lt;
          </button>
          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                className={`page-number ${page === currentPage ? 'active' : ''}`}
                onClick={() => handlePageChange(page)}
                type="button"
              >
                {page}
              </button>
            ))}
          </div>
          <button
            className="page-btn next-btn"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            type="button"
          >
            &gt;
          </button>
        </div>
      )}
      </div>
     </div>
    </div>
  );
};

export default BuscarEstudiantes;
