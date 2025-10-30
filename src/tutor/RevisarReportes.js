import React, { useEffect, useMemo, useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import useSessionUser from '../hooks/useSessionUser';
import './docente.css';

const estadoVariant = {
  Aprobado: 'success',
  Devuelto: 'danger',
  Pendiente: 'warning',
};

const RevisarReportes = () => {
  const user = useSessionUser();
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [formData, setFormData] = useState({ observaciones: '', estado: 'Pendiente', calificacion: '' });
  const [saving, setSaving] = useState(false);

  const pendientes = useMemo(
    () => reportes.filter((reporte) => reporte.estado === 'Pendiente').length,
    [reportes],
  );

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const loadReportes = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`/api/reportes?tutor_id=${user.id}`);
        if (!response.ok) {
          throw new Error(`Error ${response.status}`);
        }

        const payload = await response.json();
        const data = Array.isArray(payload?.data) ? payload.data : payload;
        setReportes(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'No se pudo obtener el listado de reportes.');
      } finally {
        setLoading(false);
      }
    };

    loadReportes();
  }, [user?.id]);

  const handleRevisar = (reporte) => {
    setSelectedReport(reporte);
    setFormData({
      observaciones: reporte.observaciones || '',
      estado: reporte.estado || 'Pendiente',
      calificacion: reporte.calificacion ?? '',
    });
  };

  const handleCloseModal = () => {
    if (saving) {
      return;
    }

    setSelectedReport(null);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardarRevision = async () => {
    if (!selectedReport) {
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/reportes/${selectedReport.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          estado: formData.estado,
          observaciones: formData.observaciones,
          calificacion: formData.calificacion ? Number(formData.calificacion) : null,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = payload?.message
          || (payload?.errors && Object.values(payload.errors).flat().join(' '))
          || 'No se pudo guardar la revisión.';
        throw new Error(message);
      }

      setReportes((prev) => prev.map((reporte) => (reporte.id === payload.id ? payload : reporte)));
      setSelectedReport(null);
    } catch (err) {
      alert(err.message || 'No se pudo guardar la revisión.');
    } finally {
      setSaving(false);
    }
  };

  const handleDescargarArchivo = (reporte) => {
    if (!reporte?.archivoUrl) {
      return;
    }

    window.open(reporte.archivoUrl, '_blank', 'noopener');
  };

  return (
    <div className="revisar-reportes-wrapper">
      <header className="revisar-reportes-header text-center py-4 border-bottom">
        <Container>
          <h1 className="h2 fw-bold">Revisión de Reportes de Avance</h1>
          <p className="text-muted">
            Gestiona los reportes pendientes de tus becarios, registra observaciones y calificaciones.
          </p>
        </Container>
      </header>

      <Container className="py-4">
        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        <Row className="mb-4 g-3">
          <Col md={4}>
            <Card className="text-center metric-card h-100">
              <Card.Body>
                <h6 className="text-muted mb-1">Reportes pendientes</h6>
                <h3 className="text-warning mb-0">{pendientes}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center metric-card h-100">
              <Card.Body>
                <h6 className="text-muted mb-1">Total recibidos</h6>
                <h3 className="text-primary mb-0">{reportes.length}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center metric-card h-100">
              <Card.Body>
                <h6 className="text-muted mb-1">Última actualización</h6>
                <h5 className="text-muted mb-0">
                  {reportes[0]?.fechaRevision
                    ? new Date(reportes[0].fechaRevision).toLocaleDateString('es-BO')
                    : 'Sin revisiones'}
                </h5>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Card>
          <Card.Body>
            {loading ? (
              <div className="d-flex align-items-center justify-content-center py-4">
                <Spinner animation="border" role="status" className="me-2" />
                <span>Cargando reportes…</span>
              </div>
            ) : reportes.length === 0 ? (
              <p className="mb-0">Aún no se registraron reportes para revisión.</p>
            ) : (
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Código del proyecto</th>
                    <th>Becario</th>
                    <th>Fecha de envío</th>
                    <th>Estado actual</th>
                    <th>Archivo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {reportes.map((reporte) => (
                    <tr key={reporte.id}>
                      <td>{reporte.beca?.codigo ?? '—'}</td>
                      <td>{reporte.becario?.nombre ?? '—'}</td>
                      <td>{reporte.fechaEnvio ? new Date(reporte.fechaEnvio).toLocaleDateString('es-BO') : '—'}</td>
                      <td>
                        <Badge bg={estadoVariant[reporte.estado] ?? 'secondary'}>{reporte.estado}</Badge>
                      </td>
                      <td>
                        <Button variant="link" size="sm" onClick={() => handleDescargarArchivo(reporte)}>
                          📎 {reporte.archivoNombre}
                        </Button>
                      </td>
                      <td>
                        <Button variant="primary" size="sm" onClick={() => handleRevisar(reporte)}>
                          Revisar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      </Container>

      <Modal show={!!selectedReport} onHide={handleCloseModal} size="lg" centered>
        {selectedReport && (
          <>
            <Modal.Header closeButton={!saving}>
              <Modal.Title>Revisar Reporte – {selectedReport.beca?.codigo ?? 'Sin código'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p className="text-muted mb-4">
                Archivo enviado el{' '}
                {selectedReport.fechaEnvio
                  ? new Date(selectedReport.fechaEnvio).toLocaleString('es-BO')
                  : 'sin fecha registrada'}
              </p>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label><strong>Becario</strong></Form.Label>
                  <p>{selectedReport.becario?.nombre ?? '—'}</p>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label><strong>Descripción del reporte</strong></Form.Label>
                  <p className="text-break">{selectedReport.descripcion || 'Sin descripción'}</p>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label><strong>Archivo adjunto</strong></Form.Label>
                  <p>
                    <Button variant="link" size="sm" onClick={() => handleDescargarArchivo(selectedReport)}>
                      📎 {selectedReport.archivoNombre}
                    </Button>
                  </p>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label><strong>Observaciones para el becario</strong></Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="observaciones"
                    value={formData.observaciones}
                    onChange={handleFormChange}
                    placeholder="Escriba comentarios, sugerencias o correcciones requeridas."
                    disabled={saving}
                  />
                </Form.Group>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label><strong>Estado</strong></Form.Label>
                      <Form.Select
                        name="estado"
                        value={formData.estado}
                        onChange={handleFormChange}
                        disabled={saving}
                      >
                        <option value="Pendiente">🕓 Pendiente</option>
                        <option value="Aprobado">✅ Aprobado</option>
                        <option value="Devuelto">⚠️ Devuelto</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label><strong>Calificación (0 – 100)</strong></Form.Label>
                      <Form.Control
                        type="number"
                        name="calificacion"
                        min="0"
                        max="100"
                        value={formData.calificacion}
                        onChange={handleFormChange}
                        placeholder="Opcional"
                        disabled={saving}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal} disabled={saving}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={handleGuardarRevision} disabled={saving}>
                {saving ? 'Guardando…' : 'Guardar revisión'}
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>

      <footer className="revisar-reportes-footer text-center py-3 mt-4 border-top">
        <p className="mb-0">
          Dirección de Ciencia e Innovación Tecnología – Universidad Autónoma Tomás Frías
        </p>
        <small className="text-muted">
          Versión 1.0.3 – {new Date().toLocaleDateString('es-BO', { year: 'numeric', month: 'long', day: 'numeric' })}
        </small>
      </footer>
    </div>
  );
};

export default RevisarReportes;
