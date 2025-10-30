// src/components/EvaluacionFinal.js

import React, { useState, useMemo } from 'react';
import { Container, Card, Table, Badge, Button, Modal, Form } from 'react-bootstrap';
import './docente.css';

// --- DATOS ESTÁTICOS DE EJEMPLO ---
const becariosData = [
  {
    id: 1,
    codigo: 'PI-UATF-041',
    nombre: 'Ana Guzmán',
    proyecto: 'Análisis de Algoritmos de Optimización',
    promedioReportes: 8.7,
    calificacionFinal: null,
    estadoFinal: 'Pendiente',
    observacionesFinales: '',
    fechaInicio: '2024-03-15',
    fechaFin: '2024-11-30'
  },
  {
    id: 2,
    codigo: 'PI-UATF-042',
    nombre: 'Luis Mamani',
    proyecto: 'Sistema de Monitoreo Hídrico',
    promedioReportes: 9.1,
    calificacionFinal: 9.5,
    estadoFinal: 'Aprobado',
    observacionesFinales: 'Excelente trabajo, con aplicaciones prácticas y resultados medibles.',
    fechaInicio: '2024-04-10',
    fechaFin: '2024-12-15'
  },
  {
    id: 3,
    codigo: 'PI-UATF-043',
    nombre: 'José Flores',
    proyecto: 'Impacto de Minería Artesanal',
    promedioReportes: 6.5,
    calificacionFinal: 6.0,
    estadoFinal: 'Reprobado',
    observacionesFinales: 'El proyecto no cumplió con los objetivos mínimos propuestos.',
    fechaInicio: '2024-02-20',
    fechaFin: '2024-10-30'
  }
];

