import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import useAuthenticatedUser from "../hooks/useAuthenticatedUser";

const DashoboardAdmin = () => {
  useAuthenticatedUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({
    total: 0,
    activas: 0,
    evaluacion: 0,
    finalizadas: 0,
  });

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

        const becas = await response.json();
        const total = becas.length;
        const activas = becas.filter((beca) => beca.estado === "Activa").length;
        const evaluacion = becas.filter((beca) => beca.estado === "En evaluación").length;
        const finalizadas = becas.filter((beca) => beca.estado === "Finalizada").length;

        setSummary({ total, activas, evaluacion, finalizadas });
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
      title="Panel Administrativo"
      description="Centraliza el control de usuarios, notificaciones y procesos institucionales."
    >
      <section className="dashboard-widget">
        <h2>Gestión de becas auxiliares</h2>
        {error && <p className="dashboard-error">No se pudieron cargar las estadísticas.</p>}
        <div className="dashboard-metrics">
          <article>
            <span>Total</span>
            <strong>{summary.total}</strong>
          </article>
          <article>
            <span>Activas</span>
            <strong>{summary.activas}</strong>
          </article>
          <article>
            <span>En evaluación</span>
            <strong>{summary.evaluacion}</strong>
          </article>
          <article>
            <span>Finalizadas</span>
            <strong>{summary.finalizadas}</strong>
          </article>
        </div>
        {loading && <p className="dashboard-hint">Actualizando datos…</p>}
      </section>
      <section className="dashboard-widget">
        <h2>Acciones del administrador</h2>
        <p>
          Centraliza la creación, edición y seguimiento de las becas auxiliares de investigación.
          Los cambios realizados se sincronizan automáticamente con los paneles del director, los
          tutores y los becarios.
        </p>
        <Link className="dashboard-button" to="/dashboard/admin/becas">
          Gestionar becas
        </Link>
      </section>
    </DashboardLayout>
  );
};

export default DashoboardAdmin;
