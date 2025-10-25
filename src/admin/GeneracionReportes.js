// src/components/GeneracionReportes.js

import React, { useState } from 'react';
import { Container, Card, Row, Col, Form, Button, Table, Badge } from 'react-bootstrap';
import './admin.css';

const GeneracionReportes = () => {
  // --- DATOS ESTÁTICOS DE EJEMPLO ---
  const historialReportes = [
    {
      id: 1,
      fecha: '10/09/2025',
      tipo: 'Individual',
      generadoPor: 'Admin',
      periodo: '01/03–30/06/2025',
    },
    {
      id: 2,
      fecha: '05/09/2025',
      tipo: 'Consolidado',
      generadoPor: 'Director',
      periodo: '2025-1',
    },
    {
      id: 3,
      fecha: '28/08/2025',
      tipo: 'Mensual',
      generadoPor: 'Admin',
      periodo: 'Agosto 2025',
    }
  ];

  // Estado para los filtros del reporte
  const [filtros, setFiltros] = useState({
    tipoReporte: 'individual',
    fechaDesde: '',
    fechaHasta: '',
    becario: '',
  });

  // Estado para controlar si se muestra la vista previa del reporte
  const [mostrarVistaPrevia, setMostrarVistaPrevia] = useState(false);

  // Estado para el reporte generado
  const [reporteGenerado, setReporteGenerado] = useState(null);

  // Función para manejar cambios en los filtros
  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros({
      ...filtros,
      [name]: value
    });
  };

  // Función para generar el reporte
  const handleGenerarReporte = (e) => {
    e.preventDefault();
    setMostrarVistaPrevia(true);
    
    // Simulación de datos del reporte según el tipo seleccionado
    const reporteSimulado = {
      tipo: filtros.tipoReporte,
      periodo: `${filtros.fechaDesde} - ${filtros.fechaHasta}`,
      datos: {
        nombreBecario: filtros.tipoReporte === 'individual' ? 'Juan Pérez Mamani' : 'Grupo de becarios',
        estadoReportes: 'En revisión',
        calificaciones: 8.5,
        observaciones: 'Buen progreso general',
        cumplimientoCronograma: 75,
        indicadoresGlobales: {
          porcentajeAprobacion: 85,
          proyectosActivos: 38,
          proyectosFinalizados: 12,
          proyectosDevueltos: 3
        }
      }
    };
    
    setReporteGenerado(reporteSimulado);
  };

  // Función para descargar reporte en PDF
  const handleDescargarPDF = () => {
    alert('Descargando reporte en PDF (simulación)');
  };

  // Función para exportar reporte a Excel
  const handleExportarExcel = () => {
    alert('Exportando reporte a Excel (simulación)');
  };

  // Función para enviar reporte por correo
  const handleEnviarCorreo = () => {
    alert('Enviando reporte por correo institucional (simulación)');
  };

  // Función para descargar reporte del historial
  const handleDescargarReporteHistorial = (id) => {
    alert(`Descargando reporte ID: ${id} (simulación)`);
  };

  // Función para regresar al panel principal
  const handleRegresarPanel = () => {
    setMostrarVistaPrevia(false);
    setReporteGenerado(null);
  };

  return (
    <div className="generacion-reportes-wrapper">
      {/* 1. Encabezado general */}
      <div className="text-center mb-4">
        <h1 className="h2 fw-bold">Módulo de Reportes Institucionales – DyCIT</h1>
        <p className="lead text-muted">Generación de reportes individuales y globales del programa de becas auxiliares de investigación</p>
        <p className="mb-0">
          <strong>Usuario actual:</strong> Administrador del Sistema
        </p>
        <p className="text-muted small">
          Este módulo está orientado a los roles de Administrador y Director, quienes requieren consolidar información para auditorías o rendición de cuentas institucionales
        </p>
      </div>

      {/* 2. Panel de filtros y búsqueda */}
      <Card className="mb-4">
        <Card.Header as="h5" className="fw-bold">
          Filtros de Reporte
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleGenerarReporte}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Label>Selector de tipo de reporte</Form.Label>
                <Form.Select
                  name="tipoReporte"
                  value={filtros.tipoReporte}
                  onChange={handleFiltroChange}
                >
                  <option value="individual">Individual por becario</option>
                  <option value="mensual">Mensual / bimestral</option>
                  <option value="consolidado">Consolidado por gestión</option>
                </Form.Select>
              </Col>
              
              <Col md={6} className="mb-3">
                <Form.Label>Campo de búsqueda de becario o tutor</Form.Label>
                <Form.Control
                  type="text"
                  name="becario"
                  value={filtros.becario}
                  onChange={handleFiltroChange}
                  placeholder="Ingrese nombre del becario o tutor..."
                />
              </Col>
              
              <Col md={6} className="mb-3">
                <Form.Label>Fecha desde</Form.Label>
                <Form.Control
                  type="date"
                  name="fechaDesde"
                  value={filtros.fechaDesde}
                  onChange={handleFiltroChange}
                />
              </Col>
              
              <Col md={6} className="mb-3">
                <Form.Label>Fecha hasta</Form.Label>
                <Form.Control
                  type="date"
                  name="fechaHasta"
                  value={filtros.fechaHasta}
                  onChange={handleFiltroChange}
                />
              </Col>
            </Row>
            
            <div className="d-flex justify-content-end">
              <Button variant="primary" type="submit">
                Generar Reporte
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* 3. Vista previa del reporte (se muestra después de generar) */}
      {mostrarVistaPrevia && reporteGenerado && (
        <Card className="mb-4">
          <Card.Header as="h5" className="fw-bold d-flex justify-content-between align-items-center">
            <span>Vista Previa del Reporte</span>
            <div>
              <Button variant="outline-secondary" size="sm" onClick={handleRegresarPanel} className="me-2">
                Regresar al panel principal
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            {/* Encabezado institucional del reporte */}
            <div className="text-center mb-4">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Coat_of_arms_of_Bolivia.svg/120px-Coat_of_arms_of_Bolivia.svg.png"
                width="80"
                height="80"
                className="d-inline-block align-top me-2"
                alt="Logo UATF"
              />
              <h4 className="mt-2">Universidad Autónoma Tomás Frías</h4>
              <h5>Dirección de Ciencia e Innovación Tecnológica</h5>
              <p className="mb-0">Reporte {reporteGenerado.tipo} - Período: {reporteGenerado.periodo}</p>
              <p className="text-muted small">Fecha: {new Date().toLocaleDateString()}</p>
            </div>
            
            {/* Cuerpo del reporte */}
            <Row className="mb-4">
              <Col md={6} className="mb-3">
                <h6>Nombre del becario o grupo</h6>
                <p>{reporteGenerado.datos.nombreBecario}</p>
              </Col>
              
              <Col md={6} className="mb-3">
                <h6>Estado de los reportes de avance</h6>
                <p>
                  <Badge bg="warning">{reporteGenerado.datos.estadoReportes}</Badge>
                </p>
              </Col>
              
              <Col md={6} className="mb-3">
                <h6>Calificaciones y observaciones del tutor</h6>
                <p>Calificación: {reporteGenerado.datos.calificaciones}/10</p>
                <p>Observaciones: {reporteGenerado.datos.observaciones}</p>
              </Col>
              
              <Col md={6} className="mb-3">
                <h6>Cumplimiento del cronograma</h6>
                <div className="d-flex align-items-center">
                  <div className="progress flex-grow-1 me-2">
                    <div 
                      className="progress-bar" 
                      role="progressbar" 
                      style={{ width: `${reporteGenerado.datos.cumplimientoCronograma}%` }}
                      aria-valuenow={reporteGenerado.datos.cumplimientoCronograma} 
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    >
                      {reporteGenerado.datos.cumplimientoCronograma}%
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
            
            {/* Indicadores globales */}
            <h5 className="mb-3">Indicadores Globales</h5>
            <Row className="mb-4">
              <Col md={3} className="mb-3 text-center">
                <div className="indicador-card">
                  <h4 className="text-success">{reporteGenerado.datos.indicadoresGlobales.porcentajeAprobacion}%</h4>
                  <p className="small mb-0">Porcentaje de aprobación</p>
                </div>
              </Col>
              
              <Col md={3} className="mb-3 text-center">
                <div className="indicador-card">
                  <h4 className="text-primary">{reporteGenerado.datos.indicadoresGlobales.proyectosActivos}</h4>
                  <p className="small mb-0">Proyectos activos</p>
                </div>
              </Col>
              
              <Col md={3} className="mb-3 text-center">
                <div className="indicador-card">
                  <h4 className="text-info">{reporteGenerado.datos.indicadoresGlobales.proyectosFinalizados}</h4>
                  <p className="small mb-0">Proyectos finalizados</p>
                </div>
              </Col>
              
              <Col md={3} className="mb-3 text-center">
                <div className="indicador-card">
                  <h4 className="text-danger">{reporteGenerado.datos.indicadoresGlobales.proyectosDevueltos}</h4>
                  <p className="small mb-0">Proyectos devueltos</p>
                </div>
              </Col>
            </Row>
            
            {/* Pie de página institucional del reporte */}
            <div className="text-center mt-4 pt-3 border-top">
              <p className="mb-0">Dirección de Ciencia e Innovación Tecnológica – Universidad Autónoma Tomás Frías</p>
              <p className="text-muted small">Reporte generado el {new Date().toLocaleDateString()}</p>
            </div>
            
            {/* 4. Acciones disponibles */}
            <div className="d-flex justify-content-end mt-4">
              <Button variant="success" onClick={handleDescargarPDF} className="me-2">
                📄 Descargar PDF
              </Button>
              <Button variant="info" onClick={handleExportarExcel} className="me-2">
                📊 Exportar a Excel
              </Button>
              <Button variant="outline-primary" onClick={handleEnviarCorreo}>
                📧 Enviar por correo
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* 5. Historial de reportes generados (ahora ocupa todo el ancho) */}
      <Card className="mb-4">
        <Card.Header as="h5" className="fw-bold">
          Historial de Reportes Generados
        </Card.Header>
        <Card.Body>
          <Table responsive striped hover>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo de Reporte</th>
                <th>Generado por</th>
                <th>Período</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {historialReportes.map((reporte) => (
                <tr key={reporte.id}>
                  <td>{reporte.fecha}</td>
                  <td>{reporte.tipo}</td>
                  <td>{reporte.generadoPor}</td>
                  <td>{reporte.periodo}</td>
                  <td>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => handleDescargarReporteHistorial(reporte.id)}
                    >
                      📄
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* 7. Pie institucional */}
      <footer className="text-center py-3 mt-5 border-top">
        <p className="mb-1">Dirección de Ciencia e Innovación Tecnológica – Universidad Autónoma Tomás Frías</p>
        <p className="mb-0 small text-muted">
          {new Date().toLocaleDateString()} - v1.0.3 – 2025 | 
          <a href="#help" className="text-decoration-none ms-1">Manual de Reportes</a> | 
          <a href="#guide" className="text-decoration-none ms-1">Guía de interpretación de indicadores</a>
        </p>
      </footer>
    </div>
  );
};

export default GeneracionReportes;