// src/components/ArchivoHistorico.js

import React, { useEffect, useMemo, useState } from 'react';
import {
  Container,
  Card,
  Row,
  Col,
  Form,
  Button,
  Table,
  Badge,
  Modal,
  Alert,
  ListGroup,
  Spinner,
} from 'react-bootstrap';
import useSessionUser from '../hooks/useSessionUser';
import './admin.css';

const DEFAULT_OBSERVACIONES = 'Sin observaciones registradas.';

const normalizarProyecto = (beca) => {
  const fechaFin = beca.fechaFin ?? null;
  const fechaCierre = beca.fechaCierre ?? null;
  const fechaReferencia = fechaCierre ?? fechaFin ?? beca.fechaInicio ?? null;
  const anio = fechaReferencia ? new Date(fechaReferencia).getFullYear().toString() : 'Sin gestión';
  const evaluacion = beca.evaluacionFinal ?? null;

  return {
    id: beca.id,
    anio,
    codigo: beca.codigo ?? '—',
    becario: beca.becario?.nombre ?? 'Sin asignar',
    tutor: beca.tutor?.nombre ?? 'Sin asignar',
    calificacionFinal:
      evaluacion?.calificacionFinal !== null && evaluacion?.calificacionFinal !== undefined
        ? Number(evaluacion.calificacionFinal)
        : null,
    estado: evaluacion?.estadoFinal ?? 'Sin evaluación',
    titulo: beca.tituloProyecto ?? 'Proyecto sin título registrado',
    resumen: evaluacion?.observacionesFinales ?? DEFAULT_OBSERVACIONES,
    fechaInicio: beca.fechaInicio ?? '—',
    fechaFin: beca.fechaFin ?? '—',
    fechaCierre,
    evaluacionFinal: evaluacion?.observacionesFinales ?? DEFAULT_OBSERVACIONES,
    evaluacionDetalle: evaluacion,
    areaInvestigacion: beca.areaInvestigacion ?? 'Sin área declarada',
    cerradaPor: beca.cerradaPor?.nombre ?? null,
    archivos: [],
  };
};

