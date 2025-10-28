import { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import useAuthenticatedUser from "../hooks/useAuthenticatedUser";

const DashoboardBecario = () => {
  const user = useAuthenticatedUser();
  const [beca, setBeca] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    const controller = new AbortController();

    const loadBeca = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/becas?becario_id=${user.id}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}`);
        }

        const payload = await response.json();
        setBeca(payload[0] ?? null);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    loadBeca();

    return () => controller.abort();
  }, [user]);

  return (
    <DashboardLayout
      title="Panel de Becario"
      description="Consulta los detalles de tu beca y mantente al tanto de los hitos con tu tutor asignado."
    >
      <section className="dashboard-widget">
        <h2>Mi beca auxiliar</h2>
        {error && <p className="dashboard-error">No se pudo recuperar la información de la beca.</p>}
        {loading && <p className="dashboard-hint">Cargando información…</p>}
        {!loading && !error && !beca && (
          <p className="dashboard-hint">
            No tienes una beca registrada actualmente. Contacta al administrador para más detalles.
          </p>
        )}
        {!loading && !error && beca && (
          <div className="beca-card">
            <div>
              <span>Código</span>
              <strong>{beca.codigo}</strong>
            </div>
            <div>
              <span>Tutor responsable</span>
              <strong>{beca.tutor?.nombre}</strong>
            </div>
            <div>
              <span>Fecha de inicio</span>
              <strong>{beca.fecha_inicio}</strong>
            </div>
            <div>
              <span>Estado</span>
              <strong className={`badge badge--${beca.estado.toLowerCase().replace(/\s+/g, "-")}`}>
                {beca.estado}
              </strong>
            </div>
          </div>
        )}
      </section>
    </DashboardLayout>
  );
};

export default DashoboardBecario;
