// server.js (Reemplaza tu archivo api.txt)

import express from 'express';
// Usamos mysql2/promise para la sintaxis async/await y Pools de conexión.
import mysql from 'mysql2/promise'; 
import cors from 'cors';

const app = express();
const port = 3001; 

// ====================================================
// 1. CONFIGURACIÓN DE CONEXIÓN (Pool)
// ====================================================
// ¡IMPORTANTE! Reemplaza con tus credenciales de base de datos
const dbConfig = {
    host: 'localhost',
    user: 'root', 
    password: '', 
    database: 'gestion_paniol',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Crea un Pool de conexiones. Esto es más eficiente que db.createConnection()
const pool = mysql.createPool(dbConfig); 

// Comprueba la conexión al iniciar el servidor
(async () => {
    try {
        await pool.getConnection();
        console.log('✅ Conectado a la base de datos MySQL.');
    } catch (err) {
        console.error('❌ Error al conectar a la base de datos:', err);
    }
})();

// ====================================================
// 2. MIDDLEWARES
// ====================================================
app.use(cors()); 
app.use(express.json()); 


// ====================================================
// 3. RUTAS API (Actualizadas con async/await y Pool)
// ====================================================

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor Express funcionando.');
});

// ----------------------------------------------------
// RUTAS DE INVENTARIO Y ESTADO DINÁMICO
// ----------------------------------------------------

/**
 * RUTA CLAVE: Obtiene el estado dinámico de los materiales para un Taller y Rotación específicos.
 * Consulta la VISTA v_dashboard_paniol creada en el SQL.
 * EJEMPLO: GET http://localhost:3001/api/inventario/estado/1/1
 */
app.get('/api/inventario/estado/:idTaller/:idRotacion', async (req, res) => {
    const { idTaller, idRotacion } = req.params;

    const query = `
        SELECT 
            Id_Material,
            Nombre_Descripcion,
            StockActual,
            Requerimiento,
            Balance_Numerico,
            Estado  /* ESTE CAMPO ES DINÁMICO */
        FROM v_dashboard_paniol 
        WHERE Id_Taller = ? AND Id_Rotacion = ?
    `;

    try {
        // pool.query usa el método promisificado
        const [resultados] = await pool.query(query, [idTaller, idRotacion]);

        if (resultados.length === 0) {
            // Se puede devolver un 200 con array vacío, o un 404 si es estricto
            return res.json([]); 
        }

        res.json(resultados);

    } catch (error) {
        console.error('Error al obtener el estado del inventario:', error);
        res.status(500).json({ mensaje: "Error interno del servidor al obtener el inventario." });
    }
});


// ----------------------------------------------------
// RUTAS DE MATERIALES (CRUD)
// ----------------------------------------------------

// Ruta para obtener todos los materiales
app.get('/api/materiales', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM material');
    res.json(results);
  } catch (err) {
    console.error('Error al obtener materiales:', err);
    res.status(500).send('Error al obtener los materiales de la base de datos');
  }
});

// Ruta para crear un nuevo material
app.post('/api/materiales', async (req, res) => {
  const { Nombre_Descripcion, StockActual } = req.body;
  const query = 'INSERT INTO material (Nombre_Descripcion, StockActual) VALUES (?, ?)';
  try {
    const [result] = await pool.query(query, [Nombre_Descripcion, StockActual]);
    const newMaterial = { Id_Material: result.insertId, Nombre_Descripcion, StockActual };
    res.status(201).json(newMaterial);
  } catch (err) {
    console.error('Error al crear material:', err);
    res.status(500).send('Error al guardar el material en la base de datos');
  }
});

// Ruta para eliminar un material
app.delete('/api/materiales/:id', async (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM material WHERE Id_Material = ?';
  try {
    const [result] = await pool.query(query, [id]);
    if (result.affectedRows === 0) {
      res.status(404).send('No se encontró el material con el ID proporcionado');
      return;
    }
    res.status(200).send('Material eliminado exitosamente');
  } catch (err) {
    console.error('Error al eliminar material:', err);
    res.status(500).send('Error al eliminar el material de la base de datos');
  }
});


// ----------------------------------------------------
// RUTAS DE TALLERES Y DOCENTES (CRUD)
// ----------------------------------------------------

// Ruta para obtener todos los talleres
app.get('/api/talleres', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM taller');
    res.json(results);
  } catch (err) {
    console.error('Error al obtener talleres:', err);
    res.status(500).send('Error al obtener los talleres de la base de datos');
  }
});

// Ruta para obtener todos los docentes
app.get('/api/docentes', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM docente');
    res.json(results);
  } catch (err) {
    console.error('Error al obtener docentes:', err);
    res.status(500).send('Error al obtener los docentes de la base de datos');
  }
});

// Ruta para crear un nuevo docente
app.post('/api/docentes', async (req, res) => {
  const { Nombre, Apellido, Email, Id_Taller } = req.body;
  const query = 'INSERT INTO docente (Nombre, Apellido, Email, Id_Taller) VALUES (?, ?, ?, ?)';
  try {
    const [result] = await pool.query(query, [Nombre, Apellido, Email, Id_Taller]);
    const newTeacher = { Id_Docente: result.insertId, Nombre, Apellido, Email, Id_Taller };
    res.status(201).json(newTeacher);
  } catch (err) {
    console.error('Error al crear docente:', err);
    res.status(500).send('Error al guardar el docente en la base de datos');
  }
});

