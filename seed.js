const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');

// Conectar a la base de datos
const db = new sqlite3.Database('./database/database.sqlite');

// Generar usuarios de ejemplo
const seedUsers = () => {
  const usuarios = [];
  for (let i = 1; i <= 100; i++) {
    usuarios.push({
      id: uuidv4(),
      nombre: `Usuario${i}`,
      apellidos: `Apellido${i}`,
      email: `usuario${i}@example.com`,
      password: `hashedPassword${i}`, // Usa bcrypt en producción para hashear
      estaEliminado: 0,
    });
  }

  return usuarios;
};

// Poblar la base de datos
db.serialize(() => {
  console.log('Iniciando la población de la base de datos...');
  
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id TEXT PRIMARY KEY,
      nombre TEXT NOT NULL CHECK(LENGTH(nombre) <= 15),
      apellidos TEXT NOT NULL CHECK(LENGTH(apellidos) <= 100),
      email TEXT NOT NULL UNIQUE CHECK(LENGTH(email) <= 100),
      password TEXT NOT NULL CHECK(LENGTH(password) <= 30),
      estaEliminado BOOLEAN NOT NULL DEFAULT 0
    )
  `);

  const stmt = db.prepare(`
    INSERT INTO usuarios (id, nombre, apellidos, email, password, estaEliminado)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const usuarios = seedUsers();
  usuarios.forEach((usuario) => {
    stmt.run(usuario.id, usuario.nombre, usuario.apellidos, usuario.email, usuario.password, usuario.estaEliminado);
  });

  stmt.finalize();
  console.log('Base de datos poblada con éxito.');
});

db.close();
