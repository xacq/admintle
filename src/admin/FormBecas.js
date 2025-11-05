import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './admin.css';

const STATE_OPTIONS = ['Activa', 'En evaluación', 'Finalizada'];

const INITIAL_FORM_STATE = {
  codigo: '',
  tituloProyecto: '',
  areaInvestigacion: '',
  fechaInicio: '',
  fechaFin: '',
  becarioId: '',
  tutorId: '',
  estado: STATE_OPTIONS[0],
};

const parseUsers = (payload) => {
  const data = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
    ? payload.data
    : [];

  return data
    .map((usuario) => ({
      id: usuario.id,
      nombre: usuario.name || usuario.nombre || usuario.username,
    }))
    .filter((usuario) => usuario.id != null && usuario.nombre)
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
};

const mergeUniqueUsers = (...lists) => {
  const map = new Map();

  lists.flat().forEach((usuario) => {
    if (!map.has(usuario.id)) {
      map.set(usuario.id, usuario);
    }
  });

  return Array.from(map.values()).sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
};

const FormBecas = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [becarios, setBecarios] = useState([]);
  const [tutores, setTutores] = useState([]);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [optionsError, setOptionsError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loadOptions = async () => {
      setOptionsLoading(true);
      setOptionsError('');

      try {
        const [investigadoresResponse, becariosResponse, evaluadoresResponse] = await Promise.all([
          fetch('/api/roles/investigador/usuarios'),
          fetch('/api/roles/becario/usuarios'),
          fetch('/api/roles/evaluador/usuarios'),
        ]);

        if (!investigadoresResponse.ok || !becariosResponse.ok || !evaluadoresResponse.ok) {
          throw new Error('No se pudieron cargar las listas de usuarios disponibles.');
        }

        const [investigadoresData, becariosData, evaluadoresData] = await Promise.all([
          investigadoresResponse.json(),
          becariosResponse.json(),
          evaluadoresResponse.json(),
        ]);

        const investigadores = parseUsers(investigadoresData);
        const becariosRegistrados = parseUsers(becariosData);
        const evaluadores = parseUsers(evaluadoresData);

        setBecarios(mergeUniqueUsers(investigadores, becariosRegistrados));
        setTutores(evaluadores);
      } catch (error) {
        console.error(error);
        setOptionsError(error.message || 'No se pudieron cargar los datos de referencia.');
      } finally {
        setOptionsLoading(false);
      }
    };

    loadOptions();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');

    const codigo = formData.codigo.trim();
    const tituloProyecto = formData.tituloProyecto.trim();
    const areaInvestigacion = formData.areaInvestigacion.trim();
    const becarioId = Number(formData.becarioId);
    const tutorId = Number(formData.tutorId);

    if (!codigo) {
      setSubmitError('Debes ingresar el código de la beca.');
      return;
    }

    if (!tituloProyecto) {
      setSubmitError('Debes ingresar el título del proyecto.');
      return;
    }

    if (!becarioId || Number.isNaN(becarioId)) {
      setSubmitError('Selecciona el becario asignado a la beca.');
      return;
    }

    if (!tutorId || Number.isNaN(tutorId)) {
      setSubmitError('Selecciona el tutor o evaluador asignado.');
      return;
    }

    if (!formData.fechaInicio) {
      setSubmitError('Define la fecha de inicio de la beca.');
      return;
    }

    if (formData.fechaFin) {
      const fechaInicio = new Date(formData.fechaInicio);
      const fechaFin = new Date(formData.fechaFin);

      if (fechaFin < fechaInicio) {
        setSubmitError('La fecha de fin no puede ser anterior a la fecha de inicio.');
        return;
      }
    }

    const payload = {
      codigo,
      becarioId,
      tutorId,
      fechaInicio: formData.fechaInicio,
      fechaFin: formData.fechaFin || null,
      estado: formData.estado,
      tituloProyecto,
      areaInvestigacion: areaInvestigacion || null,
    };

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/becas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let responseBody = null;

      try {
        responseBody = await response.json();
      } catch (parseError) {
        responseBody = null;
      }

      if (!response.ok) {
        let message = responseBody?.message || 'No se pudo registrar la beca.';

        if (response.status === 422 && responseBody?.errors) {
          const validationMessages = Object.values(responseBody.errors)
            .flat()
            .join(' ');

          if (validationMessages) {
            message = validationMessages;
          }
        }

        throw new Error(message);
      }

      const created = responseBody?.data ?? responseBody ?? {};
      const successMessage = `La beca ${created.codigo || codigo} se registró correctamente.`;

      navigate('/listabecas', {
        state: { successMessage },
        replace: false,
      });
    } catch (error) {
      console.error(error);
      setSubmitError(error.message || 'No se pudo registrar la beca.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/listabecas');
  };

  return (
    <Container className="formulario-beca-container">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="h4 mb-1">Registro de nueva beca</h2>
          <p className="text-muted mb-0">
            Completa los datos para vincular un becario, asignar su tutor y definir los plazos del proyecto.
          </p>
        </div>
        <Button variant="outline-secondary" onClick={handleCancel} disabled={isSubmitting}>
          Volver al listado
        </Button>
      </div>

      {optionsError && (
        <Alert variant="warning" className="mb-4">
          {optionsError}
        </Alert>
      )}

      {submitError && (
        <Alert variant="danger" className="mb-4">
          {submitError}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6} className="mb-3">
            <Form.Group controlId="formCodigo">
              <Form.Label>Código de beca</Form.Label>
              <Form.Control
                type="text"
                name="codigo"
                value={formData.codigo}
                onChange={handleChange}
                maxLength={255}
                placeholder="Ej. BEC-2024-001"
                required
                disabled={isSubmitting}
              />
            </Form.Group>
          </Col>
          <Col md={6} className="mb-3">
            <Form.Group controlId="formEstado">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              >
                {STATE_OPTIONS.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3" controlId="formTituloProyecto">
          <Form.Label>Título del proyecto</Form.Label>
          <Form.Control
            type="text"
            name="tituloProyecto"
            value={formData.tituloProyecto}
            onChange={handleChange}
            maxLength={255}
            placeholder="Ej. Análisis de algoritmos de optimización"
            required
            disabled={isSubmitting}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formAreaInvestigacion">
          <Form.Label>Área de investigación</Form.Label>
          <Form.Control
            type="text"
            name="areaInvestigacion"
            value={formData.areaInvestigacion}
            onChange={handleChange}
            maxLength={255}
            placeholder="Ej. Inteligencia Artificial"
            disabled={isSubmitting}
          />
        </Form.Group>

        <Row>
          <Col md={6} className="mb-3">
            <Form.Group controlId="formBecario">
              <Form.Label>Becario asignado</Form.Label>
              <Form.Select
                name="becarioId"
                value={formData.becarioId}
                onChange={handleChange}
                required
                disabled={isSubmitting || optionsLoading || becarios.length === 0}
              >
                <option value="">Selecciona un becario…</option>
                {becarios.map((becario) => (
                  <option key={becario.id} value={becario.id}>
                    {becario.nombre}
                  </option>
                ))}
              </Form.Select>
              {optionsLoading && <Form.Text>Cargando opciones…</Form.Text>}
            </Form.Group>
          </Col>
          <Col md={6} className="mb-3">
            <Form.Group controlId="formTutor">
              <Form.Label>Tutor o evaluador</Form.Label>
              <Form.Select
                name="tutorId"
                value={formData.tutorId}
                onChange={handleChange}
                required
                disabled={isSubmitting || optionsLoading || tutores.length === 0}
              >
                <option value="">Selecciona un tutor…</option>
                {tutores.map((tutor) => (
                  <option key={tutor.id} value={tutor.id}>
                    {tutor.nombre}
                  </option>
                ))}
              </Form.Select>
              {optionsLoading && <Form.Text>Cargando opciones…</Form.Text>}
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6} className="mb-3">
            <Form.Group controlId="formFechaInicio">
              <Form.Label>Fecha de inicio</Form.Label>
              <Form.Control
                type="date"
                name="fechaInicio"
                value={formData.fechaInicio}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </Form.Group>
          </Col>
          <Col md={6} className="mb-4">
            <Form.Group controlId="formFechaFin">
              <Form.Label>Fecha de fin (opcional)</Form.Label>
              <Form.Control
                type="date"
                name="fechaFin"
                value={formData.fechaFin}
                onChange={handleChange}
                min={formData.fechaInicio || undefined}
                disabled={isSubmitting}
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex justify-content-between">
          <Button variant="secondary" onClick={handleCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                Guardando…
              </>
            ) : (
              'Guardar beca'
            )}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default FormBecas;
