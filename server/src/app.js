const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/minutas', require('./routes/minutas'));
app.use('/api/generate', require('./routes/generate'));
app.use('/api', require('./routes/ai'));

app.listen(3001, () => {
  console.log('Servidor corriendo en http://localhost:3001');
});