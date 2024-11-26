require('dotenv').config();

const app = require('./src/app');
const SECRET = process.env.SECRET || 'default_secret';

console.log('El SECRET es:', SECRET);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});