import { useMemo, useState } from "react";
import Header from "../components/Header";
import Menu from "../components/Menu";
import useApiData from "../hooks/useApiData";

const formatDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
};

const HistorialDesignaciones = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: designaciones, loading, error } = useApiData("/api/designaciones");

  const filtered = useMemo(() => {
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

        <div className="historialDesig-container">
          <div className="header-bar">
            <h1 className="page-title">HISTORIAL DE DESIGNACIONES</h1>
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="Buscar por nombre o dependencia..."
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
                  <th>N°</th>
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
                    <td colSpan="6" className="empty-table">
                      Cargando historial...
                    </td>
                  </tr>
                )}
                {error && !loading && (
                  <tr>
                    <td colSpan="6" className="empty-table">
                      No se pudo recuperar el historial.
                    </td>
                  </tr>
                )}
                {!loading && !error && filtered.length === 0 && (
                  <tr>
                    <td colSpan="6" className="empty-table">
                      No se encontraron registros para la búsqueda actual.
                    </td>
                  </tr>
                )}
                {!loading && !error &&
                  filtered.map((designacion, index) => (
                    <tr key={designacion.id}>
                      <td>{index + 1}</td>
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

export default HistorialDesignaciones;