// src/components/HistorialBecas.js

import React, { useState, useMemo } from 'react';
import { Container, Card, Form, Button, Table, Badge, Modal, ListGroup, Row, Col } from 'react-bootstrap';
import './admin.css';

const DEFAULT_OBSERVACION = 'Sin observaciones registradas.';

const normalizarBeca = (beca) => {
  const evaluacion = beca?.evaluacionFinal ?? null;
  const fechaArchivo = beca?.fechaArchivo ?? beca?.fechaCierre ?? null;

  return {
    id: beca?.id ?? null,
    codigo: beca?.codigo ?? '—',
    titulo: beca?.tituloProyecto ?? 'Proyecto sin título registrado',
    areaInvestigacion: beca?.areaInvestigacion ?? 'Sin área declarada',
    becario: beca?.becario?.nombre ?? 'Sin asignar',
    tutor: beca?.tutor?.nombre ?? 'Sin asignar',
    cerradaPor: beca?.cerradaPor?.nombre ?? 'No registrado',
    fechaArchivo,
    fechaInicio: beca?.fechaInicio ?? null,
    fechaFin: beca?.fechaFin ?? null,
    estado: beca?.estado ?? 'Archivada',
    evaluacionEstado: evaluacion?.estadoFinal ?? 'Sin evaluación',
    evaluacionCalificacion:
      evaluacion?.calificacionFinal !== null && evaluacion?.calificacionFinal !== undefined
        ? Number(evaluacion.calificacionFinal)
        : null,
    evaluacionObservaciones: evaluacion?.observacionesFinales ?? DEFAULT_OBSERVACION,
  };
};

const formatFecha = (value) => {
  if (!value) {
    return '—';
  }
];

