const express = require('express');
const router = express.Router();
const { Document, Packer, Paragraph, TextRun, AlignmentType } = require('docx');

function generateFromTemplate(template, data) {
  let filled = template;
  Object.entries(data).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    // Si el valor es 'nada' o está vacío, reemplazar por cadena vacía
    const val = (!value || value.toString().trim().toLowerCase() === 'nada') ? '' : value;
    filled = filled.replace(regex, val || '___________');
  });
  // Limpiar líneas vacías dobles que queden después de eliminar campos
  filled = filled.replace(/\n{3,}/g, '\n\n');
  return filled;
}

function cleanTitle(title) {
  return title
    .replace(/^Modelo de /i, '')
    .replace(/^Modelo /i, '');
}


function notaLegal(tipo_tramite) {
  if (!tipo_tramite) return ''
  const t = tipo_tramite.toLowerCase()

  if (t === 'notarial') {
    return `
<div style="margin-top:48pt;font-family:'Times New Roman',serif;">
  <div style="background:linear-gradient(135deg,#0d2137 0%,#1a3a5c 60%,#0d2137 100%);border-radius:8px;overflow:hidden;box-shadow:0 4px 18px rgba(0,0,0,0.18);">
    <!-- Franja dorada superior -->
    <div style="height:5px;background:linear-gradient(90deg,#b8962e,#e2b94a,#b8962e);"></div>
    <!-- Contenido principal -->
    <div style="padding:20px 28px 18px 28px;display:flex;align-items:flex-start;gap:20px;">
      <!-- Ícono -->
      <div style="flex-shrink:0;width:52px;height:52px;background:rgba(184,150,46,0.15);border:2px solid #e2b94a;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:24px;line-height:1;text-align:center;padding-top:4px;">
        ⚖️
      </div>
      <!-- Texto -->
      <div style="flex:1;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
          <span style="background:#e2b94a;color:#0d2137;font-size:8pt;font-weight:bold;letter-spacing:1.5px;padding:2px 10px;border-radius:20px;text-transform:uppercase;">Acto Notarial Obligatorio</span>
        </div>
        <p style="color:#e2b94a;font-size:12pt;font-weight:bold;margin:0 0 8px 0;letter-spacing:0.5px;">ADVERTENCIA DE FORMALIDAD OBLIGATORIA</p>
        <p style="color:#c8d8e8;font-size:9.5pt;margin:0 0 6px 0;line-height:1.55;text-align:justify;">
          Este documento es una <strong style="color:#e2b94a;">minuta base</strong> que <strong style="color:#fff;">DEBE ser elevada a Escritura Pública</strong> en Notaría para tener validez legal. La simple firma de este papel <strong style="color:#fff;">no perfecciona el contrato</strong>.
        </p>
        <p style="color:#c8d8e8;font-size:9.5pt;margin:0;line-height:1.55;text-align:justify;">
          Si el acto involucra bienes inmuebles, recuerde que también es obligatorio <strong style="color:#e2b94a;">registrar la escritura en la Oficina de Instrumentos Públicos</strong>.
        </p>
      </div>
    </div>
    <!-- Franja dorada inferior con texto legal -->
    <div style="background:rgba(184,150,46,0.12);border-top:1px solid rgba(226,185,74,0.25);padding:8px 28px;">
      <p style="color:rgba(200,216,232,0.6);font-size:7.5pt;margin:0;letter-spacing:0.3px;">
        LEXDOC · Documento generado con fines informativos · Naturaleza: Minuta para Acto Notarial · Colombia
      </p>
    </div>
  </div>
</div>`
  }

  // Privado (default)
  return `
<div style="margin-top:48pt;font-family:'Times New Roman',serif;">
  <div style="background:linear-gradient(135deg,#0d2137 0%,#1a3a5c 60%,#0d2137 100%);border-radius:8px;overflow:hidden;box-shadow:0 4px 18px rgba(0,0,0,0.18);">
    <!-- Franja dorada superior -->
    <div style="height:5px;background:linear-gradient(90deg,#b8962e,#e2b94a,#b8962e);"></div>
    <!-- Contenido principal -->
    <div style="padding:20px 28px 18px 28px;display:flex;align-items:flex-start;gap:20px;">
      <!-- Ícono -->
      <div style="flex-shrink:0;width:52px;height:52px;background:rgba(184,150,46,0.15);border:2px solid #e2b94a;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:24px;line-height:1;text-align:center;padding-top:4px;">
        🛡️
      </div>
      <!-- Texto -->
      <div style="flex:1;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
          <span style="background:#e2b94a;color:#0d2137;font-size:8pt;font-weight:bold;letter-spacing:1.5px;padding:2px 10px;border-radius:20px;text-transform:uppercase;">Documento Privado</span>
        </div>
        <p style="color:#e2b94a;font-size:12pt;font-weight:bold;margin:0 0 8px 0;letter-spacing:0.5px;">RECOMENDACIÓN DE SEGURIDAD JURÍDICA</p>
        <p style="color:#c8d8e8;font-size:9.5pt;margin:0 0 6px 0;line-height:1.55;text-align:justify;">
          Para garantizar la autenticidad de este documento y facilitar su cobro o reclamación ante un Juez, se recomienda que las partes realicen el <strong style="color:#e2b94a;">Reconocimiento de Firma y Contenido (Autenticación)</strong> en cualquier Notaría.
        </p>
        <p style="color:#c8d8e8;font-size:9.5pt;margin:0;line-height:1.55;text-align:justify;">
          Este trámite evita que la firma sea negada en el futuro y le otorga <strong style="color:#fff;">mérito ejecutivo</strong> al contrato sin necesidad de elevarlo a escritura pública.
        </p>
      </div>
    </div>
    <!-- Franja dorada inferior con texto legal -->
    <div style="background:rgba(184,150,46,0.12);border-top:1px solid rgba(226,185,74,0.25);padding:8px 28px;">
      <p style="color:rgba(200,216,232,0.6);font-size:7.5pt;margin:0;letter-spacing:0.3px;">
        LEXDOC · Documento generado con fines informativos · Naturaleza: Documento Privado · Colombia
      </p>
    </div>
  </div>
</div>`
}

