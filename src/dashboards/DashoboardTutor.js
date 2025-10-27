import DashboardLayout from "./DashboardLayout";

const DashoboardTutor = () => (
  <DashboardLayout
    title="Panel de Tutor"
    description="Gestiona tus grupos, tutorías y reuniones con estudiantes desde un solo lugar."
  >
    <section className="dashboard-widget">
      <h2>Acciones rápidas</h2>
      <ul>
        <li>• Revisar reportes de tutoría pendientes.</li>
        <li>• Confirmar asistencia a la próxima sesión grupal.</li>
        <li>• Compartir materiales de apoyo con los estudiantes.</li>
      </ul>
    </section>
    <section className="dashboard-widget">
      <h2>Próximos hitos</h2>
      <ul>
        <li>• Taller de acompañamiento académico – viernes 10:00.</li>
        <li>• Reunión con coordinación docente – lunes 15:00.</li>
      </ul>
    </section>
  </DashboardLayout>
);

export default DashoboardTutor;
