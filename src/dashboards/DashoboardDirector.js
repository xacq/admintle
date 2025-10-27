import DashboardLayout from "./DashboardLayout";

const DashoboardDirector = () => (
  <DashboardLayout
    title="Panel de Director"
    description="Monitorea el desempeño general y toma decisiones estratégicas basadas en datos consolidados."
  >
    <section className="dashboard-widget">
      <h2>Resumen ejecutivo</h2>
      <ul>
        <li>• Índice de cumplimiento docente: 92%.</li>
        <li>• Becas activas este semestre: 38.</li>
      </ul>
    </section>
    <section className="dashboard-widget">
      <h2>Alertas prioritarias</h2>
      <ul>
        <li>• Planificar reunión con coordinación académica.</li>
        <li>• Revisar reporte de infraestructura pendiente.</li>
      </ul>
    </section>
  </DashboardLayout>
);

export default DashoboardDirector;
