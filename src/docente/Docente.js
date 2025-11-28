import './docente.css';
import Header from '../components/Header';
import Menu from '../components/Menu';
import { Link } from "react-router-dom";
import useSystemParameters from '../hooks/useSystemParameters';
import buildManagementLabels from '../utils/managementLabels';

function Docente() {
    const { summary, loading: parametrosLoading } = useSystemParameters();
    const { gestion, periodo } = buildManagementLabels(summary, parametrosLoading);

    return (
        <div className="Docente">

            <Header />

                <div className="docente_body">
                    <nav>
                        <Menu />
                    </nav>

                <div className='main_part'>
                    <main>
                        <div className='head_part'>
                            <div className='left_title'>
                                <span className="material-symbols-outlined">book_2</span>
                                <h3>Docente</h3>
                            </div>

                            <div className='right_title' aria-label="Ruta de navegaci\u00f3n">
                                <span className="breadcrumb-part">Principal</span> / <span className="breadcrumb-part">Docente</span> / <span className="breadcrumb-part" aria-current="page">Estudiante</span>
                            </div>
                        </div>

                        <div className='second_part'>
                           <div>
                                <p>Estudiante</p>
                                <p>Carrera</p>
                           </div>

                           <div>
                                <p>{gestion}</p>
                                <p>{periodo}</p>
                           </div>

                        </div>
                    </main>

                    <div className='main_options'>
                        <div className='main_options_content'>
                            <div className='option'>
                                <span className="material-symbols-outlined">person_search</span>
                                <button><p><Link to="/buscarestudiante">BUSCAR ESTUDIANTES</Link></p></button>
                            </div>

                            <div className='option'>
                                <span className="material-symbols-outlined">list_alt</span>
                                <button><p><Link to="/listadomaterias">LISTADO POR MATERIAS</Link></p></button>
                            </div>

                            <div className='option'>
                                <span className="material-symbols-outlined">account_circle</span>
                                <button><p><Link to="/historialestudiante">HISTORIAL DEL ESTUDIANTE</Link></p></button>
                            </div>
                        </div>
                    </div>
                  </div>
                </div>
        </div>
    )
}

export default Docente;