const HistorialBecas = () => {
  // --- ESTADO DEL COMPONENTE ---
  const [archivedScholarships, setArchivedScholarships] = useState(historialData);
  const [filters, setFilters] = useState({ search: '', year: 'todos', tutor: 'todos' });
  const [showModal, setShowModal] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [userRole, setUserRole] = useState('Director'); // Simular rol: 'Director' o 'Administrador'

  // --- LÓGICA DE FILTRADO ---
  const filteredScholarships = useMemo(() => {
    return archivedScholarships.filter(scholarship => {
      const searchMatch = filters.search === '' || 
        scholarship.codigo.toLowerCase().includes(filters.search.toLowerCase()) ||
        scholarship.becario.toLowerCase().includes(filters.search.toLowerCase()) ||
        scholarship.tutor.toLowerCase().includes(filters.search.toLowerCase()) ||
        scholarship.proyecto.toLowerCase().includes(filters.search.toLowerCase());

      const yearMatch = filters.year === 'todos' || new Date(scholarship.fechaFin).getFullYear().toString() === filters.year;
      const tutorMatch = filters.tutor === 'todos' || scholarship.tutor === filters.tutor;

      try {
        const response = await fetch('/api/becas?estado=Archivada&include_archived=1');
        if (!response.ok) {
          throw new Error(`Error ${response.status}`);
        }

        const payload = await response.json();
        const data = Array.isArray(payload?.data) ? payload.data : payload;
        const normalizadas = Array.isArray(data) ? data.map(normalizarBeca) : [];
        normalizadas.sort((a, b) => {
          const fechaA = a.fechaArchivo ?? a.fechaFin ?? a.fechaInicio ?? null;
          const fechaB = b.fechaArchivo ?? b.fechaFin ?? b.fechaInicio ?? null;

          const timeA = fechaA ? new Date(fechaA).getTime() : 0;
          const timeB = fechaB ? new Date(fechaB).getTime() : 0;

          return timeB - timeA;
        });
        setBecas(normalizadas);
      } catch (err) {
        setError(err.message || 'No se pudo cargar el historial de becas.');
      } finally {
        setLoading(false);
      }
    };

    loadBecasArchivadas();
  }, []);

  const availableYears = useMemo(() => {
    const years = new Set();

    becas.forEach((beca) => {
      const fecha = beca.fechaArchivo ?? beca.fechaFin ?? beca.fechaInicio;
      if (!fecha) {
        return;
      }

      const parsed = new Date(fecha);
      if (!Number.isNaN(parsed.getTime())) {
        years.add(parsed.getFullYear().toString());
      }
    });
  }, [archivedScholarships, filters]);

  // --- MANEJADORES DE EVENTOS ---
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleViewDetails = (scholarship) => {
    setSelectedScholarship(scholarship);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedScholarship(null);
  };

  const handleRestore = (id) => {
    if (window.confirm('¿Está seguro de que desea restaurar esta beca al listado activo?')) {
      alert(`Beca ${id} restaurada (simulación)`);
      // Aquí iría la lógica para mover la beca de vuelta a la lista activa
    }
  };

  return (
    <div className="historial-becas-wrapper">
      {/* 1. Encabezado */}
      <header className="historial-becas-header">
        <Container>
          <Row className="align-items-center">
            <Col xs={3} className="text-start">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Coat_of_arms_of_Bolivia.svg/120px-Coat_of_arms_of_Bolivia.svg.png"
                width="50"
                height="50"
                className="d-inline-block align-top"
                alt="Logo UATF"
              />
            </Col>
            <Col xs={6} className="text-center">
              <h1 className="h4 mb-0 fw-bold">Historial de Becas Archivadas</h1>
            </Col>
            <Col xs={3} className="text-end">
              <span className="d-block text-muted small">{userRole}</span>
              <strong>Nombre del Usuario</strong>
            </Col>
          </Row>
        </Container>
      </header>

      <main className="historial-becas-main">
        <Container>
          {/* 2. Filtros */}
          <Card className="mb-4">
            <Card.Body>
              <Form>
                <Row className="g-3 align-items-end">
                  <Col md={4}>
                    <Form.Label>Buscar (código, becario, tutor o proyecto)</Form.Label>
                    <Form.Control
                      type="text"
                      name="search"
                      value={filters.search}
                      onChange={handleFilterChange}
                      placeholder="Ingrese término de búsqueda..."
                    />
                  </Col>
                  <Col md={2}>
                    <Form.Label>Año/Gestión</Form.Label>
                    <Form.Select name="year" value={filters.year} onChange={handleFilterChange}>
                      <option value="todos">Todos</option>
                      <option value="2021">2021</option>
                      <option value="2022">2022</option>
                    </Form.Select>
                  </Col>
                  <Col md={3}>
                    <Form.Label>Tutor</Form.Label>
                    <Form.Select name="tutor" value={filters.tutor} onChange={handleFilterChange}>
                      <option value="todos">Todos</option>
                      <option value="Mg. Soliz">Mg. Soliz</option>
                      <option value="Dr. Fernández">Dr. Fernández</option>
                      <option value="Lic. Rojas">Lic. Rojas</option>
                    </Form.Select>
                  </Col>
                  <Col md={2}>
                    <Form.Label>Estado</Form.Label>
                    <Form.Control plaintext readOnly defaultValue="Archivada" />
                  </Col>
                  <Col md={1}>
                    <Button variant="primary" className="w-100">Aplicar filtros</Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>

          {/* 3. Tabla principal (solo lectura) */}
          <Card>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Becario</th>
                  <th>Tutor</th>
                  <th>Proyecto</th>
                  <th>Fecha inicio</th>
                  <th>Fecha fin</th>
                  <th>Fecha de archivo</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredScholarships.map((scholarship) => (
                  <tr key={scholarship.id}>
                    <td>{scholarship.codigo}</td>
                    <td>{scholarship.becario}</td>
                    <td>{scholarship.tutor}</td>
                    <td>{scholarship.proyecto}</td>
                    <td>{scholarship.fechaInicio}</td>
                    <td>{scholarship.fechaFin}</td>
                    <td>{scholarship.fechaArchivo}</td>
                    <td>
                      <Badge bg="secondary">Archivada</Badge>
                    </td>
                    <td>
                      <Button variant="outline-primary" size="sm" onClick={() => handleViewDetails(scholarship)}>
                        Ver detalles
                      </Button>
                      {userRole === 'Administrador' && (
                        <Button variant="outline-warning" size="sm" className="ms-1" onClick={() => handleRestore(scholarship.id)}>
                          Restaurar
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Container>
      </main>

      {/* 4. Modal / Visor de detalles (solo lectura) */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        {selectedScholarship && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{selectedScholarship.codigo} (Archivada)</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  <p><strong>Becario:</strong> {selectedScholarship.becario}</p>
                  <p><strong>Tutor:</strong> {selectedScholarship.tutor}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Fecha de Inicio:</strong> {selectedScholarship.fechaInicio}</p>
                  <p><strong>Fecha de Fin:</strong> {selectedScholarship.fechaFin}</p>
                </Col>
              </Row>
              <hr />
              <p><strong>Proyecto:</strong> {selectedScholarship.proyecto}</p>
              <p><strong>Fecha de Archivo:</strong> {selectedScholarship.fechaArchivo}</p>
              <hr />
              <h6>Resumen de Evaluación Final</h6>
              {selectedScholarship.calificacionFinal !== null ? (
                <>
                  <p><strong>Calificación:</strong> {selectedScholarship.calificacionFinal} / 10</p>
                  <p><strong>Observaciones:</strong> {selectedScholarship.observacionesFinales}</p>
                </>
              ) : (
                <p className="text-muted">No se registró una evaluación final para esta beca.</p>
              )}
              <hr />
              <h6>Vínculos de Reportes</h6>
              <ListGroup>
                {selectedScholarship.reportes.map((reporte, index) => (
                  <ListGroup.Item key={index}>
                    {reporte.nombre} - {reporte.fecha}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Modal.Body>
            <Modal.Footer>
              {userRole === 'Administrador' && (
                <Button variant="warning" onClick={() => handleRestore(selectedScholarship.id)}>
                  Restaurar
                </Button>
              )}
              <Button variant="secondary" onClick={handleCloseModal}>
                Cerrar
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>

        <Card className="mb-4">
          <Card.Header as="h5" className="fw-semibold">
            Filtros de consulta
          </Card.Header>
          <Card.Body>
            <Row className="g-3">
              <Col md={4}>
                <Form.Group controlId="filtroQuery">
                  <Form.Label>Buscar por código o becario</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ej: PI-UATF-043"
                    name="query"
                    value={filters.query}
                    onChange={handleFilterChange}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="filtroTutor">
                  <Form.Label>Tutor</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nombre del tutor"
                    name="tutor"
                    value={filters.tutor}
                    onChange={handleFilterChange}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="filtroAnio">
                  <Form.Label>Gestión</Form.Label>
                  <Form.Select name="anio" value={filters.anio} onChange={handleFilterChange}>
                    <option value="todos">Todas</option>
                    {availableYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group controlId="filtroEvaluacion">
                  <Form.Label>Evaluación final</Form.Label>
                  <Form.Select
                    name="evaluacion"
                    value={filters.evaluacion}
                    onChange={handleFilterChange}
                  >
                    <option value="todos">Todas</option>
                    {availableEvaluaciones.map((estado) => (
                      <option key={estado} value={estado}>
                        {estado}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header as="h5" className="fw-semibold">
            Becas archivadas
          </Card.Header>
          <Card.Body className="p-0">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" role="status" className="me-2" />
                Cargando historial...
              </div>
            ) : filteredBecas.length === 0 ? (
              <div className="text-center py-5 text-muted">
                No se encontraron becas archivadas que coincidan con los filtros aplicados.
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover className="align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th scope="col">Código</th>
                      <th scope="col">Proyecto</th>
                      <th scope="col">Becario</th>
                      <th scope="col">Tutor</th>
                      <th scope="col">Gestión de archivo</th>
                      <th scope="col">Responsable</th>
                      <th scope="col">Evaluación final</th>
                      <th scope="col" className="text-center">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBecas.map((beca) => (
                      <tr key={beca.id ?? beca.codigo}>
                        <td>{beca.codigo}</td>
                        <td>
                          <div className="fw-semibold">{beca.titulo}</div>
                          <div className="text-muted small">{beca.areaInvestigacion}</div>
                        </td>
                        <td>{beca.becario}</td>
                        <td>{beca.tutor}</td>
                        <td>
                          <div>{formatFecha(beca.fechaArchivo)}</div>
                          <small className="text-muted">Finalizó: {formatFecha(beca.fechaFin)}</small>
                        </td>
                        <td>{beca.cerradaPor}</td>
                        <td>
                          <div>{formatCalificacion(beca.evaluacionCalificacion)}</div>
                          {(() => {
                            const variant = getEstadoBadge(beca.evaluacionEstado);
                            return (
                              <Badge
                                bg={variant}
                                className={variant === 'info' ? 'text-dark' : undefined}
                              >
                                {beca.evaluacionEstado}
                              </Badge>
                            );
                          })()}
                        </td>
                        <td className="text-center">
                          <Button variant="outline-primary" size="sm" onClick={() => handleVerDetalle(beca.id)}>
                            Ver detalle
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
      </Container>
    </div>
  );
};

export default HistorialBecas;