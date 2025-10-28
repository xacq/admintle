import DashboardLayout from "./DashboardLayout";

const DashoboardAdmin = () => (
  <DashboardLayout
    title="Panel Administrativo"
    description="Centraliza el control de usuarios, notificaciones y procesos institucionales."
  >
    <section className="dashboard-widget">
      <h2>Indicadores del sistema</h2>
      <ul>
        <li>• 4 roles activos sincronizados con la base de datos.</li>
        <li>• Última actualización de catálogos: hace 12 horas.</li>
      </ul>
    </section>
    <section className="dashboard-widget">
      <h2>Próximas acciones</h2>
      <ul>
        <li>• Revisar solicitudes de alta de personal docente.</li>
        <li>• Publicar calendario académico del próximo periodo.</li>
      </ul>
    </section>
  </DashboardLayout>
);

export default DashoboardAdmin;
