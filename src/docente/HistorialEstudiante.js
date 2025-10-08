import './docente.css';
import Header from "../components/Header";
import Menu from "../components/Menu";

const HistorialEstudiante = () => {
  // Datos de ejemplo para la tabla
  const estudiantes = [
    { id: 1, fullName: 'FULANO MENCHACA', repetidos: 1, nota: 0 },
    { id: 2, fullName: 'MARIA SOSA CABRERA', repetidos: 1, nota: 0 },
    { id: 3, fullName: 'PABLO MARQUEZ POLI', repetidos: 0, nota: 80 }
  ];

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
            placeholder="Buscar..." 
          />
          <button className="search-button">BUSCAR</button>
        </div>
      

      {/* Tabla de datos */}
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
            {estudiantes.map(estudiante => (
              <tr key={estudiante.id}>
                <td>{estudiante.fullName}</td>
                <td>{estudiante.repetidos}</td>
                <td className={`nota ${estudiante.nota >= 60 ? 'aprobado' : 'reprobado'}`}>
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