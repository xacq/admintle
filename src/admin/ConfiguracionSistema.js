import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  ListGroup,
  Row,
  Spinner,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './admin.css';

const boolFromValue = (value, fallback = false) => {
  if (value === undefined || value === null) {
    return fallback;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    return value !== 0;
  }

  if (typeof value === 'string') {
    return ['1', 'true', 'verdadero', 'yes', 'si', 'sí'].includes(value.toLowerCase());
  }

  return fallback;
};

const formatDateTime = (value) => {
  if (!value) {
    return '—';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return `${date.toLocaleDateString('es-BO')} ${date.toLocaleTimeString('es-BO', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
};

const initialParameters = {
  academicYear: '',
  managementStartDate: '',
  managementEndDate: '',
  reportDeadline: '',
  maxReportsPerScholar: '',
  systemStatus: 'activo',
  maintenanceMode: false,
  notificationsEnabled: true,
  autoArchiveReports: true,
  researchLines: [],
};

const tareasMantenimiento = [
  {
    action: 'backup',
    titulo: 'Generar respaldo completo',
    descripcion: 'Realiza una copia de seguridad de la base de datos y archivos adjuntos.',
    icono: '💾',
  },
  {
    action: 'clean-temp',
    titulo: 'Depurar archivos temporales',
    descripcion: 'Elimina archivos temporales y cachés para mejorar el rendimiento.',
    icono: '🧹',
  },
  {
    action: 'recalculate-metrics',
    titulo: 'Recalcular métricas globales',
    descripcion: 'Actualiza estadísticas generales y consolida indicadores institucionales.',
    icono: '📈',
  },
];

const ConfiguracionSistema = () => {
  const navigate = useNavigate();
  const [parametros, setParametros] = useState(initialParameters);
  const [parametrosIniciales, setParametrosIniciales] = useState(null);
  const [lineasInvestigacion, setLineasInvestigacion] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [statusMessage, setStatusMessage] = useState(null);
  const [executingTask, setExecutingTask] = useState('');
  const [historial, setHistorial] = useState([]);
  const [lastSync, setLastSync] = useState(null);

  const lineasInvestigacionList = useMemo(
    () =>
      lineasInvestigacion
        .split('\n')
        .map((linea) => linea.trim())
        .filter((linea) => linea.length > 0),
    [lineasInvestigacion]
  );

  const resumenTarjetas = useMemo(() => {
    const statusLabels = {
      activo: { label: 'Activo', variant: 'success' },
      mantenimiento: { label: 'En mantenimiento', variant: 'warning' },
      cerrado: { label: 'Cerrado', variant: 'secondary' },
    };

    const statusInfo = statusLabels[parametros.systemStatus] ?? statusLabels.activo;

    return [
      {
        titulo: 'Estado general',
        valor: statusInfo.label,
        badge: statusInfo.variant,
        descripcion: 'Situación operativa actual del sistema institucional.',
      },
      {
        titulo: 'Gestión académica',
        valor: parametros.academicYear || 'Sin definir',
        descripcion: 'Periodo vigente configurado para las convocatorias.',
      },
      {
        titulo: 'Fecha límite de reportes',
        valor: parametros.reportDeadline
          ? new Date(parametros.reportDeadline).toLocaleDateString('es-BO')
          : 'No establecido',
        descripcion: 'Fecha tope para recepción de informes de avance.',
      },
      {
        titulo: 'Máx. reportes por becario',
        valor: parametros.maxReportsPerScholar !== '' ? parametros.maxReportsPerScholar : '—',
        descripcion: 'Cantidad máxima de reportes permitidos por gestión.',
      },
    ];
  }, [parametros]);

  const historialFormateado = useMemo(
    () =>
      historial.map((entrada, index) => ({
        id: entrada.id ?? `${entrada.action ?? 'evento'}-${index}`,
        action: entrada.action ?? entrada.descripcion ?? 'Actualización de parámetros',
        details:
          entrada.details ??
          entrada.detalle ??
          entrada.cambios ??
          'Se registró una modificación en la configuración del sistema.',
        performedBy: entrada.performedBy ?? entrada.usuario ?? 'Sistema',
        timestamp: formatDateTime(entrada.timestamp ?? entrada.performed_at ?? entrada.fecha ?? null),
      })),
    [historial]
  );

  const cargarParametros = async () => {
    setLoading(true);
    setLoadError('');
    setStatusMessage(null);

    try {
      const response = await fetch('/api/system-parameters');
      if (!response.ok) {
        throw new Error('No se pudo recuperar la configuración institucional.');
      }

      const payload = await response.json();
      const data = payload?.data ?? payload ?? {};
      const researchLines = Array.isArray(data.researchLines)
        ? data.researchLines
        : Array.isArray(data.research_lines)
        ? data.research_lines
        : [];

      const parsed = {
        academicYear: data.academicYear ?? data.academic_year ?? '',
        managementStartDate: data.managementStartDate ?? data.management_start_date ?? '',
        managementEndDate: data.managementEndDate ?? data.management_end_date ?? '',
        reportDeadline: data.reportDeadline ?? data.report_deadline ?? '',
        maxReportsPerScholar:
          data.maxReportsPerScholar ??
          data.max_reports_per_scholar ??
          initialParameters.maxReportsPerScholar,
        systemStatus: data.systemStatus ?? data.system_status ?? initialParameters.systemStatus,
        maintenanceMode: boolFromValue(data.maintenanceMode ?? data.maintenance_mode, false),
        notificationsEnabled: boolFromValue(
          data.notificationsEnabled ?? data.notifications_enabled,
          true
        ),
        autoArchiveReports: boolFromValue(
          data.autoArchiveReports ?? data.auto_archive_reports,
          true
        ),
        researchLines,
      };

      setParametros(parsed);
      setParametrosIniciales(parsed);
      setLineasInvestigacion(researchLines.join('\n'));
      setHistorial(
        Array.isArray(data.history)
          ? data.history
          : Array.isArray(payload?.history)
          ? payload.history
          : []
      );
      setLastSync(data.updatedAt ?? data.updated_at ?? payload?.updatedAt ?? null);
    } catch (error) {
      console.error(error);
      setLoadError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarParametros();
  }, []);

  const handleChange = (field, value) => {
    setParametros((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatusMessage(null);
    setSaving(true);

    const maxReports = Number.parseInt(parametros.maxReportsPerScholar, 10);

    const payload = {
      academic_year: parametros.academicYear,
      management_start_date: parametros.managementStartDate || null,
      management_end_date: parametros.managementEndDate || null,
      report_deadline: parametros.reportDeadline || null,
      max_reports_per_scholar: Number.isNaN(maxReports) ? 0 : maxReports,
      system_status: parametros.systemStatus,
      maintenance_mode: Boolean(parametros.maintenanceMode),
      notifications_enabled: Boolean(parametros.notificationsEnabled),
      auto_archive_reports: Boolean(parametros.autoArchiveReports),
      research_lines: lineasInvestigacionList,
    };

    try {
      const response = await fetch('/api/system-parameters', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const firstError = data?.errors ? Object.values(data.errors).flat()[0] : null;
        throw new Error(firstError || data?.message || 'No se pudo actualizar la configuración.');
      }

      const updated = data?.data ?? {};
      const researchLines = Array.isArray(updated.researchLines)
        ? updated.researchLines
        : payload.research_lines;

      const parsed = {
        academicYear: updated.academicYear ?? payload.academic_year,
        managementStartDate: updated.managementStartDate ?? payload.management_start_date ?? '',
        managementEndDate: updated.managementEndDate ?? payload.management_end_date ?? '',
        reportDeadline: updated.reportDeadline ?? payload.report_deadline ?? '',
        maxReportsPerScholar:
          updated.maxReportsPerScholar ?? payload.max_reports_per_scholar ?? initialParameters.maxReportsPerScholar,
        systemStatus: updated.systemStatus ?? payload.system_status,
        maintenanceMode:
          updated.maintenanceMode ?? boolFromValue(payload.maintenance_mode, initialParameters.maintenanceMode),
        notificationsEnabled:
          updated.notificationsEnabled ??
          boolFromValue(payload.notifications_enabled, initialParameters.notificationsEnabled),
        autoArchiveReports:
          updated.autoArchiveReports ??
          boolFromValue(payload.auto_archive_reports, initialParameters.autoArchiveReports),
        researchLines,
      };

      setParametros(parsed);
      setParametrosIniciales(parsed);
      setLineasInvestigacion(researchLines.join('\n'));
      setHistorial(Array.isArray(data.history) ? data.history : historial);
      setLastSync(updated.updatedAt ?? data.updatedAt ?? new Date().toISOString());
      setStatusMessage({
        type: 'success',
        message: data?.message || 'Parámetros institucionales actualizados correctamente.',
      });
    } catch (error) {
      console.error(error);
      setStatusMessage({ type: 'danger', message: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleRestaurarParametros = () => {
    if (!parametrosIniciales) {
      return;
    }

    setParametros(parametrosIniciales);
    setLineasInvestigacion((parametrosIniciales.researchLines ?? []).join('\n'));
    setStatusMessage({ type: 'info', message: 'Se restauraron los valores cargados desde el servidor.' });
  };

  const handleTareaMantenimiento = async (action) => {
    setExecutingTask(action);
    setStatusMessage(null);

    try {
      const response = await fetch('/api/system-parameters/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const firstError = data?.errors ? Object.values(data.errors).flat()[0] : null;
        throw new Error(firstError || data?.message || 'No se pudo completar la tarea solicitada.');
      }

      setStatusMessage({
        type: 'success',
        message: data?.message || 'La tarea de mantenimiento finalizó correctamente.',
      });

      if (Array.isArray(data?.history)) {
        setHistorial(data.history);
      }
    } catch (error) {
      console.error(error);
      setStatusMessage({ type: 'danger', message: error.message });
    } finally {
      setExecutingTask('');
    }
  };

  return (
    <div className="configuracion-sistema-wrapper">
      <Container className="py-4">
        <Button
          variant="link"
          className="px-0 mb-3 text-decoration-none"
          onClick={() => navigate('/dashboard/admin')}
        >
          ← Volver al panel principal
        </Button>

        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center mb-4 gap-3">
          <div>
            <h1 className="h3 fw-bold mb-1">⚙️ Configuración del Sistema</h1>
            <p className="text-muted mb-0">
              Defina parámetros institucionales, supervise el estado general y ejecute tareas de mantenimiento.
            </p>
          </div>
          <div className="text-muted small">
            Última sincronización:{' '}
            <strong>{lastSync ? formatDateTime(lastSync) : 'Sin información'}</strong>
          </div>
        </div>

        <Row className="g-3 mb-4">
          {resumenTarjetas.map((tarjeta) => (
            <Col key={tarjeta.titulo} xs={12} md={6} xl={3}>
              <Card className="summary-card h-100">
                <Card.Body>
                  <Card.Title className="text-uppercase text-muted fs-6 fw-semibold mb-2">
                    {tarjeta.titulo}
                  </Card.Title>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <h2 className="mb-0 fw-bold">{tarjeta.valor}</h2>
                    {tarjeta.badge && <Badge bg={tarjeta.badge}>{tarjeta.valor}</Badge>}
                  </div>
                  <p className="text-muted small mb-0">{tarjeta.descripcion}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {statusMessage && (
          <Alert
            variant={statusMessage.type}
            onClose={() => setStatusMessage(null)}
            dismissible
            className="mb-4"
          >
            {statusMessage.message}
          </Alert>
        )}

        {loadError ? (
          <Alert variant="danger" className="mb-0">
            {loadError}
            <div className="mt-2">
              <Button variant="outline-light" size="sm" onClick={cargarParametros}>
                Reintentar
              </Button>
            </div>
          </Alert>
        ) : loading ? (
          <div className="d-flex justify-content-center py-5">
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Cargando...</span>
            </Spinner>
          </div>
        ) : (
          <>
            <Row className="g-4 align-items-stretch">
              <Col lg={8}>
                <Card className="shadow-sm h-100">
                  <Card.Header as="h5" className="fw-semibold">
                    Parámetros institucionales
                  </Card.Header>
                  <Card.Body>
                    <Form onSubmit={handleSubmit}>
                      <Row className="g-3">
                        <Col md={6}>
                          <Form.Group controlId="academicYear">
                            <Form.Label>Gestión académica vigente</Form.Label>
                            <Form.Control
                              type="text"
                              value={parametros.academicYear}
                              onChange={(event) => handleChange('academicYear', event.target.value)}
                              placeholder="Ej. 2025"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group controlId="systemStatus">
                            <Form.Label>Estado general del sistema</Form.Label>
                            <Form.Select
                              value={parametros.systemStatus}
                              onChange={(event) => handleChange('systemStatus', event.target.value)}
                            >
                              <option value="activo">Activo</option>
                              <option value="mantenimiento">En mantenimiento</option>
                              <option value="cerrado">Cerrado</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group controlId="managementStart">
                            <Form.Label>Fecha de inicio de la gestión</Form.Label>
                            <Form.Control
                              type="date"
                              value={parametros.managementStartDate ?? ''}
                              onChange={(event) => handleChange('managementStartDate', event.target.value)}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group controlId="managementEnd">
                            <Form.Label>Fecha de cierre de la gestión</Form.Label>
                            <Form.Control
                              type="date"
                              value={parametros.managementEndDate ?? ''}
                              onChange={(event) => handleChange('managementEndDate', event.target.value)}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group controlId="reportDeadline">
                            <Form.Label>Fecha límite para recepción de reportes</Form.Label>
                            <Form.Control
                              type="date"
                              value={parametros.reportDeadline ?? ''}
                              onChange={(event) => handleChange('reportDeadline', event.target.value)}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group controlId="maxReports">
                            <Form.Label>Número máximo de reportes por becario</Form.Label>
                            <Form.Control
                              type="number"
                              min="0"
                              value={parametros.maxReportsPerScholar ?? ''}
                              onChange={(event) => handleChange('maxReportsPerScholar', event.target.value)}
                            />
                          </Form.Group>
                        </Col>
                        <Col xs={12}>
                          <Form.Group controlId="researchLines">
                            <Form.Label>Líneas de investigación habilitadas</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={5}
                              value={lineasInvestigacion}
                              onChange={(event) => setLineasInvestigacion(event.target.value)}
                              placeholder={'Ingrese una línea por fila. Ej. Tecnología educativa\nEnergías renovables'}
                            />
                            <Form.Text className="text-muted">
                              Se emplean para clasificar convocatorias, proyectos y reportes asociados.
                            </Form.Text>
                          </Form.Group>
                        </Col>
                        <Col xs={12}>
                          <div className="bg-light border rounded p-3">
                            <h6 className="fw-semibold mb-2">Vista previa de líneas registradas</h6>
                            {lineasInvestigacionList.length > 0 ? (
                              <ul className="mb-0 ps-3">
                                {lineasInvestigacionList.map((linea, index) => (
                                  <li key={`${linea}-${index}`}>{linea}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="mb-0 text-muted">No hay líneas de investigación registradas.</p>
                            )}
                          </div>
                        </Col>
                      </Row>
                      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mt-4">
                        <Button
                          type="button"
                          variant="outline-secondary"
                          onClick={handleRestaurarParametros}
                          disabled={!parametrosIniciales || saving}
                        >
                          Restaurar valores originales
                        </Button>
                        <Button type="submit" variant="primary" disabled={saving}>
                          {saving ? (
                            <>
                              <Spinner animation="border" role="status" size="sm" className="me-2" />
                              Guardando…
                            </>
                          ) : (
                            'Guardar cambios'
                          )}
                        </Button>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={4}>
                <Card className="shadow-sm mb-4 mb-lg-3">
                  <Card.Header as="h5" className="fw-semibold">
                    Ajustes operativos
                  </Card.Header>
                  <Card.Body className="d-grid gap-3">
                    <Form.Check
                      type="switch"
                      id="maintenance-mode-switch"
                      label="Modo mantenimiento"
                      checked={Boolean(parametros.maintenanceMode)}
                      onChange={(event) => handleChange('maintenanceMode', event.target.checked)}
                    />
                    <Form.Check
                      type="switch"
                      id="notifications-switch"
                      label="Notificaciones institucionales activas"
                      checked={Boolean(parametros.notificationsEnabled)}
                      onChange={(event) => handleChange('notificationsEnabled', event.target.checked)}
                    />
                    <Form.Check
                      type="switch"
                      id="auto-archive-switch"
                      label="Archivado automático de reportes finalizados"
                      checked={Boolean(parametros.autoArchiveReports)}
                      onChange={(event) => handleChange('autoArchiveReports', event.target.checked)}
                    />
                  </Card.Body>
                </Card>

                <Card className="shadow-sm">
                  <Card.Header as="h5" className="fw-semibold">
                    Tareas de mantenimiento
                  </Card.Header>
                  <ListGroup variant="flush" className="maintenance-list">
                    {tareasMantenimiento.map((tarea) => (
                      <ListGroup.Item key={tarea.action} className="py-3">
                        <div className="d-flex flex-column gap-2">
                          <div className="d-flex align-items-center gap-2">
                            <span className="display-6 mb-0" aria-hidden="true">
                              {tarea.icono}
                            </span>
                            <div>
                              <h6 className="mb-0 fw-semibold">{tarea.titulo}</h6>
                              <p className="text-muted small mb-0">{tarea.descripcion}</p>
                            </div>
                          </div>
                          <div>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleTareaMantenimiento(tarea.action)}
                              disabled={Boolean(executingTask)}
                            >
                              {executingTask === tarea.action ? (
                                <>
                                  <Spinner animation="border" role="status" size="sm" className="me-2" />
                                  Ejecutando…
                                </>
                              ) : (
                                'Ejecutar'
                              )}
                            </Button>
                          </div>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card>
              </Col>
            </Row>

            <Card className="shadow-sm mt-4">
              <Card.Header as="h5" className="fw-semibold">Historial de cambios</Card.Header>
              <Card.Body>
                {historialFormateado.length === 0 ? (
                  <p className="text-muted mb-0">
                    No se registran modificaciones recientes en la configuración institucional.
                  </p>
                ) : (
                  <ListGroup variant="flush">
                    {historialFormateado.map((entrada) => (
                      <ListGroup.Item key={entrada.id} className="py-3">
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">
                          <div>
                            <h6 className="mb-1 fw-semibold">{entrada.action}</h6>
                            <p className="text-muted small mb-1">{entrada.details}</p>
                            <Badge bg="secondary">{entrada.performedBy}</Badge>
                          </div>
                          <div className="text-muted small text-md-end">{entrada.timestamp}</div>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </Card.Body>
            </Card>
          </>
        )}
      </Container>
    </div>
  );
};

export default ConfiguracionSistema;
