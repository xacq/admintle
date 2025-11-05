import { useEffect, useMemo, useState } from 'react';
import './docente.css';
import Menu from '../components/Menu';
import Header from '../components/Header';
import useSessionUser from '../hooks/useSessionUser';

const estadoClassName = (estado) => {
  switch (estado) {
    case 'Aprobado':
      return 'status-badge status-aprobado';
    case 'Devuelto':
      return 'status-badge status-devuelto';
    case 'Pendiente':
    default:
      return 'status-badge status-pendiente';
  }
};

const ListaRegistros = () => {
  const user = useSessionUser();
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [recordsPerPage, setRecordsPerPage] = useState(25);
  const [selectedReporte, setSelectedReporte] = useState(null);
  const [formState, setFormState] = useState({ estado: 'Pendiente', observaciones: '' });
  const [panelError, setPanelError] = useState('');
  const [panelSuccess, setPanelSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user === null) {
      setError('No se pudo identificar al tutor. Inicia sesión nuevamente.');
      setLoading(false);
      return;
    }

    if (!user?.id) {
      return;
    }

    const controller = new AbortController();

    const loadReportes = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`/api/reportes?tutor_id=${user.id}`, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Error ${response.status}`);
        }

        const payload = await response.json();
        const data = Array.isArray(payload?.data) ? payload.data : payload;
        setReportes(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err.name === 'AbortError') {
          return;
        }
        setError(err.message || 'No se pudo cargar el listado de reportes.');
      } finally {
        setLoading(false);
      }
    };

    loadReportes();

    return () => {
      controller.abort();
    };
  }, [user]);

  const pendientes = useMemo(
    () => reportes.filter((reporte) => reporte.estado === 'Pendiente').length,
    [reportes],
  );

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return reportes;
    }

    return reportes.filter((reporte) =>
      [
        reporte.titulo,
        reporte.descripcion,
        reporte.beca?.codigo,
        reporte.becario?.nombre,
        reporte.estado,
        reporte.observaciones,
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term))
    );
  }, [reportes, searchTerm]);

  const visible = useMemo(() => filtered.slice(0, recordsPerPage), [filtered, recordsPerPage]);
  const total = filtered.length;
  const start = total === 0 ? 0 : 1;
  const end = total === 0 ? 0 : Math.min(recordsPerPage, total);

  const handleVerArchivo = (reporte) => {
    if (!reporte?.archivoUrl) {
      return;
    }

    window.open(reporte.archivoUrl, '_blank', 'noopener');
  };

  const handleSeleccionar = (reporte) => {
    setSelectedReporte(reporte);
    setFormState({
      estado: reporte?.estado || 'Pendiente',
      observaciones: reporte?.observaciones || '',
    });
    setPanelError('');
    setPanelSuccess('');
  };

  const handleCancelarSeleccion = () => {
    if (saving) {
      return;
    }

    setSelectedReporte(null);
    setFormState({ estado: 'Pendiente', observaciones: '' });
    setPanelError('');
    setPanelSuccess('');
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async () => {
    if (!selectedReporte) {
      return;
    }

    setSaving(true);
    setPanelError('');
    setPanelSuccess('');

    try {
      const response = await fetch(`/api/reportes/${selectedReporte.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          estado: formState.estado,
          observaciones: formState.observaciones?.trim() ? formState.observaciones.trim() : null,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message =
          payload?.message ||
          (payload?.errors && Object.values(payload.errors).flat().join(' ')) ||
          'No se pudo guardar la revisión.';
        throw new Error(message);
      }

      setReportes((prev) => prev.map((reporte) => (reporte.id === payload.id ? payload : reporte)));
      setSelectedReporte(payload);
      setFormState({
        estado: payload?.estado || 'Pendiente',
        observaciones: payload?.observaciones || '',
      });
      setPanelSuccess('La revisión se guardó correctamente.');
    } catch (err) {
      setPanelError(err.message || 'No se pudo guardar la revisión.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="Docente">
      <Header />

      <div className="docente_body">
        <nav>
          <Menu />
        </nav>

        <div className="notificaciones-container">
          <main>
            <div className='head_part'>
              <div className='left_title'>
                <span className="material-symbols-outlined">assignment</span>
                <h3>Revisión de reportes de avance</h3>
              </div>

              <div className='right_title'>
                <a href='#'>Principal</a> / <a href='#'>Tutor</a> / <a href='#'>Reportes</a>
              </div>
            </div>

            <div className='second_part'>
              <div>
                <p>Reportes asignados</p>
                <p>Estado general</p>
              </div>

              <div>
                <p>{reportes.length}</p>
                <p>{pendientes || '0'} pendientes</p>
              </div>
            </div>
          </main>
          <div className="controls-bar">
            <div className="records-control">
              <span>Mostrar</span>
              <select
                className="records-select"
                value={recordsPerPage}
                onChange={(e) => setRecordsPerPage(parseInt(e.target.value, 10))}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span>Registros</span>
            </div>

            <div className="search-control">
              <label htmlFor="search">Buscar:</label>
              <input
                type="text"
                id="search"
                className="search-input"
                placeholder="Filtra por título, becario o estado"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nº</th>
                  <th>Becario</th>
                  <th>Título</th>
                  <th>Fecha de envío</th>
                  <th>Estado</th>
                  <th>Observaciones</th>
                  <th>Archivo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan="8" className="no-data-message">
                      Cargando reportes…
                    </td>
                  </tr>
                )}
                {error && !loading && (
                  <tr>
                    <td colSpan="8" className="no-data-message">
                      {error}
                    </td>
                  </tr>
                )}
                {!loading && !error && visible.length === 0 && (
                  <tr>
                    <td colSpan="8" className="no-data-message">
                      Ningún reporte disponible para mostrar.
                    </td>
                  </tr>
                )}
                {!loading && !error &&
                  visible.map((reporte, index) => (
                    <tr key={reporte.id}>
                      <td>{index + 1}</td>
                      <td>{reporte.becario?.nombre ?? 'Sin asignar'}</td>
                      <td>{reporte.titulo}</td>
                      <td>
                        {reporte.fechaEnvio
                          ? new Date(reporte.fechaEnvio).toLocaleDateString('es-BO')
                          : '—'}
                      </td>
                      <td>
                        <span className={estadoClassName(reporte.estado)}>{reporte.estado}</span>
                      </td>
                      <td className="observaciones-cell">
                        {reporte.observaciones ? (
                          <span title={reporte.observaciones}>{reporte.observaciones}</span>
                        ) : (
                          <span className="observaciones-cell__empty">Sin observaciones registradas.</span>
                        )}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="action-btn view-btn"
                          onClick={() => handleVerArchivo(reporte)}
                          disabled={!reporte.archivoUrl}
                        >
                          Ver archivo
                        </button>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="action-btn edit-btn"
                            title="Revisar"
                            type="button"
                            onClick={() => handleSeleccionar(reporte)}
                          >
                            Revisar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            <div className="records-info">
              Mostrando registros de {start} a {end} de un total de {total} registros
            </div>
            <div className="pagination">
              <button className="pagination-btn prev-btn" disabled>
                Anterior
              </button>
              <button className="pagination-btn next-btn" disabled>
                Siguiente
              </button>
            </div>
          </div>

          {selectedReporte && (
            <section className="revision-panel">
              <header className="revision-panel__header">
                <div>
                  <h4>Revisión del reporte</h4>
                  <p>
                    <strong>Becario:</strong> {selectedReporte.becario?.nombre ?? 'Sin asignar'} ·{' '}
                    <strong>Código de beca:</strong> {selectedReporte.beca?.codigo ?? 'Sin código'}
                  </p>
                </div>
                <button
                  type="button"
                  className="panel-close-btn"
                  onClick={handleCancelarSeleccion}
                  disabled={saving}
                >
                  Cerrar
                </button>
              </header>

              <div className="revision-panel__body">
                <div className="panel-grid">
                  <div>
                    <span className="panel-label">Título</span>
                    <p className="panel-value">{selectedReporte.titulo}</p>
                  </div>
                  <div>
                    <span className="panel-label">Fecha de envío</span>
                    <p className="panel-value">
                      {selectedReporte.fechaEnvio
                        ? new Date(selectedReporte.fechaEnvio).toLocaleString('es-BO')
                        : 'Sin fecha registrada'}
                    </p>
                  </div>
                  <div>
                    <span className="panel-label">Archivo enviado</span>
                    <p className="panel-value">
                      <button
                        type="button"
                        className="link-button"
                        onClick={() => handleVerArchivo(selectedReporte)}
                        disabled={!selectedReporte.archivoUrl}
                      >
                        {selectedReporte.archivoNombre || 'No disponible'}
                      </button>
                    </p>
                  </div>
                </div>

                <div className="panel-section">
                  <label className="panel-label" htmlFor="observaciones">
                    Observaciones para el becario
                  </label>
                  <textarea
                    id="observaciones"
                    name="observaciones"
                    className="panel-textarea"
                    rows={4}
                    value={formState.observaciones}
                    onChange={handleFormChange}
                    placeholder="Escribe recomendaciones, ajustes requeridos o comentarios de seguimiento."
                    disabled={saving}
                  />
                </div>

                <div className="panel-section">
                  <label className="panel-label" htmlFor="estado">
                    Estado del reporte
                  </label>
                  <select
                    id="estado"
                    name="estado"
                    className="panel-select"
                    value={formState.estado}
                    onChange={handleFormChange}
                    disabled={saving}
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Aprobado">Aprobado</option>
                    <option value="Devuelto">Devuelto</option>
                  </select>
                </div>

                {panelError && <p className="panel-feedback panel-feedback--error">{panelError}</p>}
                {panelSuccess && <p className="panel-feedback panel-feedback--success">{panelSuccess}</p>}
              </div>

              <div className="revision-panel__footer">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={handleCancelarSeleccion}
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="primary-btn"
                  onClick={handleGuardar}
                  disabled={saving}
                >
                  {saving ? 'Guardando…' : 'Guardar revisión'}
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListaRegistros;