function toHTML(filledText, title, tipo_tramite) {
  const CLAUSULAS = ['PRIMERA:', 'SEGUNDA:', 'TERCERA:', 'CUARTA:', 'QUINTA:', 'SEXTA:', 'SÉPTIMA:', 'OCTAVA:', 'NOVENA:', 'DÉCIMA:', 'PRIMERA.', 'SEGUNDA.', 'TERCERA.', 'CUARTA.', 'QUINTA.', 'SEXTA.', 'SÉPTIMA.', 'OCTAVA.', 'PRIMERO.', 'SEGUNDO.', 'TERCERO.', 'CUARTO.', 'QUINTO.', 'SEXTO.', 'SÉPTIMO.', 'OCTAVO.', 'NOVENO.'];
  const FIRMAS = ['EL PROMINENTE', 'TESTIGOS', 'PROMITIENTE', 'PROMETIENTE', 'EL VENDEDOR', 'EL COMPRADOR', 'LAS COMPARECIENTES', 'COMPARECIENTES:', 'PODERDANTE:', 'CONTRAYENTES:'];

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
  ${notaLegal(tipo_tramite)}
</body>
</html>`;
}

async function toDocx(filledText, title) {
  const CLAUSULAS = ['PRIMERA:', 'SEGUNDA:', 'TERCERA:', 'CUARTA:', 'QUINTA:', 'SEXTA:', 'SÉPTIMA:', 'OCTAVA:', 'NOVENA:', 'DÉCIMA:', 'PRIMERA.', 'SEGUNDA.', 'TERCERA.', 'CUARTA.', 'QUINTA.', 'SEXTA.', 'SÉPTIMA.', 'OCTAVA.', 'PRIMERO.', 'SEGUNDO.', 'TERCERO.', 'CUARTO.', 'QUINTO.'];
  const FIRMAS = ['EL PROMINENTE', 'TESTIGOS', 'PROMITIENTE', 'PROMETIENTE', 'EL VENDEDOR', 'EL COMPRADOR', 'LAS COMPARECIENTES', 'COMPARECIENTES:', 'PODERDANTE:', 'CONTRAYENTES:'];

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
          margin: { top: 1418, right: 1701, bottom: 1418, left: 1701 }
        }
      },
      children: paragraphs
    }]
  });

  return await Packer.toBuffer(doc);
}

router.post('/preview', (req, res) => {
  const { template, title, data, tipo_tramite } = req.body;
  const filled = generateFromTemplate(template, data);
  const html = toHTML(filled, title, tipo_tramite);
  res.json({ html, filled });
});

router.post('/pdf', (req, res) => {
  const { template, title, data, tipo_tramite } = req.body;
  const filled = generateFromTemplate(template, data);
  const html = toHTML(filled, title, tipo_tramite);
  res.json({ html });
});

router.post('/word', async (req, res) => {
  try {
    const { template, title, data, tipo_tramite } = req.body;
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