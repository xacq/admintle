import './docente.css';
import profile from '../assets/profile.png'
import Header from '../components/Header';
import Menu from '../components/Menu';

function DocenteConfig() {
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
                                <span class="material-symbols-outlined">book_2</span>
                                <h3>Docente</h3>
                            </div>

                            <div className='right_title'>
                                <a href='#'>Principal</a> / <a href='#'>IDocente</a> / <a href='#'>Estudiante</a>
                            </div>
                        </div>

                        <div className='second_part'>
                           <div>
                                <input type='search' />
                                <button>ENTRAR</button>
                           </div>
                           
                        </div>
                    </main>

                    <div className='main_options'>
                        <div className='main_options_content'>

                            <h2>CONFIGURACIÓN</h2>
                            
                            <div className='option'>
                                <span class="material-symbols-outlined">menu_book</span>
                                <button><p>GUARDAR NOTAS</p></button>
                            </div>

                            <div className='option'>
                                <span class="material-symbols-outlined">person</span>
                                <button><p>TÍTULO DOCENTE</p></button>
                            </div>

                            <div className='option'>
                                <span class="material-symbols-outlined">notifications</span>
                                <button><p>ACTIVAR NOTIFICACIONES</p></button>
                            </div>
                        </div>
                    </div>
                   </div>
                </div>
        </div>
    )
}

export default DocenteConfig;