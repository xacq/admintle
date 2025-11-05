import React, { useEffect, useMemo, useState } from 'react';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import useSessionUser from '../hooks/useSessionUser';
import './estudiante.css';

const initialForm = {
  titulo: '',
  descripcion: '',
  archivo: null,
};

const SubirReporte = () => {
  const navigate = useNavigate();
  const user = useSessionUser();
  const [beca, setBeca] = useState(null);
  const [loadingBeca, setLoadingBeca] = useState(true);
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fechaEnvio = useMemo(() => {
    return new Date().toLocaleDateString('es-BO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }, []);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const fetchBeca = async () => {
      setLoadingBeca(true);
      setError('');

      try {
        const response = await fetch(`/api/becas?becario_id=${user.id}`);
        if (!response.ok) {
          throw new Error(`Error ${response.status}`);
        }

        const payload = await response.json();
        const data = Array.isArray(payload?.data) ? payload.data : payload;
        setBeca(Array.isArray(data) ? data[0] ?? null : null);
      } catch (err) {
        setError(err.message || 'No se pudo recuperar la información de tu beca.');
      } finally {
        setLoadingBeca(false);
      }
    };

    fetchBeca();
  }, [user?.id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('El archivo no debe superar los 10 MB.');
      return;
    }

    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'doc', 'docx'].includes(extension ?? '')) {
      setError('Solo se permiten archivos en formato PDF o DOCX.');
      return;
    }

    setError('');
    setFormData((prev) => ({ ...prev, archivo: file }));
  };

  const resetForm = () => {
    setFormData(initialForm);
    const input = document.getElementById('archivo-reporte');
    if (input) {
      input.value = '';
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!beca) {
      setError('Necesitas una beca activa para registrar reportes.');
      return;
    }

    if (!formData.titulo || !formData.archivo) {
      setError('Por favor completa el título y selecciona un archivo.');
      return;
    }

    if (!user?.id) {
      setError('Tu sesión ha expirado. Inicia sesión nuevamente.');
      return;
    }

    const payload = new FormData();
    payload.append('titulo', formData.titulo);
    payload.append('descripcion', formData.descripcion);
    payload.append('archivo', formData.archivo);
    payload.append('becaId', beca.id);
    payload.append('becarioId', user.id);

    setSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/reportes', {
        method: 'POST',
        body: payload,
      });

      const responseBody = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = responseBody?.message
          || (responseBody?.errors && Object.values(responseBody.errors).flat().join(' '))
          || 'No se pudo registrar el reporte.';
        throw new Error(message);
      }

      setSuccessMessage('✅ Reporte enviado correctamente. Quedará pendiente de revisión por el tutor.');
      resetForm();

      setTimeout(() => {
        navigate('/reportesavance', { replace: true });
      }, 2000);
    } catch (err) {
      setError(err.message || 'No se pudo registrar el reporte.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/becario');
  };

  return (
    <div className="subir-reporte-wrapper">
      <Header />
      <section className="subir-reporte-header text-center py-4 border-bottom">
        <Container>
          <h1 className="h2 fw-bold">📤 Subir Nuevo Reporte de Avance</h1>
          <p className="text-muted">
            Complete los siguientes campos para registrar su informe parcial. El tutor recibirá una notificación automática.
          </p>
        </Container>
      </section>

      <Container className="py-4 d-flex justify-content-center">
        <Card className="form-card" style={{ width: '640px' }}>
          <Card.Body>
            {error && (
              <Alert variant="danger" className="mb-4">
                {error}
              </Alert>
            )}

            {successMessage && (
              <Alert variant="success" className="mb-4">
                {successMessage}
              </Alert>
            )}

            {loadingBeca ? (
              <div className="d-flex align-items-center justify-content-center py-5">
                <Spinner animation="border" role="status" className="me-2" />
                <span>Cargando información de tu beca…</span>
              </div>
            ) : !beca ? (
              <Alert variant="warning">
                No tienes una beca activa registrada. Comunícate con el tutor para habilitar el envío de reportes.
              </Alert>
            ) : (
              <>
                <div className="mb-4">
                  <p className="mb-1 text-muted">Beca seleccionada</p>
                  <h5 className="mb-0">{beca.codigo}</h5>
                  <small className="text-muted">
                    Tutor responsable: {beca.tutor?.nombre ?? 'Sin asignar'}
                  </small>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label>Título del reporte</Form.Label>
                    <Form.Control
                      type="text"
                      name="titulo"
                      value={formData.titulo}
                      onChange={handleChange}
                      placeholder="Ejemplo: Avance del segundo trimestre"
                      required
                      disabled={submitting}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Descripción breve del avance</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleChange}
                      placeholder="Describe las actividades realizadas, resultados preliminares o dificultades encontradas."
                      disabled={submitting}
                    />
                    <Form.Text className="text-muted">
                      Fecha de envío automática: {fechaEnvio}
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Archivo adjunto (PDF o DOCX, máximo 10 MB)</Form.Label>
                    <Form.Control
                      id="archivo-reporte"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      disabled={submitting}
                      required
                    />
                    {formData.archivo && (
                      <div className="mt-2">
                        <span>📎 {formData.archivo.name}</span>
                      </div>
                    )}
                  </Form.Group>

                  <div className="d-flex justify-content-center">
                    <Button
                      variant="primary"
                      type="submit"
                      className="me-3 px-4"
                      disabled={submitting}
                    >
                      {submitting ? 'Enviando…' : '📤 Subir Reporte'}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={handleCancel}
                      className="px-4"
                      disabled={submitting}
                    >
                      ↩️ Cancelar
                    </Button>
                  </div>
                </Form>
              </>
            )}
          </Card.Body>
        </Card>
      </Container>

    </div>
  );
};

export default SubirReporte;