const ArchivoHistorico = () => {
  const sessionUser = useSessionUser();
  const isAdmin = sessionUser?.role === 'administrador';
  const isDirector = sessionUser?.role === 'director';
  const canAdminister = isAdmin;
  const canTriggerBackup = isAdmin || isDirector;

  const [proyectos, setProyectos] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [filters, setFilters] = useState({
    becario: '',
    codigo: '',
    anio: 'todos',
    tutor: '',
    estado: 'todos'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [backupFeedback, setBackupFeedback] = useState('');

  const availableYears = useMemo(() => {
    const years = new Set();

    proyectos.forEach((proyecto) => {
      if (proyecto.anio && proyecto.anio !== 'Sin gestión') {
        years.add(proyecto.anio);
      }
    });

    return Array.from(years).sort((a, b) => b.localeCompare(a, 'es', { numeric: true }));
  }, [proyectos]);

  const availableStates = useMemo(() => {
    const states = new Set();

    proyectos.forEach((proyecto) => {
      if (proyecto.estado) {
        states.add(proyecto.estado);
      }
    });

    return Array.from(states).sort((a, b) => a.localeCompare(b, 'es'));
  }, [proyectos]);

  const formatFecha = (value) => {
    if (!value) {
      return '—';
    }

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('es-BO');
  };

  useEffect(() => {
    const loadProyectos = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch('/api/becas?estado=Archivada&include_archived=1');
        if (!response.ok) {
          throw new Error(`Error ${response.status}`);
        }

        const payload = await response.json();
        const data = Array.isArray(payload?.data) ? payload.data : payload;
        const normalizados = Array.isArray(data) ? data.map(normalizarProyecto) : [];
        setProyectos(normalizados);
      } catch (err) {
        setError(err.message || 'No se pudo recuperar el archivo histórico de becas.');
      } finally {
        setLoading(false);
      }
    };

    loadProyectos();
  }, []);

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
    if (!selectedProject) {
      return;
    }

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
    if (!canTriggerBackup) {
      setBackupFeedback('No tienes permisos para ejecutar el respaldo del archivo histórico.');
      return;
    }

    setBackupFeedback('Respaldo completo del archivo histórico iniciado (simulación).');
  };

  // --- FUNCIONES AUXILIARES ---
  const getEstadoBadge = (estado) => {
    switch (estado) {
      case 'Aprobado':
        return 'success';
      case 'Reprobado':
        return 'danger';
      case 'Concluido':
        return 'info';
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
    const totalPorAnio = new Map();
    const sumaCalificaciones = { total: 0, count: 0 };
    const tutoresActivos = new Map();
    const areasInvestigacion = new Map();

    proyectos.forEach((proyecto) => {
      const anioClave = proyecto.anio || 'Sin gestión';
      totalPorAnio.set(anioClave, (totalPorAnio.get(anioClave) || 0) + 1);

      if (proyecto.calificacionFinal !== null && proyecto.calificacionFinal !== undefined) {
        sumaCalificaciones.total += Number(proyecto.calificacionFinal);
        sumaCalificaciones.count += 1;
      }

      if (proyecto.tutor && proyecto.tutor !== 'Sin asignar') {
        tutoresActivos.set(proyecto.tutor, (tutoresActivos.get(proyecto.tutor) || 0) + 1);
      }

      const area = proyecto.areaInvestigacion && proyecto.areaInvestigacion !== 'Sin área declarada'
        ? proyecto.areaInvestigacion
        : 'Sin área declarada';
      areasInvestigacion.set(area, (areasInvestigacion.get(area) || 0) + 1);
    });

    return {
      totalPorAnio: Array.from(totalPorAnio.entries()).sort((a, b) =>
        b[0].localeCompare(a[0], 'es', { numeric: true })
      ),
      promedioCalificaciones: sumaCalificaciones.count > 0 ? (sumaCalificaciones.total / sumaCalificaciones.count).toFixed(1) : 0,
      tutoresActivos: Array.from(tutoresActivos.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3),
      areasInvestigacion: Array.from(areasInvestigacion.entries()).sort((a, b) => b[1] - a[1]),
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

      {error && (
        <Alert variant="danger">{error}</Alert>
      )}

      <Row>
        <Col lg={canAdminister ? 9 : 12}>
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
                    {availableYears.map((anio) => (
                      <option key={anio} value={anio}>
                        {anio}
                      </option>
                    ))}
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
                    {availableStates.map((estado) => (
                      <option key={estado} value={estado}>
                        {estado}
                      </option>
                    ))}
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
                {canAdminister && (
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
                    <th>Fecha de cierre</th>
                    <th>Calificación Final</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
                        <Spinner animation="border" role="status" size="sm" className="me-2" />
                        Cargando archivo histórico…
                      </td>
                    </tr>
                  ) : filteredProjects.length > 0 ? (
                    filteredProjects.map((proyecto) => (
                      <tr key={proyecto.id}>
                        <td>{proyecto.anio}</td>
                        <td>{proyecto.codigo}</td>
                        <td>{proyecto.becario}</td>
                        <td>{proyecto.tutor}</td>
                        <td>{formatFecha(proyecto.fechaCierre)}</td>
                        <td>{proyecto.calificacionFinal ?? '—'}</td>
                        <td>
                          <Badge bg={getEstadoBadge(proyecto.estado)}>
                            {proyecto.estado === 'Aprobado' && '✅ '}
                            {proyecto.estado === 'Observado' && '⚠️ '}
                            {proyecto.estado === 'Reprobado' && '❌ '}
                            {proyecto.estado === 'Concluido' && 'ℹ️ '}
                            {proyecto.estado === 'Sin evaluación' && '❌ '}
                            {proyecto.estado}
                          </Badge>
                        </td>
                        <td>
                          <Button variant="outline-primary" size="sm" onClick={() => handleViewProject(proyecto)}>
                            🔍 Ver
                          </Button>
                          {canAdminister && (
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
                      <td colSpan="8" className="text-center py-3">
                        {error
                          ? 'No se pudo mostrar la información histórica.'
                          : 'No se encontraron proyectos con los filtros seleccionados.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {canAdminister && (
          <Col lg={3}>
            {/* 6. Acciones administrativas (solo rol administrador) */}
            <Card className="mb-4">
              <Card.Header as="h5" className="fw-bold">Acciones Administrativas</Card.Header>
              <Card.Body>
                <Alert variant="info">
                  Estas acciones solo están disponibles para usuarios con rol de administrador.
                </Alert>
                {backupFeedback && (
                  <Alert variant="success" className="mt-3">
                    {backupFeedback}
                  </Alert>
                )}
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
                  {estadisticas.totalPorAnio.map(([anio, total]) => (
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
                  {estadisticas.areasInvestigacion.map(([area, count]) => (
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
                <Col md={6}>
                  <h6>Estado final</h6>
                  <Badge bg={getEstadoBadge(selectedProject.estado)}>
                    {selectedProject.estado}
                  </Badge>
                </Col>
                <Col md={6}>
                  <h6>Calificación final</h6>
                  {selectedProject.calificacionFinal !== null && selectedProject.calificacionFinal !== undefined ? (
                    <Badge bg="info" className="p-2">
                      {Number(selectedProject.calificacionFinal).toFixed(2)}/10
                    </Badge>
                  ) : (
                    <p className="mb-0">Sin calificación registrada</p>
                  )}
                </Col>
                <Col md={6}>
                  <h6>Fecha de cierre</h6>
                  <p>{formatFecha(selectedProject.fechaCierre)}</p>
                </Col>
                <Col md={6}>
                  <h6>Autorizado por</h6>
                  <p>{selectedProject.cerradaPor ?? '—'}</p>
                </Col>
                <Col md={12}>
                  <h6>Resumen del trabajo realizado</h6>
                  <p>{selectedProject.resumen}</p>
                </Col>
                <Col md={12}>
                  <h6>Evaluación final</h6>
                  <p>{selectedProject.evaluacionFinal}</p>
                </Col>
                <Col md={12}>
                  <h6>Archivos asociados</h6>
                  <ListGroup>
                    {selectedProject.archivos.length > 0 ? (
                      selectedProject.archivos.map((archivo, index) => (
                        <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                          {archivo}
                          <Button variant="outline-primary" size="sm" onClick={() => handleDownloadFile(archivo)}>
                            Descargar
                          </Button>
                        </ListGroup.Item>
                      ))
                    ) : (
                      <ListGroup.Item>Sin archivos registrados para este proyecto.</ListGroup.Item>
                    )}
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
        <p className="mb-0 small text-muted">{new Date().toLocaleDateString('es-BO')}</p>
      </footer>
    </Container>
  );
};

export default ArchivoHistorico;