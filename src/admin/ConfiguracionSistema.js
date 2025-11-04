import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, ListGroup, Row, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './admin.css';

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
  managementStartDate: '',
  managementEndDate: '',
  reportDeadline: '',
  maxReportsPerScholar: '',
  systemStatus: 'activo',
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [statusMessage, setStatusMessage] = useState(null);
  const [executingTask, setExecutingTask] = useState('');
  const [lastSync, setLastSync] = useState(null);

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
      const parsed = {
        managementStartDate: data.managementStartDate ?? data.management_start_date ?? '',
        managementEndDate: data.managementEndDate ?? data.management_end_date ?? '',
        reportDeadline: data.reportDeadline ?? data.report_deadline ?? '',
        maxReportsPerScholar:
          data.maxReportsPerScholar ??
          data.max_reports_per_scholar ??
          initialParameters.maxReportsPerScholar,
        systemStatus: data.systemStatus ?? data.system_status ?? initialParameters.systemStatus,
      };

      setParametros(parsed);
      setParametrosIniciales(parsed);
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
      management_start_date: parametros.managementStartDate || null,
      management_end_date: parametros.managementEndDate || null,
      report_deadline: parametros.reportDeadline || null,
      max_reports_per_scholar: Number.isNaN(maxReports) ? 0 : maxReports,
      system_status: parametros.systemStatus,
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
      const parsed = {
        managementStartDate: updated.managementStartDate ?? payload.management_start_date ?? '',
        managementEndDate: updated.managementEndDate ?? payload.management_end_date ?? '',
        reportDeadline: updated.reportDeadline ?? payload.report_deadline ?? '',
        maxReportsPerScholar:
          updated.maxReportsPerScholar ?? payload.max_reports_per_scholar ?? initialParameters.maxReportsPerScholar,
        systemStatus: updated.systemStatus ?? payload.system_status,
      };

      setParametros(parsed);
      setParametrosIniciales(parsed);
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

        <div className="mb-4">
          <h1 className="h3 fw-bold mb-1">⚙️ Configuración del Sistema</h1>
          <p className="text-muted mb-0">
            Actualice las fechas de gestión, el estado general y los límites de reportes para mantener el
            funcionamiento institucional.
          </p>
          <div className="text-muted small mt-2">
            Última sincronización:{' '}
            <strong>{lastSync ? formatDateTime(lastSync) : 'Sin información'}</strong>
          </div>
        </div>

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

          </>
        )}
      </Container>
    </div>
  );
};

export default ConfiguracionSistema;
