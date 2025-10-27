import DashboardLayout from "./DashboardLayout";

const DashoboardBecario = () => (
  <DashboardLayout
    title="Panel de Becario"
    description="Consulta tus asignaciones vigentes y mantén el seguimiento de horas de apoyo académico."
  >
    <section className="dashboard-widget">
      <h2>Tareas asignadas</h2>
      <ul>
        <li>• Apoyo en laboratorio de redes – 6 horas restantes.</li>
        <li>• Tutoría de refuerzo para primer semestre – 4 horas restantes.</li>
      </ul>
    </section>
    <section className="dashboard-widget">
      <h2>Documentación</h2>
      <ul>
        <li>• Subir informe semanal antes del viernes.</li>
        <li>• Actualizar datos bancarios para pagos de beca.</li>
      </ul>
    </section>
  </DashboardLayout>
);

export default DashoboardBecario;
