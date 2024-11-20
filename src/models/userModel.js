const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/database.sqlite');

// Crea la tabla de usuarios si no existe
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

async function connectDB() {
  const db = await open({
    filename: './database/database.sqlite',
    driver: sqlite3.Database,
  });
  return db;
}

module.exports = { connectDB };
