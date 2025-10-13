const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const DB_PATH = path.join(__dirname, 'admintle.sqlite');

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error al abrir la base de datos', err);
    process.exit(1);
  }
});

const run = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function runCallback(err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this);
    });
  });

const all = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });

async function initializeDatabase() {
  await run(`CREATE TABLE IF NOT EXISTS designaciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha TEXT NOT NULL,
    empleado TEXT NOT NULL,
    puesto TEXT NOT NULL,
    departamento TEXT NOT NULL,
    estado TEXT NOT NULL
  )`);

  await run(`CREATE TABLE IF NOT EXISTS historial_estudiantes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    repetidos INTEGER NOT NULL,
    nota INTEGER NOT NULL
  )`);

  await run(`CREATE TABLE IF NOT EXISTS estudiantes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ru TEXT NOT NULL,
    name TEXT NOT NULL,
    ci TEXT NOT NULL,
    nota INTEGER NOT NULL,
    celular TEXT NOT NULL
  )`);

  await run(`CREATE TABLE IF NOT EXISTS materias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    agu INTEGER NOT NULL,
    nickname TEXT NOT NULL,
    details TEXT NOT NULL
  )`);

  await run(`CREATE TABLE IF NOT EXISTS notificaciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    numero INTEGER NOT NULL,
    titulo TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    hasta TEXT NOT NULL,
    categoria TEXT NOT NULL
  )`);

  const [{ count: designacionesCount }] = await all('SELECT COUNT(*) as count FROM designaciones');
  if (designacionesCount === 0) {
    const sampleDesignaciones = [
      ['2024-01-03', 'Ana Rodríguez', 'Docente Titular', 'Matemáticas', 'Activa'],
      ['2023-11-18', 'Carlos López', 'Docente Auxiliar', 'Informática', 'Concluida'],
      ['2023-07-07', 'Lucía Pérez', 'Investigador', 'Laboratorio', 'Activa']
    ];
    for (const [fecha, empleado, puesto, departamento, estado] of sampleDesignaciones) {
      await run(
        `INSERT INTO designaciones (fecha, empleado, puesto, departamento, estado) VALUES (?, ?, ?, ?, ?)`,
        [fecha, empleado, puesto, departamento, estado]
      );
    }
  }

  const [{ count: historialCount }] = await all('SELECT COUNT(*) as count FROM historial_estudiantes');
  if (historialCount === 0) {
    const sampleHistorial = [
      ['FULANO MENCHACA', 1, 52],
      ['MARIA SOSA CABRERA', 1, 45],
      ['PABLO MARQUEZ POLI', 0, 80]
    ];
    for (const [fullName, repetidos, nota] of sampleHistorial) {
      await run(
        `INSERT INTO historial_estudiantes (full_name, repetidos, nota) VALUES (?, ?, ?)`,
        [fullName, repetidos, nota]
      );
    }
  }

  const [{ count: estudiantesCount }] = await all('SELECT COUNT(*) as count FROM estudiantes');
  if (estudiantesCount === 0) {
    const sampleEstudiantes = [
      ['123456', 'FULANO MENCHACA', '12345678', 60, '60148532'],
      ['789012', 'MARIA SOSA CABRERA', '78901234', 55, '78965412'],
      ['456789', 'PABLO MARQUEZ POLI', '45678901', 80, '70512345']
    ];
    for (const [ru, name, ci, nota, celular] of sampleEstudiantes) {
      await run(
        `INSERT INTO estudiantes (ru, name, ci, nota, celular) VALUES (?, ?, ?, ?, ?)`,
        [ru, name, ci, nota, celular]
      );
    }
  }

  const [{ count: materiasCount }] = await all('SELECT COUNT(*) as count FROM materias');
  if (materiasCount === 0) {
    const sampleMaterias = [
      ['SEMINARIO DE SISTEMAS', 36, 'SIS719', JSON.stringify({ checked: false })],
      ['BASES DE DATOS II', 48, 'SIS650', JSON.stringify({ checked: true })],
      ['REDES AVANZADAS', 40, 'TEL520', JSON.stringify({ checked: false })]
    ];
    for (const [name, agu, nickname, details] of sampleMaterias) {
      await run(
        `INSERT INTO materias (name, agu, nickname, details) VALUES (?, ?, ?, ?)`,
        [name, agu, nickname, details]
      );
    }
  }

  const [{ count: notificacionesCount }] = await all('SELECT COUNT(*) as count FROM notificaciones');
  if (notificacionesCount === 0) {
    const today = new Date();
    const formatDate = (date) => date.toISOString().split('T')[0];
    const sampleNotificaciones = [
      [1, 'Entrega de notas', 'Recordatorio de entrega de calificaciones finales.', formatDate(today), 'actual'],
      [2, 'Reunión docente', 'Convocatoria a reunión de coordinación semanal.', formatDate(new Date(today.getTime() + 86400000)), 'actual'],
      [3, 'Notificación archivada', 'Ejemplo de notificación anterior.', formatDate(new Date(today.getTime() - 259200000)), 'anterior'],
      [4, 'Registro histórico', 'Esta notificación forma parte del registro general.', formatDate(new Date(today.getTime() - 518400000)), 'registro']
    ];
    for (const [numero, titulo, descripcion, hasta, categoria] of sampleNotificaciones) {
      await run(
        `INSERT INTO notificaciones (numero, titulo, descripcion, hasta, categoria) VALUES (?, ?, ?, ?, ?)`,
        [numero, titulo, descripcion, hasta, categoria]
      );
    }
  }
}

app.get('/api/designaciones', async (req, res) => {
  try {
    const rows = await all(
      `SELECT id, fecha, empleado, puesto, departamento, estado FROM designaciones ORDER BY date(fecha) DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener designaciones' });
  }
});

app.get('/api/historial-estudiantes', async (req, res) => {
  try {
    const rows = await all(
      `SELECT id, full_name AS fullName, repetidos, nota FROM historial_estudiantes ORDER BY full_name`
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener historial de estudiantes' });
  }
});

app.get('/api/estudiantes', async (req, res) => {
  try {
    const rows = await all(
      `SELECT id, ru, name, ci, nota, celular FROM estudiantes ORDER BY name`
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener estudiantes' });
  }
});

app.get('/api/materias', async (req, res) => {
  try {
    const rows = await all(
      `SELECT id, name, agu, nickname, details FROM materias ORDER BY name`
    );
    const parsed = rows.map((row) => ({ ...row, details: JSON.parse(row.details) }));
    res.json(parsed);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener materias' });
  }
});

app.get('/api/notificaciones', async (req, res) => {
  const { category } = req.query;
  const validCategories = ['actual', 'anterior', 'registro'];
  const filter = validCategories.includes(category) ? category : null;

  try {
    const rows = await all(
      `SELECT id, numero, titulo, descripcion, hasta, categoria FROM notificaciones ${
        filter ? 'WHERE categoria = ?' : ''
      } ORDER BY numero`,
      filter ? [filter] : []
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener notificaciones' });
  }
});

const PORT = process.env.PORT || 4000;

initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor API escuchando en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error al inicializar la base de datos', error);
    process.exit(1);
  });
