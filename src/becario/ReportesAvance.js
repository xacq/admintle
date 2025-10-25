// src/components/ReportesAvance.js

// src/components/ReportesAvance.js

import React, { useState } from 'react';
import { Container, Card, Row, Col, ProgressBar, Form, Button, Table, Badge, Alert } from 'react-bootstrap';
import './estudiante.css';

const ReportesAvance = () => {
  // --- DATOS ESTÁTICOS DE EJEMPLO ---
  const infoBeca = {
    tituloProyecto: 'Energías Limpias y Desarrollo Sostenible',
    tutor: 'Lic. Mayra Chumacero',
    periodo: 'Marzo – Septiembre 2025',
    estado: 'Activa',
    progreso: 60, // Porcentaje de progreso
  };

  // Historial de reportes enviados
  const historialReportes = [
    {
      id: 1,
      titulo: 'Primer avance',
      fechaEnvio: '15/04/2025',
      estado: 'En revisión',
      observaciones: '—',
    },
    {
      id: 2,
      titulo: 'Segundo avance',
      fechaEnvio: '15/05/2025',
      estado: 'Aprobado',
      observaciones: 'Buen progreso',
    },
    {
      id: 3,
      titulo: 'Tercer avance',
      fechaEnvio: '15/06/2025',
      estado: 'Devuelto',
      observaciones: 'Faltan anexos',
    }
  ];

  // Retroalimentación del tutor
  const retroalimentacionTutor = [
    {
      id: 2,
      titulo: 'Reporte #2 — Aprobado',
      texto: 'El análisis de datos está completo. Continúa con la redacción final.',
      fechaRevision: '18/05/2025',
    }
  ];

  // Estado para el formulario de nuevo reporte
  const [nuevoReporte, setNuevoReporte] = useState({
    titulo: '',
    descripcion: '',
    fechaEntrega: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
    archivo: null
  });

  // Estado para mostrar alerta de archivo
  const [mostrarAlerta, setMostrarAlerta] = useState(false);

  // Función para manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoReporte({
      ...nuevoReporte,
      [name]: value
    });
  };

  // Función para manejar el cambio de archivo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Verificar tamaño del archivo (10 MB = 10 * 1024 * 1024 bytes)
      if (file.size > 10 * 1024 * 1024) {
        setMostrarAlerta(true);
        setTimeout(() => setMostrarAlerta(false), 5000);
        return;
      }
      
      // Verificar tipo de archivo
      if (!file.name.match(/\.(pdf|docx)$/)) {
        setMostrarAlerta(true);
        setTimeout(() => setMostrarAlerta(false), 5000);
        return;
      }
      
      setNuevoReporte({
        ...nuevoReporte,
        archivo: file
      });
    }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Reporte enviado con éxito (simulación)');
    console.log('Datos del reporte:', nuevoReporte);
    // Reiniciar formulario
    setNuevoReporte({
      titulo: '',
      descripcion: '',
      fechaEntrega: new Date().toISOString().split('T')[0],
      archivo: null
    });
  };

  // Función para descargar reporte
  const handleDescargarReporte = (id) => {
    alert(`Descargando reporte ID: ${id} (simulación)`);
  };

  // Función para obtener el color del estado
  const getEstadoVariant = (estado) => {
    switch (estado) {
      case 'Aprobado':
        return 'success';
      case 'En revisión':
        return 'warning';
      case 'Devuelto':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  // Calcular indicadores
  const totalReportes = historialReportes.length;
  const reportesAprobados = historialReportes.filter(r => r.estado === 'Aprobado').length;
  const reportesEnRevision = historialReportes.filter(r => r.estado === 'En revisión').length;
  const reportesDevueltos = historialReportes.filter(r => r.estado === 'Devuelto').length;

  return (
    <div className="reportes-avance-wrapper">
      {/* Sección 1: Información de la beca */}
      <Card className="mb-4">
        <Card.Header as="h5" className="fw-bold">
          Información de la Beca
        </Card.Header>
        <Card.Body>
          <Row className="g-3">
            <Col sm={6} md={3} className="fw-bold text-secondary">
              Título del proyecto
            </Col>
            <Col sm={6} md={9}>
              Beca Auxiliar de Investigación: "{infoBeca.tituloProyecto}"
            </Col>

            <Col sm={6} md={3} className="fw-bold text-secondary">
              Tutor / Evaluador
            </Col>
            <Col sm={6} md={9}>
              {infoBeca.tutor}
            </Col>

            <Col sm={6} md={3} className="fw-bold text-secondary">
              Periodo de la beca
            </Col>
            <Col sm={6} md={9}>
              {infoBeca.periodo}
            </Col>

            <Col sm={6} md={3} className="fw-bold text-secondary">
              Estado actual
            </Col>
            <Col sm={6} md={9}>
              <span className="status-indicator status-active"></span>
              {infoBeca.estado}
            </Col>

            <Col sm={6} md={3} className="fw-bold text-secondary">
              Progreso
            </Col>
            <Col sm={6} md={9}>
              <div className="d-flex align-items-center">
                <ProgressBar now={infoBeca.progreso} className="flex-grow-1 me-2" />
                <span>{infoBeca.progreso}%</span>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Row>
        <Col lg={8}>
          {/* Sección 2: Envío de nuevo reporte */}
          <Card className="mb-4">
            <Card.Header as="h5" className="fw-bold">
              📝 Registrar nuevo reporte de avance
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Título del reporte</Form.Label>
                  <Form.Control
                    type="text"
                    name="titulo"
                    value={nuevoReporte.titulo}
                    onChange={handleChange}
                    placeholder="Ej: Avance de investigación - Mes de junio"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Descripción del trabajo realizado</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="descripcion"
                    value={nuevoReporte.descripcion}
                    onChange={handleChange}
                    placeholder="Describa detalladamente las actividades realizadas en este periodo..."
                    required
                  />
                </Form.Group>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Fecha de entrega</Form.Label>
                      <Form.Control
                        type="date"
                        name="fechaEntrega"
                        value={nuevoReporte.fechaEntrega}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Adjuntar archivo</Form.Label>
                      <Form.Control
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.docx"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {mostrarAlerta && (
                  <Alert variant="danger" className="mb-3">
                    El archivo no debe superar los 10 MB. Solo se permiten formatos PDF o DOCX.
                  </Alert>
                )}

                <div className="d-flex justify-content-between">
                  <small className="text-muted">
                    El archivo no debe superar los 10 MB. Solo se permiten formatos PDF o DOCX.
                  </small>
                  <Button variant="primary" type="submit">
                    Enviar reporte
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          {/* Sección 3: Historial de reportes enviados */}
          <Card className="mb-4">
            <Card.Header as="h5" className="fw-bold">
              📂 Mis reportes anteriores
            </Card.Header>
            <Card.Body>
              <Table responsive striped hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Título del reporte</th>
                    <th>Fecha de envío</th>
                    <th>Estado</th>
                    <th>Observaciones</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {historialReportes.map((reporte) => (
                    <tr key={reporte.id}>
                      <td>{reporte.id}</td>
                      <td>{reporte.titulo}</td>
                      <td>{reporte.fechaEnvio}</td>
                      <td>
                        <Badge bg={getEstadoVariant(reporte.estado)}>
                          {reporte.estado}
                        </Badge>
                      </td>
                      <td>{reporte.observaciones}</td>
                      <td>
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => handleDescargarReporte(reporte.id)}
                        >
                          📎
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          {/* Sección 4: Retroalimentación del tutor */}
          <Card className="mb-4">
            <Card.Header as="h5" className="fw-bold">
              💬 Observaciones y calificaciones recibidas
            </Card.Header>
            <Card.Body>
              {retroalimentacionTutor.length > 0 ? (
                retroalimentacionTutor.map((retro) => (
                  <div key={retro.id} className="mb-3 p-3 border rounded">
                    <h6 className="fw-bold">{retro.titulo}</h6>
                    <p className="mb-1">{retro.texto}</p>
                    <small className="text-muted">Fecha de revisión: {retro.fechaRevision}</small>
                  </div>
                ))
              ) : (
                <p className="text-muted">Aún no existen observaciones registradas.</p>
              )}
            </Card.Body>
          </Card>

          {/* Sección 5: Indicadores generales del seguimiento */}
          <Card className="mb-4">
            <Card.Header as="h5" className="fw-bold">
              📈 Indicadores generales del seguimiento
            </Card.Header>
            <Card.Body>
              <Row className="text-center mb-3">
                <Col xs={6} className="mb-3">
                  <h4 className="text-primary">{totalReportes}</h4>
                  <p className="small mb-0">Total de reportes enviados</p>
                </Col>
                <Col xs={6} className="mb-3">
                  <h4 className="text-success">{reportesAprobados}</h4>
                  <p className="small mb-0">Reportes aprobados</p>
                </Col>
                <Col xs={6} className="mb-3">
                  <h4 className="text-warning">{reportesEnRevision}</h4>
                  <p className="small mb-0">En revisión</p>
                </Col>
                <Col xs={6} className="mb-3">
                  <h4 className="text-danger">{reportesDevueltos}</h4>
                  <p className="small mb-0">Devueltos</p>
                </Col>
              </Row>
              
              <div className="mb-2">
                <div className="d-flex justify-content-between">
                  <span>Cumplimiento del cronograma</span>
                  <span>{infoBeca.progreso}%</span>
                </div>
                <ProgressBar now={infoBeca.progreso} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Pie de página */}
      <footer className="text-center py-3 mt-5 border-top">
        <p className="mb-1">Dirección de Ciencia e Innovación Tecnológica – Universidad Autónoma Tomás Frías</p>
        <p className="mb-0 small text-muted">v1.0.3 – 2025 | <a href="#help" className="text-decoration-none">Manual de usuario</a></p>
      </footer>
    </div>
  );
};

export default ReportesAvance;