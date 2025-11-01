import React, { useEffect, useMemo, useState } from 'react';
import useSessionUser from '../hooks/useSessionUser';
import './admin.css';

const ARCHIVED_STATE = 'Archivada';
const ESTADO_OPTIONS = ['Activa', 'En evaluación', 'Finalizada'];

const emptyForm = {
  id: null,
  codigo: '',
  becarioId: '',
  tutorId: '',
  fechaInicio: '',
  fechaFin: '',
  estado: ESTADO_OPTIONS[0],
  tituloProyecto: '',
  areaInvestigacion: '',
  evaluacionFinal: '',
};

const ListadoBecas = () => {
  const [becas, setBecas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [becarios, setBecarios] = useState([]);
  const [evaluadores, setEvaluadores] = useState([]);
  const [assigningBecaId, setAssigningBecaId] = useState(null);
  const [assignmentTutorId, setAssignmentTutorId] = useState('');
  const [assignmentError, setAssignmentError] = useState('');
  const [assignmentSaving, setAssignmentSaving] = useState(false);
  const [archivingBecaId, setArchivingBecaId] = useState(null);
  const [archiveFeedback, setArchiveFeedback] = useState({ type: '', message: '' });

  const sessionUser = useSessionUser();

  const fetchBecas = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/becas?include_archived=1');
      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      const payload = await response.json();
      const data = Array.isArray(payload?.data) ? payload.data : payload;
      setBecas(data);
      setArchiveFeedback({ type: '', message: '' });
    } catch (err) {
      setError(err.message || 'No se pudo cargar el listado de becas.');
    } finally {
      setLoading(false);
    }
  };

  const fetchOptions = async () => {
    try {
      const [investigadoresResponse, becariosResponse, evaluadoresResponse] = await Promise.all([
        fetch('/api/roles/investigador/usuarios'),
        fetch('/api/roles/becario/usuarios'),
        fetch('/api/roles/evaluador/usuarios'),
      ]);

      if (!investigadoresResponse.ok || !becariosResponse.ok || !evaluadoresResponse.ok) {
        throw new Error('No se pudieron cargar las listas de usuarios.');
      }

      const investigadoresData = await investigadoresResponse.json();
      const becariosData = await becariosResponse.json();
      const evaluadoresData = await evaluadoresResponse.json();

      const formatUsers = (items, roleLabel) =>
        (Array.isArray(items) ? items : []).map((item) => ({
          ...item,
          roleLabel,
        }));

      const combinedBecarios = [
        ...formatUsers(investigadoresData, 'Investigador'),
        ...formatUsers(becariosData, 'Becario'),
      ];

      const uniqueBecarios = Array.from(
        new Map(combinedBecarios.map((user) => [user.id, user])).values()
      ).sort((a, b) => a.name.localeCompare(b.name, 'es'));

      setBecarios(uniqueBecarios);
      setEvaluadores(Array.isArray(evaluadoresData) ? evaluadoresData : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOptions();
    fetchBecas();
  }, []);

  const sortedBecas = useMemo(() => {
    return [...becas].sort((a, b) => {
      const codeA = a?.codigo ?? '';
      const codeB = b?.codigo ?? '';
      return codeA.localeCompare(codeB, 'es');
    });
  }, [becas]);

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case 'Activa':
        return 'bg-success';
      case 'Finalizada':
        return 'bg-secondary';
      case 'En evaluación':
        return 'bg-warning text-dark';
      case ARCHIVED_STATE:
        return 'bg-dark';
      default:
        return 'bg-primary';
    }
  };

  const renderUsuario = (usuario, fallback = 'Sin asignar') => {
    if (!usuario?.nombre) {
      return fallback;
    }

    const roleLabel = usuario.role?.displayName ?? usuario.role?.name;

    return (
      <div>
        <div>{usuario.nombre}</div>
        {roleLabel && <small className="text-muted">{roleLabel}</small>}
      </div>
    );
  };

  const formatDate = (value) => {
    if (!value) {
      return '—';
    }

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('es-BO');
  };

  const openCreateModal = () => {
    setFormData(emptyForm);
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (beca) => {
    setFormData({
      id: beca.id,
      codigo: beca.codigo ?? '',
      becarioId: beca.becario?.id ? String(beca.becario.id) : '',
      tutorId: beca.tutor?.id ? String(beca.tutor.id) : '',
      fechaInicio: beca.fechaInicio ?? '',
      fechaFin: beca.fechaFin ?? '',
      estado: beca.estado ?? ESTADO_OPTIONS[0],
      tituloProyecto: beca.tituloProyecto ?? '',
      areaInvestigacion: beca.areaInvestigacion ?? '',
      evaluacionFinal: beca.evaluacionFinal ?? '',
    });
    setFormError('');
    setModalOpen(true);
  };

  const closeModal = () => {
    if (!saving) {
      setModalOpen(false);
    }
  };

  const handleStartAssignTutor = (beca) => {
    if (beca.estado === ARCHIVED_STATE) {
      return;
    }

    setAssigningBecaId(beca.id);
    setAssignmentTutorId(beca.tutor?.id ? String(beca.tutor.id) : '');
    setAssignmentError('');
  };

  const handleCancelAssignTutor = () => {
    if (!assignmentSaving) {
      setAssigningBecaId(null);
      setAssignmentTutorId('');
      setAssignmentError('');
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const buildErrorMessage = (payload, fallback) => {
    if (!payload) {
      return fallback;
    }

    if (payload.message) {
      return payload.message;
    }

    if (payload.errors) {
      const messages = Object.values(payload.errors)
        .flat()
        .filter(Boolean);
      if (messages.length > 0) {
        return messages.join(' ');
      }
    }

    return fallback;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    setSaving(true);

    const payload = {
      codigo: formData.codigo.trim(),
      becarioId: formData.becarioId ? Number(formData.becarioId) : null,
      tutorId: formData.tutorId ? Number(formData.tutorId) : null,
      fechaInicio: formData.fechaInicio,
      fechaFin: formData.fechaFin || null,
      estado: formData.estado,
      tituloProyecto: formData.tituloProyecto.trim(),
      areaInvestigacion: formData.areaInvestigacion.trim(),
      evaluacionFinal: formData.evaluacionFinal.trim(),
    };

    const isEdit = Boolean(formData.id);
    const endpoint = isEdit ? `/api/becas/${formData.id}` : '/api/becas';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let message = 'No se pudo guardar la beca.';
        try {
          const errorPayload = await response.json();
          message = buildErrorMessage(errorPayload, message);
        } catch (parseError) {
          // Ignoramos el error de parseo y usamos el mensaje por defecto.
        }
        throw new Error(message);
      }

      const responseData = await response.json();
      const savedBeca = responseData?.data ?? responseData;

      setBecas((prev) => {
        if (isEdit) {
          return prev.map((item) => (item.id === savedBeca.id ? savedBeca : item));
        }
        return [savedBeca, ...prev];
      });

      setModalOpen(false);
    } catch (err) {
      setFormError(err.message || 'No se pudo guardar la beca.');
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async (beca) => {
    if (!beca?.id) {
      return;
    }

    setArchiveFeedback({ type: '', message: '' });
    setArchivingBecaId(beca.id);

    const payload = sessionUser?.id ? { cerradaPorId: sessionUser.id } : {};

    try {
      const response = await fetch(`/api/becas/${beca.id}/archivar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      let responseBody = null;

      if (!response.ok) {
        try {
          responseBody = await response.json();
        } catch (parseError) {
          // noop
        }

        const message = buildErrorMessage(responseBody, 'No se pudo archivar la beca seleccionada.');
        throw new Error(message);
      }

      responseBody = await response.json();
      const archivedBeca = responseBody?.data ?? responseBody;

      setBecas((prev) =>
        prev.map((item) => (item.id === archivedBeca.id ? { ...item, ...archivedBeca } : item))
      );

      if (assigningBecaId === beca.id) {
        setAssigningBecaId(null);
        setAssignmentTutorId('');
      }

      setArchiveFeedback({
        type: 'success',
        message: `La beca ${beca.codigo} se archivó correctamente.`,
      });
    } catch (err) {
      setArchiveFeedback({
        type: 'danger',
        message: err.message || 'No se pudo archivar la beca seleccionada.',
      });
    } finally {
      setArchivingBecaId(null);
    }
  };

  const handleAssignTutorSubmit = async (event) => {
    event.preventDefault();

    if (!assigningBecaId) {
      return;
    }

    if (!assignmentTutorId) {
      setAssignmentError('Selecciona un tutor para continuar.');
      return;
    }

    setAssignmentSaving(true);
    setAssignmentError('');

    try {
      const response = await fetch(`/api/becas/${assigningBecaId}/tutor`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tutorId: Number(assignmentTutorId) }),
      });

      if (!response.ok) {
        let message = 'No se pudo asignar el tutor seleccionado.';
        try {
          const errorPayload = await response.json();
          message = buildErrorMessage(errorPayload, message);
        } catch (parseError) {
          // Ignoramos el error de parseo y usamos el mensaje por defecto.
        }
        throw new Error(message);
      }

      const responseData = await response.json();
      const updatedBeca = responseData?.data ?? responseData;

      setBecas((prev) =>
        prev.map((item) => (item.id === updatedBeca.id ? { ...item, ...updatedBeca } : item))
      );

      setAssigningBecaId(null);
      setAssignmentTutorId('');
    } catch (err) {
      setAssignmentError(err.message || 'No se pudo asignar el tutor seleccionado.');
    } finally {
      setAssignmentSaving(false);
    }
  };

  const handleDelete = async (beca) => {
    if (beca.estado === ARCHIVED_STATE) {
      setArchiveFeedback({
        type: 'warning',
        message: 'Las becas archivadas son de solo lectura y no se pueden eliminar.',
      });
      return;
    }

    const confirmation = window.confirm(
      `¿Deseas eliminar la beca ${beca.codigo}? Esta acción no se puede deshacer.`
    );

    if (!confirmation) {
      return;
    }

    try {
      const response = await fetch(`/api/becas/${beca.id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('No se pudo eliminar la beca.');
      }

      setBecas((prev) => prev.filter((item) => item.id !== beca.id));
    } catch (err) {
      alert(err.message || 'No se pudo eliminar la beca.');
    }
  };

  return (
    <div className="listado-becas-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h4 mb-0">Gestión de Becas de Investigación</h2>
        <button type="button" className="btn btn-primary" onClick={openCreateModal}>
          <i className="bi bi-plus-circle"></i> Nueva Beca
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {archiveFeedback.message && (
        <div
          className={`alert alert-${archiveFeedback.type || 'info'}`}
          role="alert"
        >
          {archiveFeedback.message}
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">Cargando becas...</div>
      ) : sortedBecas.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No hay becas registradas todavía. Crea la primera para comenzar.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th scope="col">Código</th>
                <th scope="col">Título del proyecto</th>
                <th scope="col">Área de investigación</th>
                <th scope="col">Becario</th>
                <th scope="col">Tutor</th>
                <th scope="col">Fecha inicio</th>
                <th scope="col">Fecha fin</th>
                <th scope="col">Fecha cierre</th>
                <th scope="col">Estado</th>
                <th scope="col">Evaluación final</th>
                <th scope="col" className="text-center">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedBecas.map((beca) => {
                const isArchived = beca.estado === ARCHIVED_STATE;
                const canArchive = beca.estado === 'Finalizada';

                return (
                  <React.Fragment key={beca.id}>
                    <tr>
                      <td>{beca.codigo}</td>
                      <td>{beca.tituloProyecto ?? '—'}</td>
                      <td>{beca.areaInvestigacion ?? '—'}</td>
                      <td>{renderUsuario(beca.becario)}</td>
                      <td>{renderUsuario(beca.tutor)}</td>
                      <td>{beca.fechaInicio ?? '—'}</td>
                      <td>{beca.fechaFin ?? '—'}</td>
                      <td>{formatDate(beca.fechaCierre)}</td>
                      <td>
                        <span className={`badge ${getEstadoBadge(beca.estado)}`}>
                          {beca.estado}
                        </span>
                      </td>
                      <td>
                        {beca.evaluacionFinal?.estadoFinal
                          ? `${beca.evaluacionFinal.estadoFinal}`
                          : beca.evaluacionFinal ?? '—'}
                      </td>
                      <td className="text-center">
                        <div className="btn-group" role="group">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            title={beca.tutor ? 'Cambiar tutor' : 'Asignar tutor'}
                            onClick={() => handleStartAssignTutor(beca)}
                            disabled={
                              isArchived || (assignmentSaving && assigningBecaId === beca.id)
                            }
                          >
                            <i className="bi bi-person-badge"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            title={isArchived ? 'Beca archivada' : 'Editar beca'}
                            onClick={() => openEditModal(beca)}
                            disabled={isArchived}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-success"
                            title={
                              beca.estado === 'Finalizada'
                                ? 'Cerrar beca y mover al archivo histórico'
                                : 'Disponible cuando la beca esté finalizada'
                            }
                            onClick={() => handleArchive(beca)}
                            disabled={!canArchive || archivingBecaId === beca.id}
                          >
                            {archivingBecaId === beca.id ? (
                              <span className="spinner-border spinner-border-sm" role="status" />
                            ) : (
                              <i className="bi bi-archive"></i>
                            )}
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            title={isArchived ? 'Beca archivada' : 'Eliminar beca'}
                            onClick={() => handleDelete(beca)}
                            disabled={isArchived}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                    {assigningBecaId === beca.id && (
                      <tr key={`${beca.id}-assign`} className="table-light">
                        <td colSpan="11">
                      <form className="row g-3 align-items-end" onSubmit={handleAssignTutorSubmit}>
                        <div className="col-md-5">
                          <label className="form-label" htmlFor={`tutor-select-${beca.id}`}>
                            Selecciona un tutor para {beca.becario?.nombre ?? 'el becario'}
                          </label>
                          <select
                            id={`tutor-select-${beca.id}`}
                            className="form-select"
                            value={assignmentTutorId}
                            onChange={(event) => setAssignmentTutorId(event.target.value)}
                            disabled={assignmentSaving}
                            required
                          >
                            <option value="">Selecciona un tutor…</option>
                            {evaluadores.map((evaluador) => (
                              <option key={evaluador.id} value={evaluador.id}>
                                {evaluador.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-3">
                          <label className="form-label">&nbsp;</label>
                          <div>
                            <button
                              type="submit"
                              className="btn btn-primary me-2"
                              disabled={assignmentSaving}
                            >
                              {assignmentSaving ? 'Guardando…' : 'Guardar asignación'}
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={handleCancelAssignTutor}
                              disabled={assignmentSaving}
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                        <div className="col-md-4">
                          {assignmentError && (
                            <div className="alert alert-danger mb-0" role="alert">
                              {assignmentError}
                            </div>
                          )}
                        </div>
                      </form>
                    </td>
                  </tr>
                )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {formData.id ? 'Editar beca de investigación' : 'Nueva beca de investigación'}
                </h5>
                <button type="button" className="btn-close" aria-label="Cerrar" onClick={closeModal} />
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {formError && (
                    <div className="alert alert-danger" role="alert">
                      {formError}
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label" htmlFor="codigo">
                      Código de beca
                    </label>
                    <input
                      id="codigo"
                      name="codigo"
                      type="text"
                      className="form-control"
                      value={formData.codigo}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label" htmlFor="tituloProyecto">
                      Título del proyecto
                    </label>
                    <input
                      id="tituloProyecto"
                      name="tituloProyecto"
                      type="text"
                      className="form-control"
                      value={formData.tituloProyecto}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label" htmlFor="areaInvestigacion">
                      Área de investigación
                    </label>
                    <input
                      id="areaInvestigacion"
                      name="areaInvestigacion"
                      type="text"
                      className="form-control"
                      value={formData.areaInvestigacion}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label" htmlFor="becarioId">
                      Becario
                    </label>
                    <select
                      id="becarioId"
                      name="becarioId"
                      className="form-select"
                      value={formData.becarioId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecciona un becario o investigador…</option>
                      {becarios.map((usuario) => (
                        <option key={usuario.id} value={usuario.id}>
                          {usuario.name}
                          {usuario.roleLabel ? ` (${usuario.roleLabel})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label" htmlFor="tutorId">
                      Tutor (Evaluador)
                    </label>
                    <select
                      id="tutorId"
                      name="tutorId"
                      className="form-select"
                      value={formData.tutorId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecciona un tutor…</option>
                      {evaluadores.map((evaluador) => (
                        <option key={evaluador.id} value={evaluador.id}>
                          {evaluador.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="fechaInicio">
                        Fecha de inicio
                      </label>
                      <input
                        id="fechaInicio"
                        name="fechaInicio"
                        type="date"
                        className="form-control"
                        value={formData.fechaInicio}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="fechaFin">
                        Fecha de finalización
                      </label>
                      <input
                        id="fechaFin"
                        name="fechaFin"
                        type="date"
                        className="form-control"
                        value={formData.fechaFin}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="form-label" htmlFor="estado">
                      Estado de la beca
                    </label>
                    <select
                      id="estado"
                      name="estado"
                      className="form-select"
                      value={formData.estado}
                      onChange={handleInputChange}
                      required
                      disabled={formData.estado === ARCHIVED_STATE}
                    >
                      {(formData.estado === ARCHIVED_STATE
                        ? [ARCHIVED_STATE]
                        : ESTADO_OPTIONS
                      ).map((estado) => (
                        <option key={estado} value={estado}>
                          {estado}
                        </option>
                      ))}
                    </select>
                    {formData.estado === ARCHIVED_STATE && (
                      <small className="form-text text-muted">
                        Las becas archivadas son de solo lectura.
                      </small>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label" htmlFor="evaluacionFinal">
                      Evaluación final
                    </label>
                    <textarea
                      id="evaluacionFinal"
                      name="evaluacionFinal"
                      className="form-control"
                      value={formData.evaluacionFinal}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={closeModal}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Guardando…' : 'Guardar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListadoBecas;
