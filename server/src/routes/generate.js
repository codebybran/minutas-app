const express = require('express');
const router = express.Router();
const { Document, Packer, Paragraph, TextRun, AlignmentType } = require('docx');

function generateFromTemplate(template, data) {
  let filled = template;
  Object.entries(data).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    filled = filled.replace(regex, value || '___________');
  });
  return filled;
}

function cleanTitle(title) {
  return title
    .replace(/^Modelo de /i, '')
    .replace(/^Modelo /i, '');
}

function toHTML(filledText, title) {
  const CLAUSULAS = ['PRIMERA:', 'SEGUNDA:', 'TERCERA:', 'CUARTA:', 'QUINTA:', 'SEXTA:', 'SÉPTIMA:', 'OCTAVA:', 'NOVENA:', 'DÉCIMA:', 'PRIMERA.', 'SEGUNDA.', 'TERCERA.', 'CUARTA.', 'QUINTA.', 'SEXTA.', 'SÉPTIMA.', 'OCTAVA.'];
  const FIRMAS = ['EL PROMINENTE', 'TESTIGOS', 'PROMITIENTE', 'PROMETIENTE'];

  const parrafos = filledText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => {
      const isClausula = CLAUSULAS.some(c => line.startsWith(c));
      const isFirma = FIRMAS.some(f => line.startsWith(f));
      const isLinea = line.startsWith('_');

      if (isClausula) {
        return `<p style="text-align:justify;margin:10pt 0 4pt 0;">${line}</p>`;
      }
      if (isFirma && !isLinea) {
        return `<p style="margin:20pt 0 4pt 0;">${line}</p>`;
      }
      if (isLinea) {
        return `<p style="font-family:monospace;margin:2pt 0;">${line}</p>`;
      }
      return `<p style="text-align:justify;margin:0 0 8pt 0;">${line}</p>`;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page { margin: 0; size: A4; }
    @media print {
      body { margin: 2.5cm 3cm !important; padding: 0 !important; }
      header, footer { display: none !important; }
    }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 12pt;
      line-height: 1.5;
      margin: 2.5cm 3cm;
      color: #000;
    }
    h1 {
      text-align: center;
      font-size: 14pt;
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 16pt;
    }
    p { text-align: justify; word-wrap: break-word; }
  </style>
</head>
<body>
  <h1>${cleanTitle(title)}</h1>
  ${parrafos}
</body>
</html>`;
}

async function toDocx(filledText, title) {
  const CLAUSULAS = ['PRIMERA:', 'SEGUNDA:', 'TERCERA:', 'CUARTA:', 'QUINTA:', 'SEXTA:', 'SÉPTIMA:', 'OCTAVA:', 'NOVENA:', 'DÉCIMA:', 'PRIMERA.', 'SEGUNDA.', 'TERCERA.', 'CUARTA.', 'QUINTA.', 'SEXTA.', 'SÉPTIMA.', 'OCTAVA.'];
  const FIRMAS = ['EL PROMINENTE', 'TESTIGOS', 'PROMITIENTE', 'PROMETIENTE'];

  const lines = filledText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  const paragraphs = [];

  paragraphs.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [
      new TextRun({
        text: cleanTitle(title).toUpperCase(),
        bold: true,
        size: 28,
        font: 'Times New Roman'
      })
    ]
  }));

  lines.forEach(line => {
    const isClausula = CLAUSULAS.some(c => line.startsWith(c));
    const isFirma = FIRMAS.some(f => line.startsWith(f));
    const isLinea = line.startsWith('_');

    paragraphs.push(new Paragraph({
      alignment: isLinea || isFirma ? AlignmentType.LEFT : AlignmentType.JUSTIFIED,
      spacing: {
        before: isClausula ? 200 : isFirma ? 400 : 0,
        after: isClausula ? 100 : 160
      },
      children: [
        new TextRun({
          text: line,
          size: 24,
          font: 'Times New Roman'
        })
      ]
    }));
  });

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: 1418,
            right: 1701,
            bottom: 1418,
            left: 1701
          }
        }
      },
      children: paragraphs
    }]
  });

  return await Packer.toBuffer(doc);
}

router.post('/preview', (req, res) => {
  const { template, title, data } = req.body;
  const filled = generateFromTemplate(template, data);
  const html = toHTML(filled, title);
  res.json({ html, filled });
});

router.post('/pdf', (req, res) => {
  const { template, title, data } = req.body;
  const filled = generateFromTemplate(template, data);
  const html = toHTML(filled, title);
  res.json({ html });
});

router.post('/word', async (req, res) => {
  try {
    const { template, title, data } = req.body;
    const filled = generateFromTemplate(template, data);
    const buffer = await toDocx(filled, title);
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${cleanTitle(title)}.docx"`
    });
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;