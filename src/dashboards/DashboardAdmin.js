import { useEffect, useMemo, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  Button,
  Alert,
  Form,
  Modal,
  Spinner,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import useSessionUser from '../hooks/useSessionUser';
import '../admin/admin.css';

const DashboardAdmin = () => {
  const navigate = useNavigate();
  const user = useSessionUser();
  const [becas, setBecas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState('');
  const [roleOptions, setRoleOptions] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [rolesError, setRolesError] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);
  const [userFeedback, setUserFeedback] = useState(null);
  const [userFormStatus, setUserFormStatus] = useState(null);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    roleId: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const loadBecas = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/becas?include_archived=1');
      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      const payload = await response.json();
      const data = Array.isArray(payload?.data) ? payload.data : payload;
      setBecas(data);
    } catch (err) {
      setError(err.message || 'No se pudo cargar la información de becas.');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    setUsersLoading(true);
    setUsersError('');

    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('No se pudo cargar la lista de usuarios.');
      }

      const payload = await response.json();
      const data = Array.isArray(payload?.data) ? payload.data : payload;
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setUsersError(err.message || 'No se pudo cargar la lista de usuarios.');
    } finally {
      setUsersLoading(false);
    }
  };

  const loadRoles = async () => {
    setRolesLoading(true);
    setRolesError('');

    try {
      const response = await fetch('/api/roles');
      if (!response.ok) {
        throw new Error('No se pudo cargar la lista de roles.');
      }

      const payload = await response.json();
      const rawRoles = Array.isArray(payload?.data) ? payload.data : payload;
      const normalized = Array.isArray(rawRoles)
        ? rawRoles
            .map((role) => ({
              id: role?.id ?? role?.ID ?? role?.uuid ?? null,
              name: String(role?.name ?? role?.nombre ?? '').toLowerCase(),
              displayName: role?.displayName ?? role?.display_name ?? role?.nombre ?? role?.name ?? '',
            }))
            .filter((role) => role.id != null && role.name.length > 0)
        : [];

      const findRole = (...names) =>
        normalized.find((role) => names.map((name) => name.toLowerCase()).includes(role.name));

      const tutorRole = findRole('tutor_evaluador', 'tutor') ?? findRole('evaluador');
      const directorRole = findRole('director');
      const becarioRole = findRole('becario');

      const options = [];

      if (tutorRole && !options.some((option) => option.id === tutorRole.id)) {
        options.push({ id: tutorRole.id, label: 'Tutor/Evaluador' });
      }

      if (directorRole && !options.some((option) => option.id === directorRole.id)) {
        options.push({ id: directorRole.id, label: 'Director' });
      }

      if (becarioRole && !options.some((option) => option.id === becarioRole.id)) {
        options.push({ id: becarioRole.id, label: 'Becario' });
      }

      setRoleOptions(options);

      if (options.length === 0) {
        setRolesError('No hay roles disponibles para asignar. Configure los roles en el Panel de Configuración.');
      }
    } catch (err) {
      console.error(err);
      setRolesError(err.message || 'No se pudo cargar la lista de roles.');
    } finally {
      setRolesLoading(false);
    }
  };

  useEffect(() => {
    loadBecas();
    loadUsers();
    loadRoles();
  }, []);

  const estadisticas = useMemo(() => {
    const total = becas.length;
    const activas = becas.filter((beca) => beca.estado === 'Activa').length;
    const evaluacion = becas.filter((beca) => beca.estado === 'En evaluación').length;
    const finalizadas = becas.filter((beca) => beca.estado === 'Finalizada').length;
    const archivadas = becas.filter((beca) => beca.estado === 'Archivada').length;

    return {
      total,
      activas,
      evaluacion,
      finalizadas,
      archivadas,
    };
  }, [becas]);

  const becasDestacadas = useMemo(() => {
    return becas
      .filter((beca) => beca.estado === 'Activa' || beca.estado === 'En evaluación')
      .slice(0, 5);
  }, [becas]);

  const parseDateValue = (value) => {
    if (!value) {
      return 0;
    }

    const timestamp = new Date(value).getTime();
    return Number.isNaN(timestamp) ? 0 : timestamp;
  };

  const formatDateValue = (value) => {
    if (!value) {
      return '—';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '—';
    }

    return date.toLocaleDateString('es-BO');
  };

  const usuariosRecientes = useMemo(() => {
    if (!Array.isArray(users)) {
      return [];
    }

    return [...users]
      .sort((usuarioA, usuarioB) => {
        const timeA = parseDateValue(usuarioA?.createdAt);
        const timeB = parseDateValue(usuarioB?.createdAt);

        if (timeA !== timeB) {
          return timeB - timeA;
        }

        const nameA = usuarioA?.name ?? '';
        const nameB = usuarioB?.name ?? '';
        return nameA.localeCompare(nameB);
      })
      .slice(0, 5);
  }, [users]);

  const getEstadoBadgeVariant = (estado) => {
    switch (estado) {
      case 'Activa':
        return 'success';
      case 'En evaluación':
        return 'warning';
      case 'Finalizada':
        return 'secondary';
      case 'Archivada':
        return 'dark';
      default:
        return 'primary';
    }
  };

  const handleVerDetalles = (codigo) => {
    navigate('/listabecas', { state: { focusBecaCodigo: codigo } });
  };

  const handleAccesoDirecto = (modulo) => {
    switch (modulo) {
      case 'Gestión de Becas':
        navigate('/listabecas');
        break;
      case 'Reportes Institucionales':
        navigate('/generacionreportes');
        break;
      case 'Configuración del Sistema':
        navigate('/configuracion-sistema');
        break;
      default:
        break;
    }
  };

  const resetUserForm = () => {
    setUserForm({
      name: '',
      email: '',
      username: '',
      password: '',
      roleId: roleOptions.length === 1 ? String(roleOptions[0].id) : '',
    });
    setFormErrors({});
    setUserFormStatus(null);
  };

  const handleAbrirModalUsuario = () => {
    if (!rolesLoading && roleOptions.length === 0 && !rolesError) {
      loadRoles();
    }

    resetUserForm();
    setShowUserModal(true);
  };

  const handleCerrarModalUsuario = () => {
    if (creatingUser) {
      return;
    }

    setShowUserModal(false);
    resetUserForm();
  };

  const handleChangeUsuarioForm = (field, value) => {
    setUserForm((prev) => ({ ...prev, [field]: value }));
  };

  const validarFormularioUsuario = () => {
    const errores = {};

    if (!userForm.name.trim()) {
      errores.name = 'El nombre es obligatorio.';
    }

    if (!userForm.email.trim()) {
      errores.email = 'El correo electrónico es obligatorio.';
    } else {
      const emailPattern = /.+@.+\..+/i;
      if (!emailPattern.test(userForm.email.trim())) {
        errores.email = 'Debe ingresar un correo electrónico válido.';
      }
    }

    if (!userForm.username.trim()) {
      errores.username = 'El nombre de usuario es obligatorio.';
    }

    if (!userForm.password.trim()) {
      errores.password = 'La contraseña es obligatoria.';
    } else if (userForm.password.trim().length < 8) {
      errores.password = 'La contraseña debe tener al menos 8 caracteres.';
    }

    if (!userForm.roleId) {
      errores.roleId = 'Debe seleccionar un rol.';
    }

    setFormErrors(errores);

    return Object.keys(errores).length === 0;
  };

  const handleSubmitUsuario = async (event) => {
    event.preventDefault();

    if (!validarFormularioUsuario()) {
      return;
    }

    setCreatingUser(true);
    setUserFormStatus(null);

    const payload = {
      name: userForm.name.trim(),
      email: userForm.email.trim(),
      username: userForm.username.trim(),
      password: userForm.password.trim(),
      role_id: Number(userForm.roleId),
    };

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const firstError = data?.errors ? Object.values(data.errors).flat()[0] : null;
        throw new Error(firstError || data?.message || 'No se pudo crear el usuario.');
      }

      const usuarioGuardado = data?.data;

      if (usuarioGuardado) {
        setUsers((prevUsuarios) => {
          const listaActualizada = Array.isArray(prevUsuarios)
            ? [...prevUsuarios, usuarioGuardado]
            : [usuarioGuardado];

          return listaActualizada.sort((usuarioA, usuarioB) =>
            (usuarioA?.name ?? '').localeCompare(usuarioB?.name ?? '')
          );
        });
      } else {
        await loadUsers();
      }

      setUserFeedback({ type: 'success', message: 'Usuario creado correctamente.' });
      setShowUserModal(false);
      resetUserForm();
    } catch (err) {
      console.error(err);
      setUserFormStatus({ type: 'danger', message: err.message || 'No se pudo crear el usuario.' });
    } finally {
      setCreatingUser(false);
    }
  };

  return (
    <div className="dashboard-admin-wrapper">
      <Header />
      <section className="dashboard-header text-center py-4 border-bottom">
        <Container>
          <Row className="align-items-center">
            <Col md={3} className="text-start">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Coat_of_arms_of_Bolivia.svg/120px-Coat_of_arms_of_Bolivia.svg.png"
                width="60"
                height="60"
                className="d-inline-block align-top"
                alt="Logo UATF"
              />
            </Col>
            <Col md={6}>
              <h1 className="h3 mb-0 fw-bold">
                Sistema de Becas Auxiliares de Investigación
              </h1>
            </Col>
            <Col md={3} className="text-end">
              <span className="text-muted">Bienvenido,</span>
              <br />
              <strong>{user?.name ?? 'Administrador'}</strong>
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="py-4">
        <Row className="g-3 mb-4">
          <Col xs={12} sm={6} xl={3}>
            <Card className="text-center metric-card">
              <Card.Body>
                <h2 className="text-primary">{estadisticas.total}</h2>
                <p className="text-muted mb-0">Becas registradas</p>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <Card className="text-center metric-card">
              <Card.Body>
                <h2 className="text-success">{estadisticas.activas}</h2>
                <p className="text-muted mb-0">Becas activas</p>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <Card className="text-center metric-card">
              <Card.Body>
                <h2 className="text-warning">{estadisticas.evaluacion}</h2>
                <p className="text-muted mb-0">En evaluación</p>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <Card className="text-center metric-card">
              <Card.Body>
                <h2 className="text-dark">{estadisticas.archivadas}</h2>
                <p className="text-muted mb-0">Becas en archivo histórico</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {estadisticas.finalizadas > 0 && (
          <Row className="mb-4">
            <Col>
              <div className="alert alert-info mb-0" role="alert">
                {estadisticas.finalizadas === 1
                  ? 'Existe 1 beca finalizada pendiente de archivo.'
                  : `Existen ${estadisticas.finalizadas} becas finalizadas pendientes de archivo.`}
              </div>
            </Col>
          </Row>
        )}

        <Row>
          <Col lg={8}>
            <Card className="h-100">
              <Card.Header as="h5" className="fw-bold">
                Becas destacadas
              </Card.Header>
              <Card.Body>
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Becario</th>
                      <th>Tutor</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="text-center py-4">
                          Cargando información…
                        </td>
                      </tr>
                    ) : becasDestacadas.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-4">
                          No hay becas registradas todavía.
                        </td>
                      </tr>
                    ) : (
                      becasDestacadas.map((beca) => (
                        <tr key={beca.id}>
                          <td>{beca.codigo}</td>
                          <td>{beca.becario?.nombre ?? 'Sin asignar'}</td>
                          <td>{beca.tutor?.nombre ?? 'Sin asignar'}</td>
                          <td>
                            <Badge bg={getEstadoBadgeVariant(beca.estado)}>
                              {beca.estado}
                            </Badge>
                          </td>
                          <td>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleVerDetalles(beca.codigo)}
                            >
                              Ver
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="h-100">
              <Card.Header as="h5" className="fw-bold">
                Accesos Directos
              </Card.Header>
              <Card.Body className="d-flex flex-column justify-content-around">
                <Button
                  variant="primary"
                  className="mb-3 w-100"
                  onClick={() => handleAccesoDirecto('Gestión de Becas')}
                >
                  📋 Gestión de Becas
                </Button>
                <Button
                  variant="info"
                  className="mb-3 w-100"
                  onClick={() => handleAccesoDirecto('Reportes Institucionales')}
                >
                  📊 Reportes Institucionales
                </Button>
                <Button
                  variant="secondary"
                  className="w-100"
                  onClick={() => handleAccesoDirecto('Configuración del Sistema')}
                >
                  ⚙️ Configuración del Sistema
                </Button>
              </Card.Body>
            </Card>
            <Card className="mt-3">
              <Card.Header as="h5" className="fw-bold">
                Resumen de estados
              </Card.Header>
              <Card.Body>
                <p className="mb-2 d-flex justify-content-between">
                  <span>Becas finalizadas</span>
                  <strong>{estadisticas.finalizadas}</strong>
                </p>
                <p className="mb-0 d-flex justify-content-between">
                  <span>Total gestionado</span>
                  <strong>{estadisticas.total}</strong>
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            <Card>
              <Card.Header className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center">
                <div>
                  <h5 className="fw-bold mb-1 mb-sm-0">Gestión rápida de usuarios</h5>
                  <small className="text-muted">
                    Registra nuevos usuarios y asigna sus roles para habilitar el acceso al sistema.
                  </small>
                </div>
                <div className="d-flex gap-2 mt-3 mt-sm-0">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => navigate('/panelconfiguracion')}
                  >
                    Gestión avanzada
                  </Button>
                  <Button variant="success" size="sm" onClick={handleAbrirModalUsuario}>
                    + Añadir usuario
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
                {userFeedback && (
                  <Alert
                    variant={userFeedback.type}
                    dismissible
                    onClose={() => setUserFeedback(null)}
                    className="mb-3"
                  >
                    {userFeedback.message}
                  </Alert>
                )}

                {usersError && (
                  <Alert variant="danger" className="mb-3">
                    {usersError}
                  </Alert>
                )}

                {rolesError && (
                  <Alert variant="warning" className="mb-3">
                    {rolesError}
                  </Alert>
                )}

                {usersLoading ? (
                  <div className="text-center py-4">
                    <Spinner animation="border" role="status" className="me-2" />
                    <span>Cargando usuarios…</span>
                  </div>
                ) : usuariosRecientes.length === 0 ? (
                  <div className="text-center text-muted py-3">
                    Aún no se registraron usuarios adicionales en el sistema.
                  </div>
                ) : (
                  <Table responsive hover size="sm" className="mb-0">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Usuario</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th>Registrado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuariosRecientes.map((usuario) => (
                        <tr key={usuario.id}>
                          <td>{usuario.name}</td>
                          <td>{usuario.username}</td>
                          <td>{usuario.role?.displayName ?? 'Sin rol'}</td>
                          <td>
                            <Badge bg={usuario.isActive ? 'success' : 'secondary'}>
                              {usuario.isActive ? 'Activo' : 'Inactivo'}
                            </Badge>
                          </td>
                          <td>{formatDateValue(usuario.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Modal
        show={showUserModal}
        onHide={handleCerrarModalUsuario}
        centered
        backdrop="static"
        size="lg"
        keyboard={!creatingUser}
      >
        <Form onSubmit={handleSubmitUsuario} noValidate>
          <Modal.Header closeButton={!creatingUser}>
            <Modal.Title>Registrar nuevo usuario</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {userFormStatus && (
              <Alert
                variant={userFormStatus.type}
                dismissible
                onClose={() => setUserFormStatus(null)}
                className="mb-3"
              >
                {userFormStatus.message}
              </Alert>
            )}

            {rolesLoading ? (
              <div className="text-center py-4">
                <Spinner animation="border" role="status" className="me-2" />
                <span>Cargando roles disponibles…</span>
              </div>
            ) : roleOptions.length === 0 ? (
              <Alert variant="warning" className="mb-0">
                No hay roles configurados para asignar. Utiliza la gestión avanzada para crear o habilitar roles.
              </Alert>
            ) : (
              <>
                <Form.Group className="mb-3" controlId="nuevoUsuarioNombre">
                  <Form.Label>Nombre completo</Form.Label>
                  <Form.Control
                    type="text"
                    value={userForm.name}
                    onChange={(event) => handleChangeUsuarioForm('name', event.target.value)}
                    placeholder="Ej. Juan Pérez"
                    isInvalid={Boolean(formErrors.name)}
                    disabled={creatingUser}
                    autoComplete="name"
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.name}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="nuevoUsuarioCorreo">
                  <Form.Label>Correo electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    value={userForm.email}
                    onChange={(event) => handleChangeUsuarioForm('email', event.target.value)}
                    placeholder="usuario@ejemplo.com"
                    isInvalid={Boolean(formErrors.email)}
                    disabled={creatingUser}
                    autoComplete="email"
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.email}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="nuevoUsuarioUsername">
                  <Form.Label>Nombre de usuario</Form.Label>
                  <Form.Control
                    type="text"
                    value={userForm.username}
                    onChange={(event) => handleChangeUsuarioForm('username', event.target.value)}
                    placeholder="Ej. juan.perez"
                    isInvalid={Boolean(formErrors.username)}
                    disabled={creatingUser}
                    autoComplete="username"
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.username}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="nuevoUsuarioPassword">
                  <Form.Label>Contraseña temporal</Form.Label>
                  <Form.Control
                    type="password"
                    value={userForm.password}
                    onChange={(event) => handleChangeUsuarioForm('password', event.target.value)}
                    placeholder="Debe tener al menos 8 caracteres"
                    isInvalid={Boolean(formErrors.password)}
                    disabled={creatingUser}
                    autoComplete="new-password"
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.password}</Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Comparte esta contraseña de forma segura. El usuario podrá cambiarla luego.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-0" controlId="nuevoUsuarioRol">
                  <Form.Label>Rol asignado</Form.Label>
                  <Form.Select
                    value={userForm.roleId}
                    onChange={(event) => handleChangeUsuarioForm('roleId', event.target.value)}
                    isInvalid={Boolean(formErrors.roleId)}
                    disabled={creatingUser}
                  >
                    <option value="">Selecciona un rol</option>
                    {roleOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{formErrors.roleId}</Form.Control.Feedback>
                </Form.Group>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCerrarModalUsuario} disabled={creatingUser}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={creatingUser || roleOptions.length === 0}
            >
              {creatingUser ? 'Guardando…' : 'Crear usuario'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <div className="dashboard-footer text-center py-3 mt-4 border-top">
        <p className="mb-0">
          Dirección de Ciencia e Innovación Tecnológica – Universidad Autónoma Tomás Frías
        </p>
        <small className="text-muted">
          Versión 1.0.3 –{' '}
          {new Date().toLocaleDateString('es-BO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </small>
      </div>
    </div>
  );
};

export default DashboardAdmin;
