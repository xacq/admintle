// src/components/ObservacionesTutor.js

import React from 'react';
import { Container, Card, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './estudiante.css';

// --- DATOS ESTÁTICOS DE EJEMPLO ---
const infoBeca = {
  tutorAsignado: 'Lic. Anny Mercado Algarañaz',
  proyecto: 'Análisis de Algoritmos de Optimización para Big Data',
  estadoActual: 'Activa'
};

const observacionesData = [
  {
    id: 1,
    numeroReporte: 1,
    fecha: '15/07/2024',
    estado: 'Aprobado',
    comentario: 'Buen avance inicial. Sugiero ampliar la sección de metodología para el siguiente reporte.',
    calificacion: 8.5
  },
  {
    id: 2,
    numeroReporte: 2,
    fecha: '15/08/2024',
    estado: 'Devuelto',
    comentario: 'Faltan los gráficos de rendimiento. Por favor, adjuntarlos en el próximo envío.',
    calificacion: 6.0
  },
  {
    id: 3,
    numeroReporte: 3,
    fecha: '15/09/2024',
    estado: 'Pendiente de revisión',
    comentario: 'El informe fue recibido y está siendo revisado.',
    calificacion: null
  }
];

const Observaciones = () => {
  const navigate = useNavigate();

  // --- FUNCIONES AUXILIARES ---
  const getEstadoVariant = (estado) => {
    switch (estado) {
      case 'Aprobado':
        return 'success';
      case 'Devuelto':
        return 'danger';
      case 'Pendiente de revisión':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'Aprobado':
        return '✅';
      case 'Devuelto':
        return '🔁';
      case 'Pendiente de revisión':
        return '🕓';
      default:
        return '❓';
    }
  };

  return (
    <div className="observaciones-tutor-wrapper">
      {/* 1. Encabezado principal */}
      <header className="observaciones-header text-center py-4 border-bottom">
        <Container>
          <h1 className="h2 fw-bold">🗒️ Observaciones del Tutor</h1>
          <p className="text-muted">Aquí puedes revisar los comentarios y recomendaciones realizados por tu tutor sobre los reportes enviados.</p>
        </Container>
      </header>

      <Container className="py-4 d-flex justify-content-center">
        <Card className="observaciones-card" style={{ width: '700px' }}>
          <Card.Body>
            {/* 2. Bloque superior - Información de contexto de la beca */}
            <div className="contexto-beca mb-4">
              <p><strong>Tutor asignado:</strong> {infoBeca.tutorAsignado}</p>
              <p><strong>Proyecto:</strong> {infoBeca.proyecto}</p>
              <p><strong>Estado actual:</strong> <Badge bg="primary">{infoBeca.estadoActual}</Badge></p>
            </div>
            <hr />

            {/* 3. Bloque principal - Lista de observaciones */}
            <div className="lista-observaciones">
              {observacionesData.length > 0 ? (
                observacionesData.map((obs) => (
                  <div key={obs.id} className={`observacion-item observacion-${obs.estado.toLowerCase().replace(' ', '-')}`}>
                    <div className="observacion-header">
                      <span className="observacion-fecha">📅 Reporte {obs.numeroReporte} – {obs.fecha}</span>
                      <Badge bg={getEstadoVariant(obs.estado)}>
                        {getEstadoIcon(obs.estado)} {obs.estado}
                      </Badge>
                    </div>
                    <div className="observacion-contenido">
                      <p className="observacion-comentario">🗒️ {obs.comentario}</p>
                      {obs.calificacion !== null && (
                        <p className="observacion-calificacion">Calificación: ⭐ {obs.calificacion} / 10</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted">Aún no existen observaciones registradas por el tutor.</p>
              )}
            </div>

            {/* 4. Botones inferiores o navegación */}
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

      {/* 5. Pie de página institucional */}
      <footer className="observaciones-footer text-center py-3 mt-4 border-top">
        <p className="mb-0">
          Dirección de Ciencia e Innovación Tecnología – Universidad Autónoma Tomás Frías
        </p>
        <small className="text-muted">
          Versión 1.0.3 – {new Date().toLocaleDateString('es-BO', { year: 'numeric', month: 'long', day: 'numeric' })}
        </small>
      </footer>
    </div>
  );
};

export default Observaciones;