import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  ProgressBar,
  Row,
  Spinner,
  Table,
} from 'react-bootstrap';
import Header from '../components/Header';
import useSessionUser from '../hooks/useSessionUser';
import './docente.css';

const estadoVariant = {
  Pendiente: 'warning',
  Firmado: 'success',
  Observado: 'danger',
};

const emptyActividad = { fecha: '', actividad: '', resultado: '' };

const buildDefaultFormState = () => ({
  becaId: '',
  becarioId: '',
  carrera: '',
  universitario: '',
  proyecto: '',
  trimestre: '1',
  porcentajeAvance: 0,
  fechaReporte: new Date().toISOString().split('T')[0],
  observaciones: '',
  actividades: [{ ...emptyActividad }],
  estado: 'Pendiente',
  firmaTutor: false,
  firmaBecario: false,
  firmaDirector: false,
});

const RevisarReportes = () => {
  const user = useSessionUser();
  const [reportes, setReportes] = useState([]);
  const [becas, setBecas] = useState([]);
  const [reportesLoading, setReportesLoading] = useState(true);
  const [becasLoading, setBecasLoading] = useState(true);
  const [error, setError] = useState('');
  const [becasError, setBecasError] = useState('');
  const [selectedReporte, setSelectedReporte] = useState(null);
  const [filterTrimestre, setFilterTrimestre] = useState('todos');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formState, setFormState] = useState(buildDefaultFormState());
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const controller = new AbortController();

    const loadReportes = async () => {
      setReportesLoading(true);
      setError('');

      try {
        const response = await fetch(`/api/reportes-avance?tutor_id=${user.id}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}`);
        }

        const payload = await response.json();
        const data = Array.isArray(payload?.data) ? payload.data : payload;
        const ordered = Array.isArray(data)
          ? [...data].sort((a, b) => {
              const dateA = new Date(a.fechaReporte ?? a.createdAt ?? 0);
              const dateB = new Date(b.fechaReporte ?? b.createdAt ?? 0);
              return dateB - dateA;
            })
          : [];

        setReportes(ordered);
        setSelectedReporte((prev) => {
          if (!ordered.length) {
            return null;
          }

          if (!prev) {
            return ordered[0];
          }

          return ordered.find((reporte) => reporte.id === prev.id) ?? ordered[0];
        });
      } catch (err) {
        if (err.name === 'AbortError') {
          return;
        }

        setError(err.message || 'No se pudo obtener los reportes registrados.');
        setReportes([]);
        setSelectedReporte(null);
      } finally {
        setReportesLoading(false);
      }
    };

    loadReportes();

    return () => controller.abort();
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const controller = new AbortController();

    const loadBecas = async () => {
      setBecasLoading(true);
      setBecasError('');

      try {
        const response = await fetch(`/api/becas?tutor_id=${user.id}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}`);
        }

        const payload = await response.json();
        const data = Array.isArray(payload?.data) ? payload.data : payload;
        setBecas(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err.name === 'AbortError') {
          return;
        }

        setBecasError(err.message || 'No se pudo recuperar la lista de becas asignadas.');
        setBecas([]);
      } finally {
        setBecasLoading(false);
      }
    };

    loadBecas();

    return () => controller.abort();
  }, [user?.id]);

  const resumen = useMemo(() => {
    if (!reportes.length) {
      return { total: 0, firmados: 0, promedio: 0 };
    }

    const total = reportes.length;
    const firmados = reportes.filter((reporte) => reporte.firmadoTutor).length;
    const promedio = Math.round(
      reportes.reduce((acc, reporte) => acc + (reporte.porcentajeAvance ?? 0), 0) / total,
    );

    return { total, firmados, promedio };
  }, [reportes]);

  const filteredReportes = useMemo(() => {
    if (filterTrimestre === 'todos') {
      return reportes;
    }

    return reportes.filter((reporte) => String(reporte.trimestre) === filterTrimestre);
  }, [reportes, filterTrimestre]);

  const formatDate = (value) => {
    if (!value) {
      return '—';
    }

    return new Date(value).toLocaleDateString('es-BO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleSelectReporte = (reporte) => {
    setSelectedReporte(reporte);
  };

  const handleOpenModal = (reporte = null) => {
    setFormError('');
    setSuccessMessage('');

    if (reporte) {
      setEditingId(reporte.id);
      setFormState({
        becaId: String(reporte.becaId ?? reporte.beca?.id ?? ''),
        becarioId: String(reporte.becarioId ?? reporte.becario?.id ?? ''),
        carrera: reporte.carrera ?? '',
        universitario: reporte.universitario ?? reporte.becario?.nombre ?? '',
        proyecto: reporte.proyecto ?? reporte.beca?.codigo ?? '',
        trimestre: String(reporte.trimestre ?? '1'),
        porcentajeAvance: reporte.porcentajeAvance ?? 0,
        fechaReporte: reporte.fechaReporte ?? new Date().toISOString().split('T')[0],
        observaciones: reporte.observaciones ?? '',
        actividades:
          (reporte.actividades && reporte.actividades.length > 0
            ? reporte.actividades.map((actividad) => ({
                fecha: actividad.fecha ?? '',
                actividad: actividad.actividad ?? '',
                resultado: actividad.resultado ?? '',
              }))
            : [{ ...emptyActividad }]),
        estado: reporte.estado ?? 'Pendiente',
        firmaTutor: Boolean(reporte.firmadoTutor),
        firmaBecario: Boolean(reporte.firmadoBecario),
        firmaDirector: Boolean(reporte.firmadoDirector),
      });
    } else {
      setEditingId(null);
      setFormState(buildDefaultFormState());
    }

    setShowModal(true);
  };

  const handleCloseModal = () => {
    if (saving) {
      return;
    }

    setShowModal(false);
  };

  const handleFormChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormState((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleBecaChange = (event) => {
    const { value } = event.target;
    const becaSeleccionada = becas.find((beca) => String(beca.id) === value);

    setFormState((prev) => ({
      ...prev,
      becaId: value,
      becarioId: becaSeleccionada?.becario?.id ? String(becaSeleccionada.becario.id) : '',
      universitario: becaSeleccionada?.becario?.nombre ?? prev.universitario,
      proyecto: becaSeleccionada?.tituloProyecto ?? becaSeleccionada?.codigo ?? prev.proyecto,
      carrera: prev.carrera || becaSeleccionada?.areaInvestigacion || '',
    }));
  };

  const handleActividadChange = (index, field, value) => {
    setFormState((prev) => {
      const updated = prev.actividades.map((actividad, idx) =>
        idx === index ? { ...actividad, [field]: value } : actividad,
      );

      return { ...prev, actividades: updated };
    });
  };

  const handleRemoveActividad = (index) => {
    setFormState((prev) => {
      if (prev.actividades.length === 1) {
        return prev;
      }

      const updated = prev.actividades.filter((_, idx) => idx !== index);
      return { ...prev, actividades: updated.length ? updated : [{ ...emptyActividad }] };
    });
  };

  const handleAddActividad = () => {
    setFormState((prev) => ({
      ...prev,
      actividades: [...prev.actividades, { ...emptyActividad }],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user?.id) {
      return;
    }

    setSaving(true);
    setFormError('');

    try {
      const payload = {
        becaId: Number(formState.becaId),
        becarioId: Number(formState.becarioId),
        tutorId: user.id,
        carrera: formState.carrera,
        universitario: formState.universitario,
        proyecto: formState.proyecto,
        trimestre: Number(formState.trimestre),
        porcentajeAvance: Number(formState.porcentajeAvance),
        fechaReporte: formState.fechaReporte,
        observaciones: formState.observaciones,
        actividades: formState.actividades.map((actividad) => ({
          fecha: actividad.fecha,
          actividad: actividad.actividad,
          resultado: actividad.resultado,
        })),
        estado: formState.estado,
        firmaTutor: formState.firmaTutor,
        firmaBecario: formState.firmaBecario,
        firmaDirector: formState.firmaDirector,
      };

      const endpoint = editingId ? `/api/reportes-avance/${editingId}` : '/api/reportes-avance';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const payloadResponse = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message =
          payloadResponse?.message
          || (payloadResponse?.errors && Object.values(payloadResponse.errors).flat().join(' '))
          || 'No se pudo guardar el reporte.';
        throw new Error(message);
      }

      const data = payloadResponse?.data ?? payloadResponse;

      setReportes((prev) => {
        const next = editingId
          ? prev.map((reporte) => (reporte.id === data.id ? data : reporte))
          : [data, ...prev];

        return next.sort((a, b) => {
          const dateA = new Date(a.fechaReporte ?? a.createdAt ?? 0);
          const dateB = new Date(b.fechaReporte ?? b.createdAt ?? 0);
          return dateB - dateA;
        });
      });

      setSelectedReporte(data);
      setShowModal(false);
      setSuccessMessage(editingId ? 'Reporte actualizado correctamente.' : 'Reporte registrado correctamente.');
    } catch (err) {
      setFormError(err.message || 'No se pudo guardar el reporte.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="revisar-reportes-wrapper">
      <Header />
      <section className="revisar-reportes-header text-center py-4 border-bottom">
        <Container>
          <h1 className="h2 fw-bold">Reportes institucionales del tutor</h1>
          <p className="text-muted mb-0">
            Registra el avance trimestral de cada becario y mantén trazabilidad de las firmas requeridas por la
            coordinación.
          </p>
        </Container>
      </section>

      <Container className="py-4">
        {successMessage && (
          <Alert variant="success" className="mb-3">
            {successMessage}
          </Alert>
        )}

        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

        {becasError && (
          <Alert variant="warning" className="mb-3">
            {becasError}
          </Alert>
        )}

        <Row className="g-3 mb-4">
          <Col md={4}>
            <Card className="text-center metric-card h-100">
              <Card.Body>
                <h6 className="text-muted mb-1">Reportes registrados</h6>
                <h3 className="text-primary mb-0">{resumen.total}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center metric-card h-100">
              <Card.Body>
                <h6 className="text-muted mb-1">Reportes firmados</h6>
                <h3 className="text-success mb-0">{resumen.firmados}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center metric-card h-100">
              <Card.Body>
                <h6 className="text-muted mb-1">Promedio de avance</h6>
                <h3 className="text-info mb-0">{resumen.promedio}%</h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="g-3">
          <Col lg={8}>
            <Card className="h-100">
              <Card.Header className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                <div>
                  <h5 className="mb-1 fw-bold">Reportes registrados</h5>
                  <small className="text-muted">Filtra por trimestre y selecciona un reporte para ver el detalle.</small>
                </div>
                <div className="d-flex flex-column flex-md-row gap-2 mt-3 mt-md-0">
                  <Form.Select
                    size="sm"
                    aria-label="Filtrar por trimestre"
                    value={filterTrimestre}
                    onChange={(event) => setFilterTrimestre(event.target.value)}
                  >
                    <option value="todos">Todos los trimestres</option>
                    {[1, 2, 3, 4].map((option) => (
                      <option key={option} value={option}>
                        Trimestre {option}
                      </option>
                    ))}
                  </Form.Select>
                  <Button size="sm" onClick={() => handleOpenModal()} disabled={becasLoading || becas.length === 0}>
                    ➕ Registrar nuevo reporte
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
                {reportesLoading ? (
                  <div className="d-flex align-items-center justify-content-center py-4">
                    <Spinner animation="border" role="status" className="me-2" />
                    <span>Cargando reportes…</span>
                  </div>
                ) : filteredReportes.length === 0 ? (
                  <p className="mb-0">Aún no registraste reportes bajo los filtros seleccionados.</p>
                ) : (
                  <div className="table-responsive">
                    <Table hover className="align-middle">
                      <thead>
                        <tr>
                          <th>Proyecto</th>
                          <th>Becario</th>
                          <th>Trimestre</th>
                          <th>Fecha</th>
                          <th>Avance</th>
                          <th>Estado</th>
                          <th className="text-end">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredReportes.map((reporte) => (
                          <tr
                            key={reporte.id}
                            className={selectedReporte?.id === reporte.id ? 'table-active' : ''}
                            onClick={() => handleSelectReporte(reporte)}
                          >
                            <td>{reporte.proyecto ?? reporte.beca?.codigo ?? '—'}</td>
                            <td>{reporte.universitario ?? reporte.becario?.nombre ?? '—'}</td>
                            <td>Trimestre {reporte.trimestre}</td>
                            <td>{formatDate(reporte.fechaReporte)}</td>
                            <td>
                              <strong>{reporte.porcentajeAvance ?? 0}%</strong>
                            </td>
                            <td>
                              <Badge bg={estadoVariant[reporte.estado] ?? 'secondary'}>{reporte.estado}</Badge>
                            </td>
                            <td className="text-end">
                              <Button
                                variant="link"
                                size="sm"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleOpenModal(reporte);
                                }}
                              >
                                ✏️ Editar
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="h-100">
              <Card.Header as="h5" className="fw-bold">
                Detalle del reporte
              </Card.Header>
              <Card.Body>
                {!selectedReporte ? (
                  <p className="mb-0">Selecciona un registro para ver sus actividades.</p>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    <div>
                      <p className="text-muted mb-1">Proyecto</p>
                      <h5 className="mb-0">{selectedReporte.proyecto ?? selectedReporte.beca?.codigo ?? '—'}</h5>
                    </div>
                    <div>
                      <p className="text-muted mb-1">Becario</p>
                      <p className="fw-semibold mb-0">
                        {selectedReporte.universitario ?? selectedReporte.becario?.nombre ?? '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted mb-1">Porcentaje de avance</p>
                      <ProgressBar now={selectedReporte.porcentajeAvance ?? 0} label={`${selectedReporte.porcentajeAvance ?? 0}%`} />
                    </div>
                    <div>
                      <p className="text-muted mb-1">Actividades registradas</p>
                      <ul className="list-unstyled mb-0 reporte-actividades-list">
                        {(selectedReporte.actividades ?? []).map((actividad) => (
                          <li key={`${selectedReporte.id}-${actividad.numero}`}>
                            <strong>{actividad.numero}.</strong> {actividad.actividad}
                            <span className="d-block text-muted small">
                              {formatDate(actividad.fecha)} · Resultado: {actividad.resultado}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {selectedReporte.observaciones && (
                      <Alert variant="light" className="border-start border-4 border-primary">
                        <strong>Observaciones:</strong> {selectedReporte.observaciones}
                      </Alert>
                    )}
                    <div className="d-flex flex-wrap signature-pill-group">
                      <div className={`signature-pill ${selectedReporte.firmadoTutor ? 'signed' : ''}`}>
                        Tutor: {selectedReporte.firmadoTutor ? 'Firmado' : 'Pendiente'}
                      </div>
                      <div className={`signature-pill ${selectedReporte.firmadoBecario ? 'signed' : ''}`}>
                        Becario: {selectedReporte.firmadoBecario ? 'Firmado' : 'Pendiente'}
                      </div>
                      <div className={`signature-pill ${selectedReporte.firmadoDirector ? 'signed' : ''}`}>
                        Director: {selectedReporte.firmadoDirector ? 'Firmado' : 'Pendiente'}
                      </div>
                    </div>
                    <Button variant="primary" onClick={() => handleOpenModal(selectedReporte)}>
                      Actualizar información
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Modal show={showModal} onHide={handleCloseModal} size="lg" backdrop="static">
        <Modal.Header closeButton={!saving}>
          <Modal.Title>{editingId ? 'Editar reporte trimestral' : 'Registrar nuevo reporte'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formError && (
            <Alert variant="danger">{formError}</Alert>
          )}

          <Form onSubmit={handleSubmit} className="tutor-reportes-form">
            <Row className="g-3 mb-3">
              <Col md={6}>
                <Form.Group controlId="becaId">
                  <Form.Label>Beca / Proyecto</Form.Label>
                  <Form.Select
                    name="becaId"
                    value={formState.becaId}
                    onChange={handleBecaChange}
                    required
                    disabled={saving || becas.length === 0}
                  >
                    <option value="">Selecciona una opción</option>
                    {becas.map((beca) => (
                      <option key={beca.id} value={beca.id}>
                        {beca.codigo} · {beca.becario?.nombre}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="carrera">
                  <Form.Label>Carrera</Form.Label>
                  <Form.Control
                    name="carrera"
                    value={formState.carrera}
                    onChange={handleFormChange}
                    required
                    disabled={saving}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="g-3 mb-3">
              <Col md={6}>
                <Form.Group controlId="universitario">
                  <Form.Label>Universitario</Form.Label>
                  <Form.Control
                    name="universitario"
                    value={formState.universitario}
                    onChange={handleFormChange}
                    required
                    disabled={saving}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="trimestre">
                  <Form.Label>Trimestre</Form.Label>
                  <Form.Select
                    name="trimestre"
                    value={formState.trimestre}
                    onChange={handleFormChange}
                    disabled={saving}
                  >
                    {[1, 2, 3, 4].map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="fechaReporte">
                  <Form.Label>Fecha de registro</Form.Label>
                  <Form.Control
                    type="date"
                    name="fechaReporte"
                    value={formState.fechaReporte}
                    onChange={handleFormChange}
                    required
                    disabled={saving}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="g-3 mb-3">
              <Col md={8}>
                <Form.Group controlId="proyecto">
                  <Form.Label>Nombre del proyecto</Form.Label>
                  <Form.Control
                    name="proyecto"
                    value={formState.proyecto}
                    onChange={handleFormChange}
                    required
                    disabled={saving}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="porcentajeAvance">
                  <Form.Label>Porcentaje global de avance</Form.Label>
                  <Form.Control
                    type="number"
                    min={0}
                    max={100}
                    name="porcentajeAvance"
                    value={formState.porcentajeAvance}
                    onChange={handleFormChange}
                    required
                    disabled={saving}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label className="mb-0">Actividades desarrolladas</Form.Label>
                <Button variant="outline-primary" size="sm" onClick={handleAddActividad} disabled={saving}>
                  ➕ Agregar fila
                </Button>
              </div>

              {formState.actividades.map((actividad, index) => (
                <Row className="g-2 align-items-end actividad-row" key={`actividad-${index}`}>
                  <Col md={3}>
                    <Form.Group controlId={`actividad-fecha-${index}`}>
                      <Form.Label>Fecha</Form.Label>
                      <Form.Control
                        type="date"
                        value={actividad.fecha}
                        onChange={(event) => handleActividadChange(index, 'fecha', event.target.value)}
                        required
                        disabled={saving}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={5}>
                    <Form.Group controlId={`actividad-descripcion-${index}`}>
                      <Form.Label>Actividad</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={1}
                        value={actividad.actividad}
                        onChange={(event) => handleActividadChange(index, 'actividad', event.target.value)}
                        required
                        disabled={saving}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group controlId={`actividad-resultado-${index}`}>
                      <Form.Label>Resultado (%)</Form.Label>
                      <Form.Control
                        value={actividad.resultado}
                        onChange={(event) => handleActividadChange(index, 'resultado', event.target.value)}
                        required
                        disabled={saving}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={1} className="text-end">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemoveActividad(index)}
                      disabled={saving || formState.actividades.length === 1}
                    >
                      ✕
                    </Button>
                  </Col>
                </Row>
              ))}
            </div>

            <Row className="g-3 mb-3">
              <Col md={12}>
                <Form.Group controlId="observaciones">
                  <Form.Label>Observaciones</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="observaciones"
                    value={formState.observaciones}
                    onChange={handleFormChange}
                    disabled={saving}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="g-3 mb-3">
              <Col md={4}>
                <Form.Group controlId="estado">
                  <Form.Label>Estado del reporte</Form.Label>
                  <Form.Select name="estado" value={formState.estado} onChange={handleFormChange} disabled={saving}>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Firmado">Firmado</option>
                    <option value="Observado">Observado</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={8} className="d-flex align-items-center justify-content-around flex-wrap">
                <Form.Check
                  type="switch"
                  id="firmaTutor"
                  name="firmaTutor"
                  label="Firma Tutor"
                  checked={formState.firmaTutor}
                  onChange={handleFormChange}
                  disabled={saving}
                />
                <Form.Check
                  type="switch"
                  id="firmaBecario"
                  name="firmaBecario"
                  label="Firma Becario"
                  checked={formState.firmaBecario}
                  onChange={handleFormChange}
                  disabled={saving}
                />
                <Form.Check
                  type="switch"
                  id="firmaDirector"
                  name="firmaDirector"
                  label="Firma Director"
                  checked={formState.firmaDirector}
                  onChange={handleFormChange}
                  disabled={saving}
                />
              </Col>
            </Row>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleCloseModal} disabled={saving}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? 'Guardando…' : editingId ? 'Actualizar reporte' : 'Registrar reporte'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default RevisarReportes;