// Ruta para actualizar un docente
app.put('/api/docentes/:id', async (req, res) => {
  const { id } = req.params;
  const { Nombre, Apellido, Email, Id_Taller } = req.body;
  const query = 'UPDATE docente SET Nombre = ?, Apellido = ?, Email = ?, Id_Taller = ? WHERE Id_Docente = ?';
  try {
    const [result] = await pool.query(query, [Nombre, Apellido, Email, Id_Taller, id]);
    if (result.affectedRows === 0) {
      res.status(404).send('No se encontró el docente con el ID proporcionado');
      return;
    }
    res.status(200).send('Docente actualizado exitosamente');
  } catch (err) {
    console.error('Error al actualizar docente:', err);
    res.status(500).send('Error al actualizar el docente en la base de datos');
  }
});

// Ruta para eliminar un docente
app.delete('/api/docentes/:id', async (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM docente WHERE Id_Docente = ?';
  try {
    const [result] = await pool.query(query, [id]);
    if (result.affectedRows === 0) {
      res.status(404).send('No se encontró el docente con el ID proporcionado');
      return;
    }
    res.status(200).send('Docente eliminado exitosamente');
  } catch (err) {
    console.error('Error al eliminar docente:', err);
    res.status(500).send('Error al eliminar el docente de la base de datos');
  }
});

// ----------------------------------------------------
// RUTA DE REPORTES
// ----------------------------------------------------
app.get('/api/reportes', async (req, res) => {
  const query = `
    SELECT
        mov.Id_Movimiento as id,
        mov.Id_Material as materialId,
        m.Nombre_Descripcion AS material,
        mov.Tipo AS tipo,
        mov.Cantidad AS cantidad,
        t.Denominacion AS departamento,
        CONCAT(d.Nombre, ' ', d.Apellido) AS responsable,
        mov.Observacion AS observacion,
        mov.Fecha AS fecha
    FROM movimiento mov
    JOIN material m ON mov.Id_Material = m.Id_Material
    LEFT JOIN taller t ON mov.Id_Taller = t.Id_Taller
    LEFT JOIN docente d ON mov.Id_Docente = d.Id_Docente
    ORDER BY mov.Fecha DESC
  `;
  try {
    const [results] = await pool.query(query);
    res.json(results);
  } catch (err) {
    console.error('Error al obtener reportes:', err);
    res.status(500).send('Error al obtener los reportes de la base de datos');
  }
});

// ----------------------------------------------------
// RUTA DE MOVIMIENTOS
// ----------------------------------------------------
app.post('/api/movimientos', async (req, res) => {
    const { materialId, movementType, quantity, idTaller, idDocente, observations } = req.body;
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Insertar en la tabla de movimientos
        const insertMovementQuery = `
            INSERT INTO movimiento (Id_Material, Tipo, Cantidad, Id_Taller, Id_Docente, Observacion, Fecha)
            VALUES (?, ?, ?, ?, ?, ?, NOW())
        `;
        const [movementResult] = await connection.query(insertMovementQuery, [
            materialId,
            movementType,
            quantity,
            idTaller, // Puede ser null para ingresos
            idDocente, // Puede ser null para ingresos
            observations
        ]);
        const newMovementId = movementResult.insertId;

        // 2. Actualizar el stock en la tabla de materiales
        const updateStockQuery = `
            UPDATE material
            SET StockActual = StockActual ${movementType === 'Ingreso' ? '+' : '-'} ?
            WHERE Id_Material = ?
        `;
        await connection.query(updateStockQuery, [quantity, materialId]);

        // 3. Si es un Egreso, actualizar el requerimiento en la tabla de planificación
        if (movementType === 'Egreso' && idTaller) {
            // Buscar la rotación activa
            const [rotations] = await connection.query(
                'SELECT Id_Rotacion FROM rotacion WHERE CURDATE() BETWEEN Inicio AND Final LIMIT 1'
            );

            if (rotations.length > 0) {
                const idRotacion = rotations[0].Id_Rotacion;

                // Insertar o actualizar el requerimiento.
                // Si la combinación de taller, rotación y material ya existe, suma la cantidad al requerimiento.
                // Si no existe, inserta un nuevo registro.
                const updateRequirementQuery = `
                    INSERT INTO materialxrotacionxtaller (Id_Taller, Id_Rotacion, Id_Material, Fecha, Requerimiento)
                    VALUES (?, ?, ?, CURDATE(), ?)
                    ON DUPLICATE KEY UPDATE Requerimiento = Requerimiento + VALUES(Requerimiento), Fecha = CURDATE()
                `;
                await connection.query(updateRequirementQuery, [idTaller, idRotacion, materialId, quantity]);
            }
        }
        
        // 4. Confirmar la transacción
        await connection.commit();

        res.status(201).json({
            id: newMovementId,
            message: 'Movimiento registrado y stock actualizado correctamente.'
        });

    } catch (error) {
        await connection.rollback();
        console.error('Error al registrar movimiento:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor al registrar el movimiento.' });
    } finally {
        connection.release();
    }
});



// ====================================================
// 4. INICIAR EL SERVIDOR
// ====================================================
app.listen(port, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${port}`);
});