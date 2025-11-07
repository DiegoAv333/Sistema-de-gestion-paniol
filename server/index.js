import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();
app.use(cors()); // Habilita CORS para todas las rutas
app.use(express.json()); // Habilita el parseo de JSON
const port = 3001;

// Configura los detalles de la conexión a tu base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Reemplaza con tu usuario de phpMyAdmin
  password: '', // Reemplaza con tu contraseña
  database: 'gestion_paniol' // Reemplaza con el nombre de tu base de datos
});

// Conecta a la base de datos
db.connect(err => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL.');
});

app.get('/', (req, res) => {
  res.send('Servidor Express funcionando.');
});

// Ruta para obtener todos los materiales
app.get('/api/materiales', (req, res) => {
  db.query('SELECT * FROM material', (err, results) => {
    if (err) {
      res.status(500).send('Error al obtener los materiales de la base de datos');
      return;
    }
    res.json(results);
  });
});

// Ruta para crear un nuevo material
app.post('/api/materiales', (req, res) => {
  const { Nombre_Descripcion, StockActual } = req.body;
  const query = 'INSERT INTO material (Nombre_Descripcion, StockActual) VALUES (?, ?)';
  db.query(query, [Nombre_Descripcion, StockActual], (err, result) => {
    if (err) {
      res.status(500).send('Error al guardar el material en la base de datos');
      return;
    }
    const newMaterial = { Id_Material: result.insertId, Nombre_Descripcion, StockActual };
    res.status(201).json(newMaterial);
  });
});

// Ruta para eliminar un material
app.delete('/api/materiales/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM material WHERE Id_Material = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      res.status(500).send('Error al eliminar el material de la base de datos');
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).send('No se encontró el material con el ID proporcionado');
      return;
    }
    res.status(200).send('Material eliminado exitosamente');
  });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
