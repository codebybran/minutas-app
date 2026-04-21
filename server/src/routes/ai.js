const express = require('express');
const router = express.Router();

router.post('/suggest-minuta', async (req, res) => {
  const { query } = req.body;
  res.json({
    suggested: null,
    message: 'Módulo de IA próximamente disponible.',
    query: query
  });
});

router.post('/chat', async (req, res) => {
  const { message } = req.body;
  res.json({
    reply: 'El asistente legal estará disponible pronto.',
    message
  });
});

module.exports = router;