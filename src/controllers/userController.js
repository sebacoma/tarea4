const { connectDB } = require('../models/userModel');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const createUser = async (req, res) => {
  const { nombre, apellidos, email, password } = req.body;

  if (!nombre || !apellidos || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son requeridos.' });
  }

  try {
    const db = await connectDB();
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.run(
      `INSERT INTO users (id, nombre, apellidos, email, password) VALUES (?, ?, ?, ?, ?)`,
      [uuidv4(), nombre, apellidos, email, hashedPassword]
    );

    res.status(201).json({ message: 'Usuario creado exitosamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear usuario.' });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const db = await connectDB();
    const user = await db.get(`SELECT * FROM users WHERE id = ? AND estaEliminado = 0`, [id]);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuario.' });
  }
};

// Similarmente define getUsers, updateUser, deleteUser

module.exports = { createUser, getUser };
