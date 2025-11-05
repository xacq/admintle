// src/components/VerCalificaciones.js

import React, { useEffect, useMemo, useState } from 'react';
import { Container, Card, Badge, Button, Table, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import useSessionUser from '../hooks/useSessionUser';
import './estudiante.css';

const Calificaciones = () => {
  const navigate = useNavigate();
  const user = useSessionUser();
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const controller = new AbortController();

    const loadReportes = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`/api/reportes?becario_id=${user.id}`, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Error ${response.status}`);
        }

        const payload = await response.json();
        const data = Array.isArray(payload?.data) ? payload.data : payload;
        setReportes(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error(err);
          setError(err.message || 'No se pudieron recuperar los reportes evaluados.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadReportes();

    return () => {
      controller.abort();
    };
  }, [user?.id]);

  const promedioGeneral = useMemo(() => {
    const calificacionesValidas = reportes
      .map((reporte) => reporte.calificacion)
      .filter((calificacion) => calificacion !== null && calificacion !== undefined);

    if (calificacionesValidas.length === 0) {
      return null;
    }

    const total = calificacionesValidas.reduce((acumulado, calificacion) => acumulado + Number(calificacion), 0);
    return (total / calificacionesValidas.length).toFixed(2);
  }, [reportes]);

  const getEstadoVariant = (estado) => {
    switch (estado) {
      case 'Aprobado':
        return 'success';
      case 'Pendiente':
        return 'secondary';
      case 'Devuelto':
        return 'warning';
      case 'En revisión':
        return 'info';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="ver-calificaciones-wrapper">
      <Header />
      <section className="ver-calificaciones-header text-center py-4 border-bottom">
        <Container>
          <h1 className="h2 fw-bold">📊 Calificaciones del Becario</h1>
          <p className="text-muted">
            Consulta las evaluaciones registradas para tus reportes de avance y obtén un resumen actualizado de tu desempeño.
          </p>
        </Container>
      </section>

      <Container className="py-4 d-flex justify-content-center">
        <Card className="calificaciones-card" style={{ width: '800px' }}>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}

            {loading ? (
              <div className="text-center py-4">
                <Spinner animation="border" />
                <p className="text-muted mt-3 mb-0">Cargando calificaciones…</p>
              </div>
            ) : reportes.length > 0 ? (
              <Table responsive hover className="calificaciones-table">
                <thead>
                  <tr>
                    <th>Reporte</th>
                    <th>Fecha de envío</th>
                    <th>Estado</th>
                    <th>Calificación</th>
                    <th>Observaciones</th>
                  </tr>
                </thead>
                <tbody>
                  {reportes.map((reporte) => (
                    <tr key={reporte.id}>
                      <td>{reporte.titulo}</td>
                      <td>{reporte.fechaEnvio ? new Date(reporte.fechaEnvio).toLocaleDateString('es-BO') : '—'}</td>
                      <td>
                        <Badge bg={getEstadoVariant(reporte.estado)}>{reporte.estado}</Badge>
                      </td>
                      <td>{reporte.calificacion != null ? `⭐ ${Number(reporte.calificacion).toFixed(2)} / 10` : '—'}</td>
                      <td>{reporte.observaciones ?? 'Sin observaciones registradas.'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p className="text-center text-muted mb-0">
                Aún no existen calificaciones registradas para tus reportes.
              </p>
            )}

            <hr />

            <div className="promedio-final mt-4 p-3 rounded text-center">
              <h4 className="mb-1">
                Promedio general:{' '}
                {promedioGeneral ? `⭐ ${promedioGeneral} / 10` : 'Sin calificaciones disponibles'}
              </h4>
              <small className="text-muted">Resultado acumulado considerando únicamente los reportes evaluados.</small>
            </div>

            <div className="d-flex justify-content-center mt-4 gap-3">
              <Button variant="primary" onClick={() => navigate('/dashboard/becario')}>
                ⬅️ Volver al panel principal
              </Button>
              <Button variant="outline-secondary" onClick={() => navigate('/observaciones')}>
                🗒️ Ver observaciones del tutor
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>

    </div>
  );
};

export default Calificaciones;
