require('dotenv').config();

const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET || 'default_secret';

console.log('El SECRET en auth.js es:', SECRET);


const generateToken = (userId) => {
  return jwt.sign({ userId }, SECRET, { expiresIn: '2m' }); 
};

// Middleware para validar el token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No autenticado.' });
  }

  jwt.verify(token, SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido.' });
    }
    req.user = user;
    next();
  });
};

module.exports = { generateToken, authenticateToken };
