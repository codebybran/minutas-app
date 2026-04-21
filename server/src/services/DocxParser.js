const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

class DocxParser {

  async extractHTML(filePath) {
    const result = await mammoth.convertToHtml({ path: filePath });
    return result.value;
  }

  splitMinutasFromHTML(html) {
    const minutas = [];
    let minutaIndex = 1;

    // Detectar títulos por etiquetas HTML: <strong>, <u>, <h1>, <h2>, <h3>
    const titleRegex = /<(?:h[1-6]|p)[^>]*>(?:<strong>|<u>|<b>)([^<]{10,200})(?:<\/strong>|<\/u>|<\/b>)/gi;
    const parts = html.split(titleRegex);

    for (let i = 1; i < parts.length; i += 2) {
      const title = parts[i].trim().replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');
      const content = parts[i + 1] || '';

      if (title.length > 10 && content.length > 50) {
        minutas.push({
          id: minutaIndex++,
          title: title,
          content: content
        });
      }
    }

    return minutas;
  }

  extractVariablesFromHTML(html) {
    const variables = new Set();
    let processedText = html
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .trim();

    let catchAllIndex = 1;
    const dotsRegex = /\.{3,}|\({2,}\)|_{4,}/g;
    processedText = processedText.replace(dotsRegex, () => {
      const varName = `campo_${catchAllIndex++}`;
      variables.add(varName);
      return `{{${varName}}}`;
    });

    return { processedText, variables: Array.from(variables) };
  }

  humanizeLabel(varName) {
    const map = {
      nombre_completo: 'Nombre completo',
      cedula: 'Cédula de ciudadanía',
      ciudad: 'Ciudad',
      direccion: 'Dirección',
      telefono: 'Teléfono',
      valor: 'Valor (COP)',
    };
    return map[varName] || varName.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  inferFieldType(varName) {
    if (varName === 'valor') return 'number';
    if (varName === 'email') return 'email';
    return 'text';
  }

  minutaToJSON(minuta) {
    const { processedText, variables } = this.extractVariablesFromHTML(minuta.content);

    return {
      id: minuta.id,
      title: minuta.title,
      template: processedText,
      fields: variables.map(varName => ({
        name: varName,
        label: this.humanizeLabel(varName),
        type: this.inferFieldType(varName),
        required: true
      }))
    };
  }

  async processFile(filePath, outputDir) {
    const html = await this.extractHTML(filePath);
    const minutas = this.splitMinutasFromHTML(html);
    const templates = minutas.map(m => this.minutaToJSON(m));

    const outputPath = path.join(outputDir, path.basename(filePath, '.docx') + '.json');
    fs.writeFileSync(outputPath, JSON.stringify(templates, null, 2));

    console.log(`Procesadas ${templates.length} minutas`);
    return templates;
  }
}

module.exports = new DocxParser();