import { useState } from 'react';
import './docente.css';
import Menu from '../components/Menu';
import Header from '../components/Header';

const BuscarEstudiantes = () => {
  // Datos de ejemplo para la tabla
  const estudiantes = [
    { 
      numero: 1, 
      ru: '123456', 
      name: 'FULANO MENCHACA', 
      ci: '12345678', 
      nota: 60, 
      celular: '60148532' 
    },
    // Puedes agregar más estudiantes aquí
  ];

  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="Docente">
     <Header />

      <div className="docente_body">
        <nav>
          <Menu />
        </nav>
    <div className="buscar-estudiantes-container">
         <main>
            <div className='head_part'>
                <div className='left_title'>
                    <span class="material-symbols-outlined">person</span>
                    <h3>Docente</h3>
                </div>

                    <div className='right_title'>
                        <a href='#'>Principal</a> / <a href='#'>IDocente</a> / <a href='#'>Estudiante</a>
                    </div>
            </div>

                <div className='second_part'>
                    <div>
                        <p>Estudiante</p>
                        <p>Carrera</p>
                    </div>

                    <div>
                        <p>Gestión 2/2024</p>
                        <p>Periodo 1</p>
                    </div>

                </div>
        </main>
        

      {/* Área de búsqueda */}
      <div className="search-area">
        <div className="search-controls">
          <button className="search-div">BUSCAR ESTUDIANTES</button>
          <input 
            type="text" 
            className="search-input-div" 
            placeholder="Buscar por nombre, CI, R.U. o celular..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla de datos */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>N°</th>
              <th>R.U.</th>
              <th>NAME</th>
              <th>C.I.</th>
              <th>NOTA</th>
              <th>CELULAR</th>
            </tr>
          </thead>
          <tbody>
            {estudiantes
              .filter(estudiante => 
                searchTerm === '' || 
                estudiante.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                estudiante.ci.includes(searchTerm) ||
                estudiante.ru.includes(searchTerm) ||
                estudiante.celular.includes(searchTerm)
              )
              .map(estudiante => (
                <tr key={estudiante.numero}>
                  <td>{estudiante.numero}</td>
                  <td>{estudiante.ru}</td>
                  <td>{estudiante.name}</td>
                  <td>{estudiante.ci}</td>
                  <td className={`nota ${estudiante.nota >= 60 ? 'aprobado' : 'reprobado'}`}>
                    {estudiante.nota}
                  </td>
                  <td>{estudiante.celular}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="pagination">
        <button className="page-btn prev-btn">&lt;</button>
        <div className="page-numbers">
          {[...Array(10)].map((_, i) => (
            <button key={i} className={`page-number ${i === 0 ? 'active' : ''}`}>
              {i + 1}
            </button>
          ))}
        </div>
        <button className="page-btn next-btn">&gt;</button>
       </div>
      </div>
     </div>
    </div>
  );
};

export default BuscarEstudiantes;