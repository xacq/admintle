import { useMemo, useState } from "react";
import Header from "../components/Header";
import Menu from "../components/Menu";

import "./docente.css";
import useApiData from "../hooks/useApiData";

const formatDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
};

const Designaciones = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: designaciones, loading, error } = useApiData("/api/designaciones");

  const filteredDesignaciones = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return designaciones;
    }

    return designaciones.filter((item) =>
      [item.empleado, item.puesto, item.departamento, item.estado, item.fecha]
        .filter(Boolean)
        .some((field) => field.toString().toLowerCase().includes(term))
    );
  }, [designaciones, searchTerm]);

  return (
    <div className="Docente">
      <Header />

      <div className="docente_body">
        <nav>
          <Menu />
        </nav>
        <div className="historial-container">
          <main>
            <div className="head_part">
              <div className="left_title">
                <span className="material-symbols-outlined">person</span>
                <h3>Docente</h3>
              </div>

              <div className="right_title">
                <a href="#">Principal</a> / <a href="#">IDocente</a> / <a href="#">Estudiante</a>
              </div>
            </div>

            <div className="second_part">
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
                placeholder="Buscar por empleado, puesto o estado..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              <button className="search-button" type="button">
                BUSCAR
              </button>
            </div>
          </div>

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
                {loading && (
                  <tr>
                    <td colSpan="6" className="no-data">
                      Cargando designaciones...
                    </td>
                  </tr>
                )}
                {error && !loading && (
                  <tr>
                    <td colSpan="6" className="no-data">
                      Ocurrió un error al cargar los datos.
                    </td>
                  </tr>
                )}
                {!loading && !error && filteredDesignaciones.length === 0 && (
                  <tr>
                    <td colSpan="6" className="no-data">
                      No hay designaciones que coincidan con la búsqueda.
                    </td>
                  </tr>
                )}
                {!loading && !error &&
                  filteredDesignaciones.map((designacion) => (
                    <tr key={designacion.id}>
                      <td>{designacion.id}</td>
                      <td>{formatDate(designacion.fecha)}</td>
                      <td>{designacion.empleado}</td>
                      <td>{designacion.puesto}</td>
                      <td>{designacion.departamento}</td>
                      <td>{designacion.estado}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button className="page-btn prev-btn" type="button">
              &lt;
            </button>
            <div className="page-numbers">
              {[...Array(10)].map((_, index) => (
                <button key={index} className={`page-number ${index === 0 ? "active" : ""}`} type="button">
                  {index + 1}
                </button>
              ))}
            </div>
            <button className="page-btn next-btn" type="button">
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Designaciones;