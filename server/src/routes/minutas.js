const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const TEMPLATES_DIR = path.join(__dirname, '../../data/templates');

router.get('/', (req, res) => {
  const categories = [];
  
  if (!fs.existsSync(TEMPLATES_DIR)) {
    return res.json([]);
  }
  
  const files = fs.readdirSync(TEMPLATES_DIR).filter(f => f.endsWith('.json'));
  
  files.forEach(file => {
    const data = JSON.parse(fs.readFileSync(path.join(TEMPLATES_DIR, file)));
    categories.push({
      id: file.replace('.json', ''),
      name: file.replace('.json', '').replace(/-/g, ' ').toUpperCase(),
      minutas: data.map(m => ({ id: m.id, title: m.title, fieldsCount: m.fields.length }))
    });
  });

  res.json(categories);
});

router.get('/:category/:id', (req, res) => {
  const { category, id } = req.params;
  const filePath = path.join(TEMPLATES_DIR, `${category}.json`);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Categoría no encontrada' });
  }
  
  const templates = JSON.parse(fs.readFileSync(filePath));
  const minuta = templates.find(m => String(m.id) === String(id));
  
  if (!minuta) return res.status(404).json({ error: 'Minuta no encontrada' });
  res.json(minuta);
});

module.exports = router;