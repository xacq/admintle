// src/components/ArchivoHistorico.js

import React, { useState, useMemo } from 'react';
import { Container, Card, Row, Col, Form, Button, Table, Badge, Modal, Alert, ListGroup } from 'react-bootstrap';
import './admin.css';

// --- DATOS ESTÁTICOS DE EJEMPLO ---
const proyectosData = [
  {
    id: 1,
    anio: '2023',
    codigo: 'PI-UATF-037',
    becario: 'Ana Guzmán',
    tutor: 'Lic. Cárdenas',
    calificacionFinal: 9.2,
    estado: 'Aprobado',
    titulo: 'Análisis de algoritmos de optimización para redes de distribución',
    resumen: 'Investigación sobre algoritmos genéticos aplicados a la optimización de rutas de distribución en redes logísticas urbanas.',
    fechaInicio: '2023-03-15',
    fechaFin: '2023-11-30',
    evaluacionFinal: 'Excelente trabajo de investigación. El enfoque metodológico es sólido y los resultados presentados son relevantes para el área. Se recomienda publicación.',
    archivos: ['informe_final.pdf', 'anexos_estadisticos.pdf', 'presentacion_defensa.pptx']
  },
  {
    id: 2,
    anio: '2022',
    codigo: 'PI-UATF-028',
    becario: 'Luis Mamani',
    tutor: 'Ing. Rodríguez',
    calificacionFinal: 8.5,
    estado: 'Aprobado',
    titulo: 'Desarrollo de sistema de monitoreo de calidad del agua',
    resumen: 'Diseño e implementación de un sistema IoT para monitoreo en tiempo real de parámetros de calidad del agua en cuerpos hídricos.',
    fechaInicio: '2022-04-10',
    fechaFin: '2022-12-15',
    evaluacionFinal: 'Buen trabajo práctico con resultados aplicables. Se sugiere profundizar en el análisis de datos para futuras investigaciones.',
    archivos: ['informe_final.pdf', 'manual_usuario.pdf', 'codigo_fuente.zip']
  },
  {
    id: 3,
    anio: '2022',
    codigo: 'PI-UATF-019',
    becario: 'José Flores',
    tutor: 'Lic. Rojas',
    calificacionFinal: null,
    estado: 'Sin evaluación',
    titulo: 'Estudio de impacto ambiental de minería artesanal',
    resumen: 'Análisis de los efectos de la minería artesanal en ecosistemas acuáticos de la región sur del país.',
    fechaInicio: '2022-02-20',
    fechaFin: '2022-10-30',
    evaluacionFinal: 'El proyecto fue concluido pero no se presentó el informe final para evaluación.',
    archivos: ['borrador_informe.pdf']
  },
  {
    id: 4,
    anio: '2021',
    codigo: 'PI-UATF-012',
    becario: 'María Choque',
    tutor: 'Dr. Fernández',
    calificacionFinal: 7.8,
    estado: 'Observado',
    titulo: 'Aplicación de blockchain en la trazabilidad de productos agrícolas',
    resumen: 'Propuesta de sistema basado en blockchain para garantizar la trazabilidad y autenticidad de productos agrícolas orgánicos.',
    fechaInicio: '2021-05-15',
    fechaFin: '2022-01-20',
    evaluacionFinal: 'Trabajo innovador con enfoque tecnológico actual. Se requieren ajustes en la implementación del prototipo para mayor escalabilidad.',
    archivos: ['informe_final.pdf', 'diagramas_arquitectura.pdf']
  },
  {
    id: 5,
    anio: '2021',
    codigo: 'PI-UATF-008',
    becario: 'Carlos Vargas',
    tutor: 'Mg. Soliz',
    calificacionFinal: 9.5,
    estado: 'Aprobado',
    titulo: 'Modelo predictivo de enfermedades en cultivos de quinua',
    resumen: 'Desarrollo de modelo de machine learning para predecir la aparición de enfermedades en cultivos de quinua basado en variables climáticas y de suelo.',
    fechaInicio: '2021-03-10',
    fechaFin: '2021-11-25',
    evaluacionFinal: 'Investigación sobresaliente con resultados de alto impacto para el sector agrícola. Recomendado para publicación en revista indexada.',
    archivos: ['informe_final.pdf', 'dataset.csv', 'modelo_predictivo.py']
  }
];

