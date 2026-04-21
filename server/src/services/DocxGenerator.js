class DocxGenerator {

  generateFromTemplate(template, data) {
    let filled = template;
    Object.entries(data).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      filled = filled.replace(regex, value || '___________');
    });
    return filled;
  }

  toHTML(filledText, title) {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 12pt;
      line-height: 1.8;
      margin: 2.5cm 3cm 2.5cm 3cm;
      color: #000;
    }
    h1 {
      text-align: center;
      font-size: 14pt;
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 24pt;
    }
    p { text-align: justify; margin-bottom: 12pt; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  ${filledText.split('\n').map(line =>
    line.trim() ? `<p>${line}</p>` : ''
  ).join('\n')}
</body>
</html>`;
  }
}

module.exports = new DocxGenerator();