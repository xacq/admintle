import React, { useEffect, useMemo, useState } from 'react';
import { Container, Card, Badge, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import useSessionUser from '../hooks/useSessionUser';
import './estudiante.css';

const ESTADO_VARIANTS = {
  Aprobado: 'success',
  Devuelto: 'danger',
  Pendiente: 'warning',
  'Pendiente de revisión': 'warning',
};

const ESTADO_ICONS = {
  Aprobado: '✅',
  Devuelto: '🔁',
  Pendiente: '🕓',
  'Pendiente de revisión': '🕓',
};

const ESTADO_CLASSES = {
  Aprobado: 'observacion-aprobado',
  Devuelto: 'observacion-devuelto',
  Pendiente: 'observacion-pendiente',
  'Pendiente de revisión': 'observacion-pendiente',
};

const parseDate = (value) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const Observaciones = () => {
  const navigate = useNavigate();
  const user = useSessionUser();
  const [beca, setBeca] = useState(null);
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user === null) {
      setError('No se pudo identificar al becario. Inicia sesión nuevamente.');
      setLoading(false);
      setBeca(null);
      setReportes([]);
      return;
    }

    if (!user?.id) {
      return;
    }

    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError('');

      try {
        const [becaResponse, reportesResponse] = await Promise.all([
          fetch(`/api/becas?becario_id=${user.id}`, { signal: controller.signal }),
          fetch(`/api/reportes?becario_id=${user.id}`, { signal: controller.signal }),
        ]);

        if (!becaResponse.ok) {
          throw new Error(`Error ${becaResponse.status}`);
        }

        if (!reportesResponse.ok) {
          throw new Error(`Error ${reportesResponse.status}`);
        }

        const becaPayload = await becaResponse.json();
        const becaData = Array.isArray(becaPayload?.data) ? becaPayload.data : becaPayload;
        setBeca(Array.isArray(becaData) ? becaData[0] ?? null : null);

        const reportesPayload = await reportesResponse.json();
        const reportesData = Array.isArray(reportesPayload?.data) ? reportesPayload.data : reportesPayload;
        setReportes(Array.isArray(reportesData) ? reportesData : []);
      } catch (err) {
        if (err.name === 'AbortError') {
          return;
        }

        setError(err.message || 'No se pudieron cargar las observaciones registradas.');
        setBeca(null);
        setReportes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [user]);

  const observacionesRegistradas = useMemo(() => {
    const withObservaciones = reportes
      .map((reporte) => {
        const texto = reporte.observaciones?.trim();
        if (!texto) {
          return null;
        }

        return { ...reporte, observaciones: texto };
      })
      .filter(Boolean);

    return withObservaciones
      .slice()
      .sort((a, b) => {
        const fechaA = parseDate(a.fechaRevision) ?? parseDate(a.fechaEnvio) ?? new Date(0);
        const fechaB = parseDate(b.fechaRevision) ?? parseDate(b.fechaEnvio) ?? new Date(0);
        return fechaB.getTime() - fechaA.getTime();
      });
  }, [reportes]);

  const getEstadoVariant = (estado) => ESTADO_VARIANTS[estado] ?? 'secondary';
  const getEstadoIcon = (estado) => ESTADO_ICONS[estado] ?? '📝';
  const getEstadoClassName = (estado) => ESTADO_CLASSES[estado] ?? 'observacion-estado-generico';

  const formatFecha = (reporte) => {
    const fecha = parseDate(reporte.fechaRevision) ?? parseDate(reporte.fechaEnvio);

    if (!fecha) {
      return 'Fecha no disponible';
    }

    return fecha.toLocaleDateString('es-BO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="observaciones-tutor-wrapper">
      <Header />
      <section className="observaciones-header text-center py-4 border-bottom">
        <Container>
          <h1 className="h2 fw-bold">🗒️ Observaciones del Tutor</h1>
          <p className="text-muted">
            Aquí puedes revisar los comentarios y recomendaciones registrados por tu tutor sobre tus reportes.
          </p>
        </Container>
      </section>

      <Container className="py-4 d-flex justify-content-center">
        <Card className="observaciones-card" style={{ width: '700px' }}>
          <Card.Body>
            {error && (
              <Alert variant="danger" className="mb-4">
                {error}
              </Alert>
            )}

            {loading ? (
              <div className="d-flex align-items-center justify-content-center py-5">
                <Spinner animation="border" role="status" className="me-2" />
                <span>Cargando observaciones…</span>
              </div>
            ) : (
              <>
                <div className="contexto-beca mb-4">
                  {beca ? (
                    <>
                      <p>
                        <strong>Tutor asignado:</strong> {beca.tutor?.nombre ?? 'Sin asignar'}
                      </p>
                      <p>
                        <strong>Proyecto:</strong> {beca.tituloProyecto || beca.codigo || 'Sin información registrada'}
                      </p>
                      <p>
                        <strong>Estado actual:</strong>{' '}
                        <Badge bg="primary">{beca.estado}</Badge>
                      </p>
                    </>
                  ) : (
                    <p className="mb-0">Aún no tienes una beca activa registrada.</p>
                  )}
                </div>

                <hr />

                <div className="lista-observaciones">
                  {observacionesRegistradas.length > 0 ? (
                    observacionesRegistradas.map((reporte) => (
                      <div
                        key={reporte.id}
                        className={`observacion-item ${getEstadoClassName(reporte.estado)}`}
                      >
                        <div className="observacion-header">
                          <span className="observacion-fecha">
                            📅 {formatFecha(reporte)} · {reporte.titulo || 'Reporte sin título'}
                          </span>
                          <Badge bg={getEstadoVariant(reporte.estado)}>
                            {getEstadoIcon(reporte.estado)} {reporte.estado}
                          </Badge>
                        </div>
                        <div className="observacion-contenido">
                          <p className="observacion-comentario">🗒️ {reporte.observaciones}</p>
                          {reporte.calificacion !== null && reporte.calificacion !== undefined && (
                            <p className="observacion-calificacion">
                              Calificación asignada: ⭐ {reporte.calificacion} / 100
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted mb-0">
                      Tu tutor aún no registró observaciones sobre tus reportes.
                    </p>
                  )}
                </div>
              </>
            )}

            <div className="d-flex justify-content-center mt-4">
              <Button variant="primary" onClick={() => navigate('/dashboardbecario')} className="me-3">
                ⬅️ Volver al Panel Principal
              </Button>
              <Button variant="outline-secondary" onClick={() => navigate('/calificaciones')}>
                📊 Ver Calificaciones Finales
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>

    </div>
  );
};

export default Observaciones;
