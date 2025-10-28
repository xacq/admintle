import { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import useAuthenticatedUser from "../hooks/useAuthenticatedUser";

const DashoboardDirector = () => {
  useAuthenticatedUser();
  const [becas, setBecas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadBecas = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/becas", { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Error ${response.status}`);
        }

        const payload = await response.json();
        setBecas(payload);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    loadBecas();

    return () => controller.abort();
  }, []);

  return (
    <DashboardLayout
      title="Panel de Director"
      description="Supervisa el avance global del programa y verifica el cumplimiento de los objetivos institucionales."
    >
      <section className="dashboard-widget">
        <h2>Becas auxiliares de investigación</h2>
        <p>
          Accede a una visión consolidada de todas las becas registradas por el equipo administrativo.
          Puedes revisar el estado actual de cada becario y el tutor asignado en tiempo real.
        </p>
        {error && <p className="dashboard-error">No fue posible cargar la información.</p>}
        <div className="dashboard-table-wrapper">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Becario</th>
                <th>Tutor</th>
                <th>Inicio</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="5" className="dashboard-table__empty">
                    Cargando registros…
                  </td>
                </tr>
              )}
              {!loading && becas.length === 0 && !error && (
                <tr>
                  <td colSpan="5" className="dashboard-table__empty">
                    No existen becas registradas en el sistema.
                  </td>
                </tr>
              )}
              {!loading &&
                !error &&
                becas.map((beca) => (
                  <tr key={beca.id}>
                    <td>{beca.codigo}</td>
                    <td>{beca.becario?.nombre}</td>
                    <td>{beca.tutor?.nombre}</td>
                    <td>{beca.fecha_inicio}</td>
                    <td>
                      <span className={`badge badge--${beca.estado.toLowerCase().replace(/\s+/g, "-")}`}>
                        {beca.estado}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default DashoboardDirector;
