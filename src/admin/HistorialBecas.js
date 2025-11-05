import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
  Table,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useSessionUser from '../hooks/useSessionUser';
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

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return date.toLocaleDateString('es-BO');
};

const formatCalificacion = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return 'Sin registrar';
  }

  const numeric = Number(value);
  return `${numeric.toFixed(2)} / 10`;
};

const getEstadoBadge = (estado) => {
  switch (estado) {
    case 'Aprobado':
      return 'success';
    case 'Reprobado':
      return 'danger';
    case 'Concluido':
      return 'info';
    case 'Pendiente':
      return 'secondary';
    default:
      return 'dark';
  }
};

const HistorialBecas = () => {
  const navigate = useNavigate();
  const sessionUser = useSessionUser();

  const [becas, setBecas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    query: '',
    tutor: '',
    anio: 'todos',
    evaluacion: 'todos',
  });

  useEffect(() => {
    const loadBecasArchivadas = async () => {
      setLoading(true);
      setError('');

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

    return Array.from(years).sort((a, b) => b.localeCompare(a, 'es', { numeric: true }));
  }, [becas]);

  const availableEvaluaciones = useMemo(() => {
    const estados = new Set();
    becas.forEach((beca) => {
      if (beca.evaluacionEstado) {
        estados.add(beca.evaluacionEstado);
      }
    });

    return Array.from(estados).sort((a, b) => a.localeCompare(b, 'es'));
  }, [becas]);

  const filteredBecas = useMemo(() => {
    return becas.filter((beca) => {
      const queryMatch =
        filters.query === '' ||
        beca.codigo.toLowerCase().includes(filters.query.toLowerCase()) ||
        beca.becario.toLowerCase().includes(filters.query.toLowerCase());

      const tutorMatch =
        filters.tutor === '' || beca.tutor.toLowerCase().includes(filters.tutor.toLowerCase());

      const yearMatch =
        filters.anio === 'todos' ||
        (() => {
          const fecha = beca.fechaArchivo ?? beca.fechaFin ?? beca.fechaInicio;
          if (!fecha) {
            return false;
          }
          const parsed = new Date(fecha);
          return !Number.isNaN(parsed.getTime()) && parsed.getFullYear().toString() === filters.anio;
        })();

      const evaluacionMatch =
        filters.evaluacion === 'todos' || beca.evaluacionEstado === filters.evaluacion;

      return queryMatch && tutorMatch && yearMatch && evaluacionMatch;
    });
  }, [becas, filters]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleVerDetalle = (becaId) => {
    if (!becaId) {
      return;
    }

    navigate(`/becas/${becaId}`, { state: { fromHistorial: true } });
  };

  return (
    <div className="archivo-historico-wrapper">
      <Container>
        <Row className="align-items-center mb-4">
          <Col>
            <h2 className="h4 mb-0">Historial de becas archivadas</h2>
            <p className="text-muted mb-0">
              Registros preservados para consulta histórica y trazabilidad del programa.
            </p>
          </Col>
          <Col xs="auto">
            {sessionUser && (
              <span className="badge bg-light text-dark">
                Sesión iniciada como {sessionUser.roleLabel ?? sessionUser.role}
              </span>
            )}
          </Col>
        </Row>

        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

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
