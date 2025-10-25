import logo from '../assets/universidad.png';
import './docente.css';
import profile from '../assets/profile.png'
import Menu from '../components/Menu';
import Header from '../components/Header';

function DocentePerfil() {
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
                                <h3>Perfil del docente</h3>
                            </div>

                            <div className='right_title'>
                                <a href='#'>Principal</a> / <a href='#'>IDocente</a> / <a href='#'>Estudiante</a>
                            </div>
                        </div>

                        <div className='second_part'>
                           <div>
                                <p>Perfil del docente</p>
                           </div>

                        </div>
                    </main>

                    <div className='main_options'>
                      <div className='main_options_content'>
                        <div className='input_data'>

                          <div className='labels'>
                            <label>Nombres: </label>
                            <label>Apellido paterno: </label>
                            <label>Apellido materno: </label>
                            <label>Cédula de identidad: </label>
                            <label>Usuario: </label>
                            <label>Títulos: </label>
                            <label>Abreviatura titulo: </label>
                            <label>Abreviatura titulo 2: </label>
                            <label>Dirección: </label>
                            <label>Teléfono celular: </label>
                            <label>E-mail: </label>
                          </div> 

                          <div className='list_input'>
                            <input type='text' />  
                            <input type='text' />  
                            <input type='text' />  
                            <input type='text' />  
                            <input type='text' /> 
                            <input type='text' />  
                            <input type='text' />  
                            <input type='text' />
                            <input type='text' />  
                            <input type='tel' /> 
                            <input type='email' /> 
                          </div> 
                          </div>

                          <div className='buttons_input'>

                            <button>
                              <span class="material-symbols-outlined">save</span>
                              <p>Guardar</p>
                            </button>

                            <button>
                              <span class="material-symbols-outlined">print</span>
                              <p>Imprimir</p>
                            </button>

                          </div>

                        </div>
                    </div>
                  </div>
                </div>
        </div>
      


  );
}

export default DocentePerfil;