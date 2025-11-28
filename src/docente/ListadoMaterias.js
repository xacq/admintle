import { useEffect, useMemo, useState } from "react";
import "./docente.css";
import Menu from "../components/Menu";
import Header from "../components/Header";
import useApiData from "../hooks/useApiData";
import useSystemParameters from "../hooks/useSystemParameters";
import buildManagementLabels from "../utils/managementLabels";

const ListadoMaterias = () => {
  const { data: materias, loading, error } = useApiData("/api/materias");
  const { summary, loading: parametrosLoading } = useSystemParameters();
  const { gestion, periodo } = buildManagementLabels(summary, parametrosLoading);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const materiasList = useMemo(() => {
    if (Array.isArray(materias?.data)) {
      return materias.data;
    }

    return Array.isArray(materias) ? materias : [];
  }, [materias]);

  const rows = useMemo(() => {
    if (loading || error) {
      return [];
    }

    return materiasList.map((materia) => ({
      ...materia,
      details: {
        checked: materia.details?.checked ?? false,
      },
    }));
  }, [error, loading, materiasList]);

  useEffect(() => {
    setCurrentPage(1);
  }, [rows.length]);

  const totalPages = Math.max(1, Math.ceil(rows.length / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return rows.slice(start, start + itemsPerPage);
  }, [currentPage, rows]);

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
        <div className="listado-materias-container">
          <main>
            <div className="head_part">
              <div className="left_title">
                <span className="material-symbols-outlined">book_2</span>
                <h3>Información notificaciones</h3>
              </div>

              <div className="right_title" aria-label="Ruta de navegaci\u00f3n">
                <span className="breadcrumb-part">Principal</span> / <span className="breadcrumb-part">Docente</span> / <span className="breadcrumb-part" aria-current="page">Estudiante</span>
              </div>
            </div>

            <div className="second_part">
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
          <div className="header-bar">
            <h1 className="page-title">LISTADO POR MATERIAS</h1>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>AGU</th>
                  <th>NICKNAME</th>
                  <th>DETAILS</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan="4" className="no-data">
                      Cargando materias...
                    </td>
                  </tr>
                )}
                {error && !loading && (
                  <tr>
                    <td colSpan="4" className="no-data">
                      Ocurrió un error al recuperar las materias.
                    </td>
                  </tr>
                )}
                {!loading && !error && rows.length === 0 && (
                  <tr>
                    <td colSpan="4" className="no-data">
                      No hay materias registradas en la base de datos.
                    </td>
                  </tr>
                )}
                {!loading && !error && paginatedRows.length > 0 &&
                  paginatedRows.map((materia) => (
                    <tr key={materia.id}>
                      <td>{materia.name}</td>
                      <td>{materia.agu}</td>
                      <td>{materia.nickname}</td>
                      <td className="details-cell">
                        <div className="details-actions">
                          <input
                            type="checkbox"
                            className="details-checkbox"
                            checked={materia.details.checked}
                            readOnly
                          />
                          <button className="details-button edit-button" title="Editar" type="button">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                          </button>
                          <button className="details-button delete-button" title="Eliminar" type="button">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              <line x1="10" y1="11" x2="10" y2="17"></line>
                              <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {rows.length > 0 && (
            <div className="pagination">
              <button
                className="page-btn prev-btn"
                type="button"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                &lt;
              </button>
              <div className="page-numbers">
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <button
                    key={page}
                    className={`page-number ${page === currentPage ? "active" : ""}`}
                    type="button"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                className="page-btn next-btn"
                type="button"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
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

export default ListadoMaterias;
