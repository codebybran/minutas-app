const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/minutas', require('./routes/minutas'));
app.use('/api/generate', require('./routes/generate'));
app.use('/api', require('./routes/ai'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log('Servidor corriendo en el puerto ' + PORT);
});