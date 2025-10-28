// src/components/EvaluacionDesempeno.js

import React, { useState } from 'react';
import { Container, Card, Row, Col, Badge, Form, Button, Table, Alert } from 'react-bootstrap';
import './evaluador.css';

const EvaluacionDesempeno = () => {
  // --- DATOS ESTÁTICOS DE EJEMPLO ---
  const datosEvaluacion = {
    nombreEvaluador: 'Lic. Anny Mercado Algarañaz',
    nombreBecario: 'Juan Pérez Mamani',
    tituloProyecto: 'Análisis de Algoritmos de Optimización para Big Data',
    periodoBeca: 'Marzo 2024 - Febrero 2025',
    estado: 'En curso',
    tutorAsignado: 'Dr. Luis Rojas Fernández'
  };

  

  // Historial de evaluaciones previas
  const historialEvaluaciones = [
    {
      id: 1,
      fecha: '12/09/2024',
      evaluador: 'Dr. Luis Rojas Fernández',
      calificacion: 8.5,
      observaciones: 'Buen progreso en la fase inicial del proyecto.'
    },
    {
      id: 2,
      fecha: '12/10/2024',
      evaluador: 'Lic. Anny Mercado Algarañaz',
      calificacion: 9.0,
      observaciones: 'Avances significativos en la implementación de algoritmos.'
    }
  ];

  // Estado para el formulario de evaluación
  const [evaluacion, setEvaluacion] = useState({
    cumplimientoObjetivos: 7,
    calidadTrabajo: 8,
    responsabilidadPuntualidad: 9,
    capacidadAnalisis: 7,
    originalidadAportes: 8,
    observacionesGenerales: '',
    recomendaciones: ''
  });

  // Estado para mostrar resultados finales
  const [mostrarResultados, setMostrarResultados] = useState(false);

  // Función para manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvaluacion({
      ...evaluacion,
      [name]: value
    });
  };

  // Función para calcular el promedio
  const calcularPromedio = () => {
    const { cumplimientoObjetivos, calidadTrabajo, responsabilidadPuntualidad, capacidadAnalisis, originalidadAportes } = evaluacion;
    const sum = parseInt(cumplimientoObjetivos) + parseInt(calidadTrabajo) + parseInt(responsabilidadPuntualidad) + parseInt(capacidadAnalisis) + parseInt(originalidadAportes);
    return (sum / 5).toFixed(1);
  };

  // Función para determinar el estado final según el promedio
  const determinarEstadoFinal = (promedio) => {
    if (promedio >= 9) return { texto: 'Aprobado', variante: 'success' };
    if (promedio >= 7) return { texto: 'En revisión', variante: 'warning' };
    return { texto: 'No aprobado', variante: 'danger' };
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    setMostrarResultados(true);
  };

  // Función para manejar el botón de cancelar
  const handleCancel = () => {
    alert('Redirigiendo al listado de becarios (simulación)');
  };

  // Función para generar reporte PDF
  const handleGenerarPDF = () => {
    alert('Generando reporte PDF (simulación)');
  };

  // Función para descargar reporte anterior
  const handleDescargarReporte = (id) => {
    alert(`Descargando reporte de evaluación ID: ${id} (simulación)`);
  };

  // Función para asignar un color de badge según el estado
  const getEstadoBadge = (estado) => {
    switch (estado) {
      case 'En curso':
        return 'primary';
      case 'Finalizado':
        return 'success';
      case 'Pendiente':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  // Calcular promedio y estado final
  const promedio = calcularPromedio();
  const estadoFinal = determinarEstadoFinal(promedio);

  return (
    <Container className="evaluacion-desempeno-container">
      {/* 1. Encabezado o título principal */}
      <div className="text-center mb-4">
        <h1 className="h2 fw-bold">Evaluación del Desempeño del Becario Auxiliar de Investigación</h1>
        <p className="lead text-muted">Registro de criterios cualitativos y cuantitativos de evaluación</p>
        <p className="mb-0">
          <strong>Evaluador:</strong> {datosEvaluacion.nombreEvaluador}
        </p>
      </div>

      {/* 2. Bloque de información del becario */}
      <Card className="mb-4">
        <Card.Header as="h5" className="fw-bold">
          Información del Becario y Proyecto
        </Card.Header>
        <Card.Body>
          <Row className="g-3">
            <Col md={6} lg={4} className="fw-bold text-secondary">
              Nombre del becario
            </Col>
            <Col md={6} lg={8}>
              {datosEvaluacion.nombreBecario}
            </Col>

            <Col md={6} lg={4} className="fw-bold text-secondary">
              Título del proyecto
            </Col>
            <Col md={6} lg={8}>
              {datosEvaluacion.tituloProyecto}
            </Col>

            <Col md={6} lg={4} className="fw-bold text-secondary">
              Periodo de la beca
            </Col>
            <Col md={6} lg={8}>
              {datosEvaluacion.periodoBeca}
            </Col>

            <Col md={6} lg={4} className="fw-bold text-secondary">
              Estado actual
            </Col>
            <Col md={6} lg={8}>
              <Badge bg={getEstadoBadge(datosEvaluacion.estado)}>
                {datosEvaluacion.estado}
              </Badge>
            </Col>

            <Col md={6} lg={4} className="fw-bold text-secondary">
              Tutor asignado
            </Col>
            <Col md={6} lg={8}>
              {datosEvaluacion.tutorAsignado}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* 3. Formulario de evaluación */}
      <Card className="mb-4">
        <Card.Header as="h5" className="fw-bold">
          Formulario de Evaluación
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {/* Sección A: Evaluación Cuantitativa */}
            <h6 className="fw-bold mt-3 mb-3">Sección A: Evaluación Cuantitativa</h6>
            <p className="text-muted small">Evalúe cada criterio en una escala del 1 al 10, donde 10 es la máxima calificación.</p>
            
            <Row className="mb-4">
              <Col md={6} className="mb-3">
                <Form.Label>Cumplimiento de objetivos</Form.Label>
                <Form.Control 
                  type="range" 
                  min="1" 
                  max="10" 
                  name="cumplimientoObjetivos"
                  value={evaluacion.cumplimientoObjetivos}
                  onChange={handleChange}
                />
                <div className="d-flex justify-content-between">
                  <span>1</span>
                  <span className="fw-bold">{evaluacion.cumplimientoObjetivos}</span>
                  <span>10</span>
                </div>
              </Col>
              
              <Col md={6} className="mb-3">
                <Form.Label>Calidad del trabajo presentado</Form.Label>
                <Form.Control 
                  type="range" 
                  min="1" 
                  max="10" 
                  name="calidadTrabajo"
                  value={evaluacion.calidadTrabajo}
                  onChange={handleChange}
                />
                <div className="d-flex justify-content-between">
                  <span>1</span>
                  <span className="fw-bold">{evaluacion.calidadTrabajo}</span>
                  <span>10</span>
                </div>
              </Col>
              
              <Col md={6} className="mb-3">
                <Form.Label>Responsabilidad y puntualidad</Form.Label>
                <Form.Control 
                  type="range" 
                  min="1" 
                  max="10" 
                  name="responsabilidadPuntualidad"
                  value={evaluacion.responsabilidadPuntualidad}
                  onChange={handleChange}
                />
                <div className="d-flex justify-content-between">
                  <span>1</span>
                  <span className="fw-bold">{evaluacion.responsabilidadPuntualidad}</span>
                  <span>10</span>
                </div>
              </Col>
              
              <Col md={6} className="mb-3">
                <Form.Label>Capacidad de análisis e investigación</Form.Label>
                <Form.Control 
                  type="range" 
                  min="1" 
                  max="10" 
                  name="capacidadAnalisis"
                  value={evaluacion.capacidadAnalisis}
                  onChange={handleChange}
                />
                <div className="d-flex justify-content-between">
                  <span>1</span>
                  <span className="fw-bold">{evaluacion.capacidadAnalisis}</span>
                  <span>10</span>
                </div>
              </Col>
              
              <Col md={12} className="mb-3">
                <Form.Label>Originalidad y aportes del proyecto</Form.Label>
                <Form.Control 
                  type="range" 
                  min="1" 
                  max="10" 
                  name="originalidadAportes"
                  value={evaluacion.originalidadAportes}
                  onChange={handleChange}
                />
                <div className="d-flex justify-content-between">
                  <span>1</span>
                  <span className="fw-bold">{evaluacion.originalidadAportes}</span>
                  <span>10</span>
                </div>
              </Col>
            </Row>

            {/* Sección B: Evaluación Cualitativa */}
            <h6 className="fw-bold mt-3 mb-3">Sección B: Evaluación Cualitativa</h6>
            
            <Form.Group className="mb-3">
              <Form.Label>Observaciones generales</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                name="observacionesGenerales"
                value={evaluacion.observacionesGenerales}
                onChange={handleChange}
                placeholder="Ingrese sus observaciones sobre el desempeño general del becario..."
              />
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label>Recomendaciones o sugerencias finales</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                name="recomendaciones"
                value={evaluacion.recomendaciones}
                onChange={handleChange}
                placeholder="Ingrese recomendaciones para mejorar el trabajo del becario..."
              />
            </Form.Group>

            {/* Botones de acción */}
            <div className="d-flex justify-content-between">
              <Button variant="secondary" onClick={handleCancel}>
                Cancelar / Volver al listado
              </Button>
              <Button variant="primary" type="submit">
                Guardar Evaluación
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* 4. Historial de evaluaciones */}
      <Card className="mb-4">
        <Card.Header as="h5" className="fw-bold">
          Historial de Evaluaciones
        </Card.Header>
        <Card.Body>
          <Table responsive striped hover>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Evaluador</th>
                <th>Calificación</th>
                <th>Observaciones</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {historialEvaluaciones.map((evaluacion) => (
                <tr key={evaluacion.id}>
                  <td>{evaluacion.fecha}</td>
                  <td>{evaluacion.evaluador}</td>
                  <td>{evaluacion.calificacion}</td>
                  <td>{evaluacion.observaciones}</td>
                  <td>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => handleDescargarReporte(evaluacion.id)}
                    >
                      📄 Descargar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* 5. Bloque de resultados finales */}
      {mostrarResultados && (
        <Card className="mb-4 border-success">
          <Card.Header as="h5" className="fw-bold bg-success text-white">
            Resultados Finales de Evaluación
          </Card.Header>
          <Card.Body>
            <Alert variant="info">
              <Row className="align-items-center">
                <Col md={4}>
                  <h5>Promedio general:</h5>
                  <h2 className="text-primary">{promedio} / 10</h2>
                </Col>
                <Col md={4}>
                  <h5>Estado final:</h5>
                  <Badge bg={estadoFinal.variante} className="p-2 fs-6">
                    {estadoFinal.texto}
                  </Badge>
                </Col>
                <Col md={4} className="text-md-end mt-3 mt-md-0">
                  <Button variant="success" onClick={handleGenerarPDF}>
                    Generar reporte PDF
                  </Button>
                </Col>
              </Row>
            </Alert>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default EvaluacionDesempeno;