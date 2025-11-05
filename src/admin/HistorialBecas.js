import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Container, Form, Row, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './admin.css';

const ARCHIVED_STATE = 'Archivada';

const formatDateTime = (value) => {
  if (!value) {
    return '—';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return date.toLocaleString('es-BO');
};

const formatDate = (value) => {
  if (!value) {
    return '—';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return date.toLocaleDateString('es-BO');
};

const HistorialBecas = () => {
  const [becas, setBecas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ search: '', year: 'todas', tutor: 'todos' });

  const navigate = useNavigate();

  const loadBecas = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/becas?estado=Archivada&include_archived=1');
      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      const payload = await response.json();
      const data = Array.isArray(payload?.data) ? payload.data : payload;
      const sorted = Array.isArray(data)
        ? [...data].sort((a, b) => {
            const dateA = a.fechaArchivo ?? a.fechaCierre ?? a.fechaFin ?? a.fechaInicio;
            const dateB = b.fechaArchivo ?? b.fechaCierre ?? b.fechaFin ?? b.fechaInicio;
            return new Date(dateB || 0) - new Date(dateA || 0);
          })
        : [];

      setBecas(sorted);
    } catch (err) {
      setError(err.message || 'No se pudo cargar el historial de becas.');
      setBecas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBecas();
  }, [loadBecas]);

  const availableYears = useMemo(() => {
    const years = new Set();

    becas.forEach((beca) => {
      const reference = beca.fechaArchivo ?? beca.fechaFin ?? beca.fechaInicio;
      if (!reference) {
        return;
      }

      const parsed = new Date(reference);
      if (!Number.isNaN(parsed.getTime())) {
        years.add(String(parsed.getFullYear()));
      }
    });

    return ['todas', ...Array.from(years).sort((a, b) => Number(b) - Number(a))];
  }, [becas]);

  const availableTutores = useMemo(() => {
    const tutores = new Set();
    becas.forEach((beca) => {
      if (beca.tutor?.nombre) {
        tutores.add(beca.tutor.nombre);
      }
    });

    return ['todos', ...Array.from(tutores).sort((a, b) => a.localeCompare(b, 'es'))];
  }, [becas]);

  const filteredBecas = useMemo(() => {
    const term = filters.search.trim().toLowerCase();

    return becas.filter((beca) => {
      if (filters.year !== 'todas') {
        const reference = beca.fechaArchivo ?? beca.fechaFin ?? beca.fechaInicio;
        const year = reference ? new Date(reference).getFullYear().toString() : '';
        if (year !== filters.year) {
          return false;
        }
      }

      if (filters.tutor !== 'todos') {
        if ((beca.tutor?.nombre ?? '') !== filters.tutor) {
          return false;
        }
      }

      if (!term) {
        return true;
      }

      const searchable = [
        beca.codigo,
        beca.tituloProyecto,
        beca.becario?.nombre,
        beca.tutor?.nombre,
        beca.areaInvestigacion,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchable.includes(term);
    });
  }, [becas, filters]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleVerDetalle = (beca) => {
    navigate(`/detallebeca/${beca.id}`, { state: { fromHistorial: true } });
  };

  return (
    <Container className="py-4 historial-becas-page">
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
        <div>
          <h1 className="h4 mb-1">Archivo histórico de becas</h1>
          <p className="text-muted mb-0">
            Consulta todas las becas cerradas y archivadas del programa DyCIT.
          </p>
        </div>
        <Button variant="outline-secondary" onClick={() => navigate('/listabecas')}>
          Volver a la gestión de becas
        </Button>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <Card className="mb-4">
        <Card.Body>
          <Row className="g-3 align-items-end">
            <Col md={5}>
              <Form.Label htmlFor="search">Buscar</Form.Label>
              <Form.Control
                id="search"
                name="search"
                type="search"
                placeholder="Código, becario, tutor o proyecto"
                value={filters.search}
                onChange={handleFilterChange}
              />
            </Col>
            <Col md={3}>
              <Form.Label htmlFor="year">Gestión</Form.Label>
              <Form.Select id="year" name="year" value={filters.year} onChange={handleFilterChange}>
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year === 'todas' ? 'Todas' : year}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Label htmlFor="tutor">Tutor</Form.Label>
              <Form.Select id="tutor" name="tutor" value={filters.tutor} onChange={handleFilterChange}>
                {availableTutores.map((tutor) => (
                  <option key={tutor} value={tutor}>
                    {tutor === 'todos' ? 'Todos' : tutor}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {loading ? (
        <div className="text-center py-5">Cargando archivo histórico...</div>
      ) : filteredBecas.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No hay becas archivadas que coincidan con los filtros seleccionados.
        </div>
      ) : (
        <Card>
          <Table responsive hover className="mb-0">
            <thead>
              <tr>
                <th>Código</th>
                <th>Becario</th>
                <th>Tutor</th>
                <th>Proyecto</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Archivo</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredBecas.map((beca) => (
                <tr key={beca.id}>
                  <td className="fw-semibold">{beca.codigo}</td>
                  <td>{beca.becario?.nombre ?? 'Sin asignar'}</td>
                  <td>{beca.tutor?.nombre ?? 'Sin asignar'}</td>
                  <td>{beca.tituloProyecto ?? '—'}</td>
                  <td>{formatDate(beca.fechaInicio)}</td>
                  <td>{formatDate(beca.fechaFin)}</td>
                  <td>{formatDateTime(beca.fechaArchivo ?? beca.fechaCierre)}</td>
                  <td>
                    <Badge bg="secondary">{ARCHIVED_STATE}</Badge>
                  </td>
                  <td className="text-end">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleVerDetalle(beca)}
                    >
                      Ver detalle
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}
    </Container>
  );
};

export default HistorialBecas;