const ArchivoHistorico = () => {
  const [proyectos, setProyectos] = useState(proyectosData);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true); // Simular rol de administrador
  const [filters, setFilters] = useState({
    becario: '',
    codigo: '',
    anio: 'todos',
    tutor: '',
    estado: 'todos'
  });

  // --- LÓGICA DE FILTRADO ---
  const filteredProjects = useMemo(() => {
    return proyectos.filter(proyecto => {
      const becarioMatch = filters.becario === '' || proyecto.becario.toLowerCase().includes(filters.becario.toLowerCase());
      const codigoMatch = filters.codigo === '' || proyecto.codigo.toLowerCase().includes(filters.codigo.toLowerCase());
      const anioMatch = filters.anio === 'todos' || proyecto.anio === filters.anio;
      const tutorMatch = filters.tutor === '' || proyecto.tutor.toLowerCase().includes(filters.tutor.toLowerCase());
      const estadoMatch = filters.estado === 'todos' || proyecto.estado === filters.estado;
      
      return becarioMatch && codigoMatch && anioMatch && tutorMatch && estadoMatch;
    });
  }, [proyectos, filters]);

  // --- MANEJADORES DE EVENTOS ---
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleViewProject = (proyecto) => {
    setSelectedProject(proyecto);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProject(null);
  };

  const handleDownloadFile = (filename) => {
    alert(`Descargando archivo: ${filename} (simulación)`);
  };

  const handleDownloadPDF = () => {
    alert(`Generando PDF completo del proyecto: ${selectedProject.codigo} (simulación)`);
  };

  const handleDeleteProject = (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este registro? Esta acción no se puede deshacer.')) {
      setProyectos(proyectos.filter(p => p.id !== id));
      alert('Registro eliminado (simulación)');
    }
  };

  const handleToggleVisibility = (id) => {
    alert(`Cambiando visibilidad del proyecto ID: ${id} (simulación)`);
  };

  const handleBackup = () => {
    alert('Iniciando respaldo completo del módulo histórico (simulación)');
  };

  // --- FUNCIONES AUXILIARES ---
  const getEstadoBadge = (estado) => {
    switch (estado) {
      case 'Aprobado':
        return 'success';
      case 'Observado':
        return 'warning';
      case 'Sin evaluación':
        return 'secondary';
      default:
        return 'primary';
    }
  };

  // --- ESTADÍSTICAS HISTÓRICAS ---
  const estadisticas = useMemo(() => {
    const totalPorAnio = {};
    const sumaCalificaciones = { total: 0, count: 0 };
    const tutoresActivos = {};
    const areasInvestigacion = {
      'Tecnología': 0,
      'Medio Ambiente': 0,
      'Agricultura': 0,
      'Otras': 0
    };

    proyectos.forEach(proyecto => {
      // Total por año
      totalPorAnio[proyecto.anio] = (totalPorAnio[proyecto.anio] || 0) + 1;
      
      // Suma de calificaciones
      if (proyecto.calificacionFinal) {
        sumaCalificaciones.total += proyecto.calificacionFinal;
        sumaCalificaciones.count++;
      }
      
      // Tutores activos
      tutoresActivos[proyecto.tutor] = (tutoresActivos[proyecto.tutor] || 0) + 1;
      
      // Áreas de investigación (simplificado)
      if (proyecto.titulo.toLowerCase().includes('algoritmo') || 
          proyecto.titulo.toLowerCase().includes('sistema') || 
          proyecto.titulo.toLowerCase().includes('blockchain')) {
        areasInvestigacion['Tecnología']++;
      } else if (proyecto.titulo.toLowerCase().includes('agua') || 
                 proyecto.titulo.toLowerCase().includes('ambiental') || 
                 proyecto.titulo.toLowerCase().includes('minería')) {
        areasInvestigacion['Medio Ambiente']++;
      } else if (proyecto.titulo.toLowerCase().includes('quinua') || 
                 proyecto.titulo.toLowerCase().includes('agrícola')) {
        areasInvestigacion['Agricultura']++;
      } else {
        areasInvestigacion['Otras']++;
      }
    });

    return {
      totalPorAnio,
      promedioCalificaciones: sumaCalificaciones.count > 0 ? (sumaCalificaciones.total / sumaCalificaciones.count).toFixed(1) : 0,
      tutoresActivos: Object.entries(tutoresActivos).sort((a, b) => b[1] - a[1]).slice(0, 3),
      areasInvestigacion
    };
  }, [proyectos]);

  return (
    <Container fluid className="archivo-historico-wrapper">
      {/* 1. Encabezado principal */}
      <div className="text-center mb-4">
        <h1 className="h2 fw-bold d-inline-flex align-items-center">
          📚 Archivo Histórico de Proyectos y Becas Finalizadas – DyCIT
        </h1>
        <p className="lead text-muted">Consulta y administración de investigaciones concluidas y sus evaluaciones</p>
        <p className="text-muted small">
          Este módulo permite "guardar proyectos completados y sus evaluaciones, para futuras referencias o consultas"
        </p>
      </div>

      <Row>
        <Col lg={isAdmin ? 9 : 12}>
          {/* 2. Panel de filtros de búsqueda avanzada */}
          <Card className="mb-4">
            <Card.Header as="h5" className="fw-bold">Filtros de Búsqueda Avanzada</Card.Header>
            <Card.Body>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Label>Búsqueda por nombre de becario</Form.Label>
                  <Form.Control
                    type="text"
                    name="becario"
                    value={filters.becario}
                    onChange={handleFilterChange}
                    placeholder="Ingrese nombre del becario..."
                  />
                </Col>
                <Col md={6}>
                  <Form.Label>Búsqueda por código de proyecto</Form.Label>
                  <Form.Control
                    type="text"
                    name="codigo"
                    value={filters.codigo}
                    onChange={handleFilterChange}
                    placeholder="Ej: PI-UATF-037"
                  />
                </Col>
                <Col md={4}>
                  <Form.Label>Filtro por año o gestión</Form.Label>
                  <Form.Select name="anio" value={filters.anio} onChange={handleFilterChange}>
                    <option value="todos">Todos los años</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                  </Form.Select>
                </Col>
                <Col md={4}>
                  <Form.Label>Filtro por tutor o evaluador</Form.Label>
                  <Form.Control
                    type="text"
                    name="tutor"
                    value={filters.tutor}
                    onChange={handleFilterChange}
                    placeholder="Ingrese nombre del tutor..."
                  />
                </Col>
                <Col md={4}>
                  <Form.Label>Estado final</Form.Label>
                  <Form.Select name="estado" value={filters.estado} onChange={handleFilterChange}>
                    <option value="todos">Todos los estados</option>
                    <option value="Aprobado">Aprobado</option>
                    <option value="Observado">Observado</option>
                    <option value="Sin evaluación">Sin evaluación</option>
                  </Form.Select>
                </Col>
              </Row>
              <div className="d-flex justify-content-end mt-3">
                <Button variant="primary">Buscar / Filtrar resultados</Button>
              </div>
            </Card.Body>
          </Card>

          {/* 3. Listado de proyectos archivados */}
          <Card>
            <Card.Header as="h5" className="fw-bold d-flex justify-content-between align-items-center">
              <span>Proyectos Archivados ({filteredProjects.length} resultados)</span>
              <div>
                <Button variant="outline-info" size="sm" onClick={() => setShowStats(!showStats)} className="me-2">
                  {showStats ? 'Ocultar' : 'Mostrar'} estadísticas
                </Button>
                {isAdmin && (
                  <Button variant="outline-warning" size="sm" onClick={handleBackup}>
                    Respaldar módulo histórico
                  </Button>
                )}
              </div>
            </Card.Header>
            <Card.Body>
              <Table responsive striped hover>
                <thead>
                  <tr>
                    <th>Año</th>
                    <th>Código del Proyecto</th>
                    <th>Becario</th>
                    <th>Tutor</th>
                    <th>Calificación Final</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map(proyecto => (
                      <tr key={proyecto.id}>
                        <td>{proyecto.anio}</td>
                        <td>{proyecto.codigo}</td>
                        <td>{proyecto.becario}</td>
                        <td>{proyecto.tutor}</td>
                        <td>{proyecto.calificacionFinal || '—'}</td>
                        <td>
                          <Badge bg={getEstadoBadge(proyecto.estado)}>
                            {proyecto.estado === 'Aprobado' && '✅ '}
                            {proyecto.estado === 'Observado' && '⚠️ '}
                            {proyecto.estado === 'Sin evaluación' && '❌ '}
                            {proyecto.estado}
                          </Badge>
                        </td>
                        <td>
                          <Button variant="outline-primary" size="sm" onClick={() => handleViewProject(proyecto)}>
                            🔍 Ver
                          </Button>
                          {isAdmin && (
                            <>
                              <Button 
                                variant="outline-danger" 
                                size="sm" 
                                className="ms-1"
                                onClick={() => handleDeleteProject(proyecto.id)}
                              >
                                🗑️
                              </Button>
                              <Button 
                                variant="outline-secondary" 
                                size="sm" 
                                className="ms-1"
                                onClick={() => handleToggleVisibility(proyecto.id)}
                              >
                                👁️
                              </Button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-3">No se encontraron proyectos con los filtros seleccionados.</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {isAdmin && (
          <Col lg={3}>
            {/* 6. Acciones administrativas (solo rol administrador) */}
            <Card className="mb-4">
              <Card.Header as="h5" className="fw-bold">Acciones Administrativas</Card.Header>
              <Card.Body>
                <Alert variant="info">
                  Estas acciones solo están disponibles para usuarios con rol de administrador.
                </Alert>
                <div className="d-grid gap-2">
                  <Button variant="outline-danger" size="sm">
                    Eliminar registros seleccionados
                  </Button>
                  <Button variant="outline-secondary" size="sm">
                    Reasignar visibilidad
                  </Button>
                  <Button variant="outline-warning" size="sm" onClick={handleBackup}>
                    Respaldar módulo histórico completo
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>

      {/* 5. Panel de estadísticas históricas (opcional) */}
      {showStats && (
        <Card className="mt-4">
          <Card.Header as="h5" className="fw-bold">Estadísticas Históricas</Card.Header>
          <Card.Body>
            <Row>
              <Col md={3}>
                <h6>Total de becas concluidas por año</h6>
                <ul>
                  {Object.entries(estadisticas.totalPorAnio).map(([anio, total]) => (
                    <li key={anio}>{anio}: {total} proyectos</li>
                  ))}
                </ul>
              </Col>
              <Col md={3}>
                <h6>Promedio general de calificaciones</h6>
                <h3 className="text-primary">{estadisticas.promedioCalificaciones}/10</h3>
              </Col>
              <Col md={3}>
                <h6>Tutores más activos</h6>
                <ul>
                  {estadisticas.tutoresActivos.map(([tutor, count]) => (
                    <li key={tutor}>{tutor}: {count} proyectos</li>
                  ))}
                </ul>
              </Col>
              <Col md={3}>
                <h6>Proyectos por área de investigación</h6>
                <ul>
                  {Object.entries(estadisticas.areasInvestigacion).map(([area, count]) => (
                    <li key={area}>{area}: {count} proyectos</li>
                  ))}
                </ul>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* 4. Detalle del proyecto (modal emergente) */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        {selectedProject && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Detalle del Proyecto - {selectedProject.codigo}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  <h6>Título del proyecto</h6>
                  <p>{selectedProject.titulo}</p>
                </Col>
                <Col md={6}>
                  <h6>Becario</h6>
                  <p>{selectedProject.becario}</p>
                </Col>
                <Col md={6}>
                  <h6>Tutor</h6>
                  <p>{selectedProject.tutor}</p>
                </Col>
                <Col md={6}>
                  <h6>Período</h6>
                  <p>{selectedProject.fechaInicio} - {selectedProject.fechaFin}</p>
                </Col>
                <Col md={12}>
                  <h6>Resumen del trabajo realizado</h6>
                  <p>{selectedProject.resumen}</p>
                </Col>
                <Col md={12}>
                  <h6>Evaluación final</h6>
                  <p>{selectedProject.evaluacionFinal}</p>
                  {selectedProject.calificacionFinal && (
                    <div className="mb-3">
                      <strong>Calificación final: </strong>
                      <Badge bg="info" className="p-2">{selectedProject.calificacionFinal}/10</Badge>
                    </div>
                  )}
                </Col>
                <Col md={12}>
                  <h6>Archivos asociados</h6>
                  <ListGroup>
                    {selectedProject.archivos.map((archivo, index) => (
                      <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                        {archivo}
                        <Button variant="outline-primary" size="sm" onClick={() => handleDownloadFile(archivo)}>
                          Descargar
                        </Button>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cerrar
              </Button>
              <Button variant="primary" onClick={handleDownloadPDF}>
                Descargar informe completo (PDF)
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>

      {/* Pie institucional */}
      <footer className="text-center py-3 mt-5 border-top">
        <p className="mb-1">Dirección de Ciencia e Innovación Tecnológica – UATF</p>
        <p className="mb-0 small text-muted">
          {new Date().toLocaleDateString()} - v1.0.3 – 2025
        </p>
      </footer>
    </Container>
  );
};

export default ArchivoHistorico;