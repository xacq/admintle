import { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import useAuthenticatedUser from "../hooks/useAuthenticatedUser";

const DashoboardTutor = () => {
  const user = useAuthenticatedUser();
  const [becas, setBecas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    const controller = new AbortController();

    const loadBecas = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/becas?tutor_id=${user.id}`, {
          signal: controller.signal,
        });

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
  }, [user]);

  return (
    <DashboardLayout
      title="Panel de Tutor"
      description="Consulta el avance de los becarios que tienes asignados y prepara los reportes de seguimiento."
    >
      <section className="dashboard-widget">
        <h2>Mis becarios asignados</h2>
        {error && <p className="dashboard-error">Ocurrió un problema al cargar la información.</p>}
        <div className="dashboard-table-wrapper">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Becario</th>
                <th>Inicio</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="4" className="dashboard-table__empty">
                    Cargando becas…
                  </td>
                </tr>
              )}
              {!loading && becas.length === 0 && !error && (
                <tr>
                  <td colSpan="4" className="dashboard-table__empty">
                    No tienes becarios asignados actualmente.
                  </td>
                </tr>
              )}
              {!loading &&
                !error &&
                becas.map((beca) => (
                  <tr key={beca.id}>
                    <td>{beca.codigo}</td>
                    <td>{beca.becario?.nombre}</td>
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

export default DashoboardTutor;
