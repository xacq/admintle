import { useMemo, useState } from "react";
import "./docente.css";
import Header from "../components/Header";
import Menu from "../components/Menu";
import useApiData from "../hooks/useApiData";

const HistorialEstudiante = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: estudiantes, loading, error } = useApiData("/api/historial-estudiantes");

  const filteredEstudiantes = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return estudiantes;
    }

    return estudiantes.filter((estudiante) =>
      estudiante.fullName.toLowerCase().includes(term)
    );
  }, [estudiantes, searchTerm]);

  return (
    <div className="Docente">
      <Header />

      <div className="docente_body">
        <nav>
          <Menu />
        </nav>

        <div className="historial-estudiante-container">
          <h1 className="page-title">HISTORIAL DEL ESTUDIANTE</h1>
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <button className="search-button" type="button">
              BUSCAR
            </button>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>FULL NAME</th>
                  <th>REPETIDOS</th>
                  <th>NOTA</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan="3" className="no-data">
                      Cargando historial...
                    </td>
                  </tr>
                )}
                {error && !loading && (
                  <tr>
                    <td colSpan="3" className="no-data">
                      Error al cargar los datos del estudiante.
                    </td>
                  </tr>
                )}
                {!loading && !error && filteredEstudiantes.length === 0 && (
                  <tr>
                    <td colSpan="3" className="no-data">
                      No se encontraron registros para la búsqueda actual.
                    </td>
                  </tr>
                )}
                {!loading && !error &&
                  filteredEstudiantes.map((estudiante) => (
                    <tr key={estudiante.id}>
                      <td>{estudiante.fullName}</td>
                      <td>{estudiante.repetidos}</td>
                      <td className={`nota ${estudiante.nota >= 60 ? "aprobado" : "reprobado"}`}>
                        {estudiante.nota}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistorialEstudiante;