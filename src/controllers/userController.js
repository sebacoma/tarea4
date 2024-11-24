const { db } = require('../models/userModel');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/auth');


const createUser = async (req, res) => {
  console.log('Body recibido:', req.body);
  const { nombre, apellidos, email, password } = req.body;


  if (!nombre || !apellidos || !email || !password) {
    console.error('Faltan campos obligatorios.');
    return res.status(400).json({ error: 'Todos los campos son requeridos.' });
  }


  if (password.length > 30) {
    console.error('La contraseña excede los 30 caracteres permitidos.');
    return res.status(400).json({ error: 'La contraseña no puede tener más de 30 caracteres.' });
  }

  try {
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed:', hashedPassword);

    console.log('Intentando insertar usuario...');
    db.run(
      `INSERT INTO usuarios (id, nombre, apellidos, email, password) VALUES (?, ?, ?, ?, ?)`,
      [uuidv4(), nombre, apellidos, email, hashedPassword],
      (err) => {
        if (err) {
          console.error('Error al insertar usuario en la base de datos:', err.message);
          return res.status(500).json({ error: `Error al crear usuario: ${err.message}` });
        }
        console.log('Usuario insertado correctamente.');
        const token = generateToken(email);
        res.status(201).json({ message: 'Usuario creado exitosamente.', token });       
        
      }
    );
  } catch (error) {
    console.error('Error inesperado:', error.message);
    res.status(500).json({ error: 'Error al crear usuario.' });
  }
};



const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    db.get(
      `SELECT * FROM usuarios WHERE id = ? AND estaEliminado = 0`,
      [id],
      (err, user) => {
        if (err) {
          console.error('Error al obtener usuario:', err.message);
          return res.status(500).json({ error: 'Error al obtener usuario.' });
        }

        if (!user) {
          return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        res.status(200).json(user);
      }
    );
  } catch (error) {
    console.error('Error al obtener usuario:', error.message);
    res.status(500).json({ error: 'Error al obtener usuario.' });
  }
};

const getUsers = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  db.all(
    `SELECT * FROM usuarios WHERE estaEliminado = 0 LIMIT ? OFFSET ?`,
    [parseInt(limit), offset],
    (err, rows) => {
      if (err) {
        console.error('Error al obtener usuarios:', err.message);
        return res.status(500).json({ error: 'Error al obtener usuarios.' });
      }
      res.status(200).json(rows);
    }
  );
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellidos, email, password } = req.body;

  if (!nombre || !apellidos || !email) {
    return res.status(400).json({ error: 'Nombre, apellidos y email son obligatorios.' });
  }

  try {
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    const query = hashedPassword
      ? `UPDATE usuarios SET nombre = ?, apellidos = ?, email = ?, password = ? WHERE id = ?`
      : `UPDATE usuarios SET nombre = ?, apellidos = ?, email = ? WHERE id = ?`;

    const params = hashedPassword
      ? [nombre, apellidos, email, hashedPassword, id]
      : [nombre, apellidos, email, id];

    db.run(query, params, function (err) {
      if (err) {
        console.error('Error al actualizar usuario:', err.message);
        return res.status(500).json({ error: 'Error al actualizar usuario.' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }

      res.status(200).json({ message: 'Usuario actualizado correctamente.' });
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error.message);
    res.status(500).json({ error: 'Error al actualizar usuario.' });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    db.run(
      `UPDATE usuarios SET estaEliminado = 1 WHERE id = ?`,
      [id],
      function (err) {
        if (err) {
          console.error('Error al eliminar usuario:', err.message);
          return res.status(500).json({ error: 'Error al eliminar usuario.' });
        }

        if (this.changes === 0) {
          return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        res.status(200).json({ message: 'Usuario eliminado correctamente.' });
      }
    );
  } catch (error) {
    console.error('Error al eliminar usuario:', error.message);
    res.status(500).json({ error: 'Error al eliminar usuario.' });
  }
};

module.exports = { createUser, getUser, updateUser, deleteUser, getUsers };
