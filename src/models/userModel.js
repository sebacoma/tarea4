const sqlite3 = require('sqlite3').verbose();
const path = require('path');


const dbPath = path.resolve(__dirname, '../../database/database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
  } else {
    console.log('Conexión a la base de datos exitosa.');
  }
});


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

module.exports = { db };