const EvaluacionFinal = () => {
  // --- ESTADO DEL COMPONENTE ---
  const [becarios, setBecarios] = useState(becariosData);
  const [showModal, setShowModal] = useState(false);
  const [selectedBecario, setSelectedBecario] = useState(null);
  const [formData, setFormData] = useState({
    observacionesFinales: '',
    calificacionFinal: '',
    estadoFinal: 'Pendiente'
  });

  // --- LÓGICA PARA EL PANEL RESUMEN ---
  const resumen = useMemo(() => {
    const evaluados = becarios.filter(b => b.calificacionFinal !== null);
    const totalEvaluados = evaluados.length;
    const promedioGeneral = totalEvaluados > 0
      ? (evaluados.reduce((sum, b) => sum + b.calificacionFinal, 0) / totalEvaluados).toFixed(2)
      : '—';
    const ultimaFecha = evaluados.length > 0 ? '2024-09-28' : '—'; // Simulado

    return { totalEvaluados, promedioGeneral, ultimaFecha };
  }, [becarios]);

  // --- MANEJADORES DE EVENTOS ---
  const handleEvaluar = (becario) => {
    setSelectedBecario(becario);
    setFormData({
      observacionesFinales: becario.observacionesFinales || '',
      calificacionFinal: becario.calificacionFinal || '',
      estadoFinal: becario.estadoFinal || 'Pendiente'
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBecario(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleGuardarEvaluacion = () => {
    if (!selectedBecario) return;

    const becariosActualizados = becarios.map(becario =>
      becario.id === selectedBecario.id
        ? { ...becario, ...formData }
        : becario
    );

    setBecarios(becariosActualizados);
    alert('Evaluación guardada correctamente.');
    handleCloseModal();
  };

  const getEstadoBadgeVariant = (estado) => {
    switch (estado) {
      case 'Aprobado':
        return 'success';
      case 'Reprobado':
        return 'danger';
      case 'Concluido':
        return 'info';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="evaluacion-final-wrapper">
      {/* Encabezado institucional */}
      <header className="evaluacion-final-header text-center py-4 border-bottom">
        <Container>
          <Row className="align-items-center">
            <Col md={3} className="text-start">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Coat_of_arms_of_Bolivia.svg/120px-Coat_of_arms_of_Bolivia.svg.png"
                width="60"
                height="60"
                className="d-inline-block align-top"
                alt="Logo UATF"
              />
            </Col>
            <Col md={6}>
              <h1 className="h3 mb-0 fw-bold">Consolidación de Evaluaciones Finales</h1>
              <p className="text-muted small mb-0">Registro y emisión de resultados finales de desempeño de los becarios auxiliares de investigación.</p>
            </Col>
            <Col md={3} className="text-end">
              <span className="text-muted">Bienvenido,</span><br/>
              <strong>Lic. Anny Mercado Algarañaz</strong>
            </Col>
          </Row>
        </Container>
      </header>

      <Container className="py-4">
        <Row>
          {/* 1️⃣ Panel de becarios asignados (tabla principal) */}
          <Col lg={8}>
            <Card>
              <Card.Header as="h5" className="fw-bold">Becarios Asignados</Card.Header>
              <Card.Body>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Código de Beca</th>
                      <th>Nombre del Becario</th>
                      <th>Proyecto</th>
                      <th>Calificación Promedio</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {becarios.map((becario) => (
                      <tr key={becario.id}>
                        <td>{becario.codigo}</td>
                        <td>{becario.nombre}</td>
                        <td>{becario.proyecto}</td>
                        <td>{becario.promedioReportes}</td>
                        <td>
                          {becario.calificacionFinal !== null ? (
                            <>
                              <span>{becario.calificacionFinal} / 10</span>
                              <br />
                              <Badge bg={getEstadoBadgeVariant(becario.estadoFinal)}>
                                {becario.estadoFinal}
                              </Badge>
                            </>
                          ) : (
                            <Badge bg="secondary">Pendiente</Badge>
                          )}
                        </td>
                        <td>
                          <Button variant="primary" size="sm" onClick={() => handleEvaluar(becario)}>
                            {becario.calificacionFinal !== null ? 'Editar' : 'Evaluar'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          {/* 3️⃣ Panel resumen (opcional y muy simple) */}
          <Col lg={4}>
            <Card className="h-100">
              <Card.Header as="h5" className="fw-bold">Panel Resumen</Card.Header>
              <Card.Body>
                <p><strong>Total de becarios evaluados:</strong> {resumen.totalEvaluados}</p>
                <p><strong>Promedio general de calificaciones:</strong> {resumen.promedioGeneral}</p>
                <p><strong>Última fecha de registro:</strong> {resumen.ultimaFecha}</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* 2️⃣ Sección de Evaluación (Modal) */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        {selectedBecario && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Evaluación Final - {selectedBecario.nombre}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <h6 className="fw-bold">Datos del Becario</h6>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control plaintext readOnly defaultValue={selectedBecario.nombre} />
                  </Col>
                  <Col md={6}>
                    <Form.Label>Código de Beca</Form.Label>
                    <Form.Control plaintext readOnly defaultValue={selectedBecario.codigo} />
                  </Col>
                  <Col md={12}>
                    <Form.Label>Título del Proyecto</Form.Label>
                    <Form.Control plaintext readOnly defaultValue={selectedBecario.proyecto} />
                  </Col>
                  <Col md={6}>
                    <Form.Label>Fecha de Inicio</Form.Label>
                    <Form.Control plaintext readOnly defaultValue={selectedBecario.fechaInicio} />
                  </Col>
                  <Col md={6}>
                    <Form.Label>Fecha de Fin</Form.Label>
                    <Form.Control plaintext readOnly defaultValue={selectedBecario.fechaFin} />
                  </Col>
                </Row>
                <hr />
                <Row className="mb-3">
                  <Col md={12}>
                    <Form.Label>Promedio de Reportes</Form.Label>
                    <Form.Control plaintext readOnly defaultValue={selectedBecario.promedioReportes} />
                  </Col>
                </Row>
                <hr />
                <Form.Group className="mb-3">
                  <Form.Label>Observaciones Finales</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="observacionesFinales"
                    value={formData.observacionesFinales}
                    onChange={handleFormChange}
                    placeholder="Ingrese sus comentarios finales sobre el desempeño del becario..."
                  />
                </Form.Group>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Label>Calificación Final (0-10)</Form.Label>
                    <Form.Control
                      type="number"
                      name="calificacionFinal"
                      value={formData.calificacionFinal}
                      onChange={handleFormChange}
                      min="0"
                      max="10"
                      step="0.1"
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label>Estado Final</Form.Label>
                    <Form.Select
                      name="estadoFinal"
                      value={formData.estadoFinal}
                      onChange={handleFormChange}
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="Aprobado">Aprobado</option>
                      <option value="Reprobado">Reprobado</option>
                      <option value="Concluido">Concluido</option>
                    </Form.Select>
                  </Col>
                </Row>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                ❌ Cancelar
              </Button>
              <Button variant="primary" onClick={handleGuardarEvaluacion}>
                ✅ Guardar Evaluación
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>

      {/* 4️⃣ Pie institucional */}
      <footer className="evaluacion-final-footer text-center py-3 mt-4 border-top">
        <p className="mb-0">
          Dirección de Ciencia e Innovación Tecnología – Universidad Autónoma Tomás Frías
        </p>
        <small className="text-muted">
          {new Date().toLocaleDateString('es-BO', { year: 'numeric', month: 'long', day: 'numeric' })}
        </small>
      </footer>
    </div>
  );
};

export default EvaluacionFinal;