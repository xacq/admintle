import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useSessionUser from '../hooks/useSessionUser';
import './admin.css';

const ARCHIVED_STATE = 'Archivada';
const FINALIZADA_STATE = 'Finalizada';

const ESTADO_BADGES = {
  Activa: 'bg-success',
  'En evaluación': 'bg-warning text-dark',
  [FINALIZADA_STATE]: 'bg-secondary',
  [ARCHIVED_STATE]: 'bg-dark',
};

const EVALUACION_BADGES = {
  Aprobado: 'bg-success',
  Reprobado: 'bg-danger',
  Concluido: 'bg-info text-dark',
};

const formatDate = (value) => {
  if (!value) {
    return '—';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return date.toLocaleDateString('es-BO');
};

const renderUsuario = (usuario) => {
  if (!usuario) {
    return 'Sin asignar';
  }

  return usuario.nombre ?? usuario.name ?? 'Sin asignar';
};

const renderEvaluacion = (evaluacion) => {
  if (!evaluacion) {
    return <span className="badge bg-secondary">Pendiente</span>;
  }

  const { calificacionFinal, estadoFinal } = evaluacion;
  const calificacion =
    calificacionFinal !== null && calificacionFinal !== undefined
      ? `${Number(calificacionFinal).toFixed(2)} / 10`
      : 'Sin registrar';

  return (
    <div className="d-flex flex-column">
      <span className="fw-semibold">{calificacion}</span>
      {estadoFinal && (
        <span className={`badge ${EVALUACION_BADGES[estadoFinal] ?? 'bg-secondary'}`}>
          {estadoFinal}
        </span>
      )}
    </div>
  );
};

const getEstadoBadgeClass = (estado) => ESTADO_BADGES[estado] ?? 'bg-primary';

const ListadoBecas = () => {
  const [becas, setBecas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [archivingId, setArchivingId] = useState(null);
  const [estadoFilter, setEstadoFilter] = useState('todas');
  const [searchTerm, setSearchTerm] = useState('');

  const sessionUser = useSessionUser();
  const navigate = useNavigate();
  const location = useLocation();

  const loadBecas = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/becas?include_archived=1');
      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      const payload = await response.json();
      const data = Array.isArray(payload?.data) ? payload.data : payload;
      setBecas(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'No se pudo cargar el listado de becas.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBecas();
  }, [loadBecas]);

  useEffect(() => {
    if (location.state?.successMessage) {
      setFeedback({ type: 'success', message: location.state.successMessage });

      const { successMessage, ...restState } = location.state;
      const nextState = Object.keys(restState).length > 0 ? restState : undefined;

      navigate(location.pathname, { replace: true, state: nextState });
    }
  }, [location, navigate]);

  const becasActivas = useMemo(
    () => becas.filter((beca) => !beca.archivada),
    [becas]
  );

  const estadoOptions = useMemo(() => {
    const estados = new Set();
    becasActivas.forEach((beca) => {
      if (beca.estado && beca.estado !== ARCHIVED_STATE) {
        estados.add(beca.estado);
      }
    });
    return ['todas', ...Array.from(estados).sort((a, b) => a.localeCompare(b, 'es'))];
  }, [becasActivas]);

  const filteredBecas = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return becasActivas.filter((beca) => {
      if (estadoFilter !== 'todas' && beca.estado !== estadoFilter) {
        return false;
      }

      if (!term) {
        return true;
      }

      const content = [
        beca.codigo,
        beca.tituloProyecto,
        beca.areaInvestigacion,
        beca.becario?.nombre,
        beca.tutor?.nombre,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return content.includes(term);
    });
  }, [becasActivas, estadoFilter, searchTerm]);

  const handleArchive = async (beca) => {
    if (!beca || !beca.id) {
      return;
    }

    if (beca.archivada || beca.estado === ARCHIVED_STATE) {
      setFeedback({
        type: 'info',
        message: `La beca ${beca.codigo} ya forma parte del archivo histórico.`,
      });
      return;
    }

    if (beca.estado !== FINALIZADA_STATE) {
      setFeedback({
        type: 'warning',
        message: 'Solo las becas finalizadas pueden archivarse.',
      });
      return;
    }

    if (!beca.evaluacionFinal) {
      setFeedback({
        type: 'warning',
        message: 'Registra la evaluación final antes de archivar esta beca.',
      });
      return;
    }

    const confirmed = window.confirm(
      `¿Deseas archivar la beca ${beca.codigo}? Esta acción moverá el registro al historial.`
    );

    if (!confirmed) {
      return;
    }

    setFeedback({ type: '', message: '' });
    setArchivingId(beca.id);

    const payload = sessionUser?.id ? { cerradaPorId: sessionUser.id } : {};

    try {
      const response = await fetch(`/api/becas/${beca.id}/archivar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let responseBody = null;

      try {
        responseBody = await response.json();
      } catch (parseError) {
        // No body provided.
      }

      if (!response.ok) {
        const message =
          responseBody?.message || 'No se pudo archivar la beca seleccionada.';
        throw new Error(message);
      }

      const archived = responseBody?.data ?? responseBody;
      if (!archived?.id) {
        throw new Error('La respuesta del servidor es inválida.');
      }

      setBecas((prev) => prev.map((item) => (item.id === archived.id ? archived : item)));
      setFeedback({
        type: 'success',
        message: `La beca ${beca.codigo} fue movida al archivo histórico.`,
      });
    } catch (err) {
      setFeedback({
        type: 'danger',
        message: err.message || 'No se pudo archivar la beca seleccionada.',
      });
    } finally {
      setArchivingId(null);
    }
  };

  const handleVerDetalle = (beca) => {
    navigate(`/detallebeca/${beca.id}`, { state: { fromList: true } });
  };

  return (
    <div className="listado-becas-container">
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
        <div>
          <h2 className="h4 mb-0">Gestión de Becas de Investigación</h2>
          <p className="text-muted mb-0">
            Administra las becas activas y finalizadas del programa DyCIT.
          </p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/formbeca" className="btn btn-primary">
            <i className="bi bi-plus-lg"></i> Registrar nueva beca
          </Link>
          <Link to="/historialbeca" className="btn btn-outline-secondary">
            <i className="bi bi-archive"></i> Ver archivo histórico
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {feedback.message && (
        <div className={`alert alert-${feedback.type || 'info'}`} role="alert">
          {feedback.message}
        </div>
      )}

      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label" htmlFor="search-term">
                Buscar beca
              </label>
              <input
                id="search-term"
                type="search"
                className="form-control"
                placeholder="Código, becario, tutor o proyecto"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label" htmlFor="estado-filter">
                Estado
              </label>
              <select
                id="estado-filter"
                className="form-select"
                value={estadoFilter}
                onChange={(event) => setEstadoFilter(event.target.value)}
              >
                {estadoOptions.map((option) => (
                  <option key={option} value={option}>
                    {option === 'todas' ? 'Todas' : option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">Cargando becas...</div>
      ) : filteredBecas.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No se encontraron becas con los criterios seleccionados.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th scope="col">Código</th>
                <th scope="col">Proyecto</th>
                <th scope="col">Área</th>
                <th scope="col">Becario</th>
                <th scope="col">Tutor</th>
                <th scope="col">Inicio</th>
                <th scope="col">Fin</th>
                <th scope="col">Estado</th>
                <th scope="col">Evaluación final</th>
                <th scope="col" className="text-center">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredBecas.map((beca) => (
                <tr key={beca.id}>
                  <td className="fw-semibold">{beca.codigo}</td>
                  <td>{beca.tituloProyecto ?? '—'}</td>
                  <td>{beca.areaInvestigacion ?? '—'}</td>
                  <td>{renderUsuario(beca.becario)}</td>
                  <td>{renderUsuario(beca.tutor)}</td>
                  <td>{formatDate(beca.fechaInicio)}</td>
                  <td>{formatDate(beca.fechaFin)}</td>
                  <td>
                    <span className={`badge ${getEstadoBadgeClass(beca.estado)}`}>
                      {beca.estado}
                    </span>
                  </td>
                  <td>{renderEvaluacion(beca.evaluacionFinal)}</td>
                  <td className="text-center">
                    <div className="btn-group" role="group">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleVerDetalle(beca)}
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-dark"
                        disabled={archivingId === beca.id}
                        onClick={() => handleArchive(beca)}
                        title="Archivar beca"
                      >
                        {archivingId === beca.id ? (
                          <span className="spinner-border spinner-border-sm" role="status" />
                        ) : (
                          <i className="bi bi-archive"></i>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListadoBecas;
