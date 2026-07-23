const express = require('express');
const router = express.Router();
const { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, Header, Footer, VerticalAlign } = require('docx');

function generateFromTemplate(template, data) {
  let filled = template;
  // Hecho 5 (justo titulo y buena fe) solo aparece si el usuario lo lleno
  const justoTitulo = (data.fundamento_titulo_buena_fe || '').toString().trim();
  if (justoTitulo && justoTitulo.toLowerCase() !== 'nada') {
    data = { ...data, hecho_justo_titulo_completo: '\n\n5. ' + justoTitulo };
  }
  // si esta vacio, no se agrega la clave: el placeholder queda sin reemplazar y se limpia mas abajo sin dejar rayitas
  Object.entries(data).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    // Si el valor es 'nada' o está vacío, reemplazar por cadena vacía
    const val = (!value || value.toString().trim().toLowerCase() === 'nada') ? '' : value;
    filled = filled.replace(regex, val || '___________');
  });
  // Reemplazar cualquier placeholder que haya quedado sin usar (ej: campos opcionales que el usuario no llenó)
  filled = filled.replace(/\{\{[a-zA-Z0-9_]+\}\}/g, '');
  // Limpiar líneas vacías dobles que queden después de eliminar campos
  filled = filled.replace(/\n{3,}/g, '\n\n');
  return filled;
}

function cleanTitle(title) {
  return title
    .replace(/^Modelo de /i, '')
    .replace(/^Modelo /i, '');
}


function notaLegal(tipo_tramite, categoryId) {
  if (!tipo_tramite) return ''
  const t = tipo_tramite.toLowerCase()

  // ── DERECHO ADMINISTRATIVO ──────────────────────────────────────────────────
  if (categoryId === 'derecho-administrativo') {
    return `
<div class="aviso-legal-print" style="margin-top:48pt;font-family:'Times New Roman',serif;">
  <div style="background:linear-gradient(135deg,#0d2137 0%,#1a3a5c 60%,#0d2137 100%);border-radius:8px;overflow:hidden;box-shadow:0 4px 18px rgba(0,0,0,0.18);">
    <div style="height:5px;background:linear-gradient(90deg,#1565c0,#42a5f5,#1565c0);"></div>
    <div style="padding:20px 28px 18px 28px;display:flex;align-items:flex-start;gap:20px;">
      <div style="flex-shrink:0;width:52px;height:52px;background:rgba(66,165,245,0.15);border:2px solid #42a5f5;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:24px;line-height:1;text-align:center;padding-top:4px;">
        🏛️
      </div>
      <div style="flex:1;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
          <span style="background:#42a5f5;color:#0d2137;font-size:8pt;font-weight:bold;letter-spacing:1.5px;padding:2px 10px;border-radius:20px;text-transform:uppercase;">Documento de Gestión Pública</span>
        </div>
        <p style="color:#42a5f5;font-size:12pt;font-weight:bold;margin:0 0 8px 0;letter-spacing:0.5px;">RECOMENDACIONES ANTES DE PRESENTAR</p>
        <p style="color:#c8d8e8;font-size:9.5pt;margin:0 0 6px 0;line-height:1.55;text-align:justify;">
          Este documento es una petición dirigida a una entidad pública o empresa de servicios. Para garantizar su efectividad recuerde:
        </p>
        <ul style="color:#c8d8e8;font-size:9.5pt;margin:0 0 6px 0;padding-left:18px;line-height:1.7;">
          <li>Exija <strong style="color:#fff;">sello de radicado con fecha</strong> en su copia al momento de presentarlo.</li>
          <li>La entidad tiene <strong style="color:#42a5f5;">15 días hábiles</strong> para responder (10 días para solicitudes de información).</li>
          <li>Si no recibe respuesta en el plazo legal, puede interponer <strong style="color:#fff;">acción de tutela</strong> por vulneración del derecho de petición fundamental consagrado en el artículo 23 de la Constitución Nacional.</li>
          <li>Este documento <strong style="color:#fff;">no requiere firma ante notaría</strong> ni autenticación.</li>
        </ul>
      </div>
    </div>
    <div style="background:rgba(66,165,245,0.10);border-top:1px solid rgba(66,165,245,0.25);padding:8px 28px;">
      <p style="color:rgba(200,216,232,0.6);font-size:7.5pt;margin:0;letter-spacing:0.3px;">
        LEXDOC · Documento generado con fines informativos · Naturaleza: Derecho de Petición / Queja · Colombia
      </p>
    </div>
  </div>
</div>`
  }

  // ── DERECHO CONSTITUCIONAL ──────────────────────────────────────────────────
  if (categoryId === 'derecho-constitucional') {
    return `
<div class="aviso-legal-print" style="margin-top:48pt;font-family:'Times New Roman',serif;">
  <div style="background:linear-gradient(135deg,#0d2137 0%,#1a3a5c 60%,#0d2137 100%);border-radius:8px;overflow:hidden;box-shadow:0 4px 18px rgba(0,0,0,0.18);">
    <div style="height:5px;background:linear-gradient(90deg,#4a0080,#9c27b0,#4a0080);"></div>
    <div style="padding:20px 28px 18px 28px;display:flex;align-items:flex-start;gap:20px;">
      <div style="flex-shrink:0;width:52px;height:52px;background:rgba(156,39,176,0.15);border:2px solid #9c27b0;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:24px;line-height:1;text-align:center;padding-top:4px;">
        ⚖️
      </div>
      <div style="flex:1;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
          <span style="background:#9c27b0;color:#fff;font-size:8pt;font-weight:bold;letter-spacing:1.5px;padding:2px 10px;border-radius:20px;text-transform:uppercase;">Acción Constitucional</span>
        </div>
        <p style="color:#ce93d8;font-size:12pt;font-weight:bold;margin:0 0 8px 0;letter-spacing:0.5px;">RECOMENDACIONES ANTES DE PRESENTAR</p>
        <p style="color:#c8d8e8;font-size:9.5pt;margin:0 0 6px 0;line-height:1.55;text-align:justify;">
          Este documento es una acción constitucional que puede presentar directamente ante un juez <strong style="color:#fff;">sin necesidad de abogado</strong>. Para garantizar su efectividad recuerde:
        </p>
        <ul style="color:#c8d8e8;font-size:9.5pt;margin:0 0 6px 0;padding-left:18px;line-height:1.7;">
          <li>Preséntelo ante la <strong style="color:#fff;">oficina de reparto del juzgado</strong> de su ciudad y exija sello de radicado con fecha y número en su copia.</li>
          <li>La tutela debe resolverse en <strong style="color:#ce93d8;">10 días hábiles</strong>. Si el juez no responde en ese plazo puede impugnar la decisión ante el superior jerárquico.</li>
          <li>Este documento <strong style="color:#fff;">no requiere firma ante notaría</strong> ni autenticación para ser presentado.</li>
          <li>Si la acción es de tutela y el juez la niega, tiene <strong style="color:#ce93d8;">3 días hábiles</strong> para impugnar la decisión.</li>
        </ul>
      </div>
    </div>
    <div style="background:rgba(156,39,176,0.10);border-top:1px solid rgba(156,39,176,0.25);padding:8px 28px;">
      <p style="color:rgba(200,216,232,0.6);font-size:7.5pt;margin:0;letter-spacing:0.3px;">
        LEXDOC · Documento generado con fines informativos · Naturaleza: Acción Constitucional · Colombia
      </p>
    </div>
  </div>
</div>`
  }

// ── DERECHO DE FAMILIA (minutas judiciales) ─
  if (categoryId === 'derecho-familia' && t !== 'notarial') {
    return `
<div class="aviso-legal-print" style="margin-top:48pt;font-family:'Times New Roman',serif;">
  <div style="background:linear-gradient(135deg,#0d2137 0%,#1a3a5c 60%,#0d2137 100%);border-radius:8px;overflow:hidden;box-shadow:0 4px 18px rgba(0,0,0,0.18);">
    <div style="height:5px;background:linear-gradient(90deg,#880e4f,#e91e63,#880e4f);"></div>
    <div style="padding:20px 28px 18px 28px;display:flex;align-items:flex-start;gap:20px;">
      <div style="flex-shrink:0;width:52px;height:52px;background:rgba(233,30,99,0.15);border:2px solid #e91e63;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:24px;line-height:1;text-align:center;padding-top:4px;">
        👨‍👩‍👧
      </div>
      <div style="flex:1;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
          <span style="background:#e91e63;color:#fff;font-size:8pt;font-weight:bold;letter-spacing:1.5px;padding:2px 10px;border-radius:20px;text-transform:uppercase;">Documento Judicial — Derecho de Familia</span>
        </div>
        <p style="color:#f48fb1;font-size:12pt;font-weight:bold;margin:0 0 8px 0;letter-spacing:0.5px;">RECOMENDACIONES ANTES DE PRESENTAR</p>
        <ul style="color:#c8d8e8;font-size:9.5pt;margin:0 0 6px 0;padding-left:18px;line-height:1.7;">
          <li>Preséntelo ante la <strong style="color:#fff;">oficina de reparto del Juzgado de Familia</strong> de su ciudad y exija sello de radicado con fecha y número en su copia.</li>
          <li>Los escritos judiciales deben ser presentados por un <strong style="color:#f48fb1;">abogado con tarjeta profesional vigente</strong>.</li>
          <li>Adjunte siempre el <strong style="color:#fff;">poder debidamente autenticado</strong> ante notaría o juzgado.</li>
          <li>El Defensor de Familia debe ser notificado cuando el proceso involucre menores de edad.</li>
        </ul>
      </div>
    </div>
    <div style="background:rgba(233,30,99,0.10);border-top:1px solid rgba(233,30,99,0.25);padding:8px 28px;">
      <p style="color:rgba(200,216,232,0.6);font-size:7.5pt;margin:0;letter-spacing:0.3px;">
        LEXDOC · Documento generado con fines informativos · Naturaleza: Escrito Judicial — Derecho de Familia · Colombia
      </p>
    </div>
  </div>
</div>`
  }

  // ── DERECHO PROCESAL CIVIL ──────────────────────────────────────────────────
  if (categoryId === 'derecho-procesal-civil') {
    return `
<div class="aviso-legal-print" style="margin-top:48pt;font-family:'Times New Roman',serif;">
  <div style="background:linear-gradient(135deg,#0d2137 0%,#1a3a5c 60%,#0d2137 100%);border-radius:8px;overflow:hidden;box-shadow:0 4px 18px rgba(0,0,0,0.18);">
    <div style="height:5px;background:linear-gradient(90deg,#1b5e20,#43a047,#1b5e20);"></div>
    <div style="padding:20px 28px 18px 28px;display:flex;align-items:flex-start;gap:20px;">
      <div style="flex-shrink:0;width:52px;height:52px;background:rgba(67,160,71,0.15);border:2px solid #43a047;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:24px;line-height:1;text-align:center;padding-top:4px;">
        🏛️
      </div>
      <div style="flex:1;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
          <span style="background:#43a047;color:#fff;font-size:8pt;font-weight:bold;letter-spacing:1.5px;padding:2px 10px;border-radius:20px;text-transform:uppercase;">Documento Judicial / Procesal</span>
        </div>
        <p style="color:#a5d6a7;font-size:12pt;font-weight:bold;margin:0 0 8px 0;letter-spacing:0.5px;">RECOMENDACIONES ANTES DE PRESENTAR</p>
        <p style="color:#c8d8e8;font-size:9.5pt;margin:0 0 6px 0;line-height:1.55;text-align:justify;">
          Este documento es una demanda, poder o escrito judicial que debe presentarse ante un <strong style="color:#fff;">Juzgado Civil</strong>. Para garantizar su efectividad recuerde:
        </p>
        <ul style="color:#c8d8e8;font-size:9.5pt;margin:0 0 6px 0;padding-left:18px;line-height:1.7;">
          <li>Preséntelo ante la <strong style="color:#fff;">oficina de reparto del juzgado</strong> de su ciudad y exija sello de radicado con fecha y número en su copia.</li>
          <li>Los escritos judiciales deben ser presentados por un <strong style="color:#a5d6a7;">abogado con tarjeta profesional vigente</strong>, salvo las excepciones de ley.</li>
          <li>Adjunte siempre el <strong style="color:#fff;">poder debidamente firmado y con presentación personal</strong> ante notaría o juzgado.</li>
          <li><strong style="color:#a5d6a7;">Advertencia normativa:</strong> Algunas disposiciones citadas corresponden al Código de Procedimiento Civil. Verifique con su abogado la aplicación del <strong style="color:#fff;">Código General del Proceso (Ley 1564 de 2012)</strong>, vigente actualmente en Colombia.</li>
        </ul>
      </div>
    </div>
    <div style="background:rgba(67,160,71,0.10);border-top:1px solid rgba(67,160,71,0.25);padding:8px 28px;">
      <p style="color:rgba(200,216,232,0.6);font-size:7.5pt;margin:0;letter-spacing:0.3px;">
        LEXDOC · Documento generado con fines informativos · Naturaleza: Escrito Judicial / Procesal Civil · Colombia
      </p>
    </div>
  </div>
</div>`
  }

  // ── NOTARIAL ────────────────────────────────────────────────────────────────
  if (t === 'notarial') {
    return `
<div class="aviso-legal-print" style="margin-top:48pt;font-family:'Times New Roman',serif;">
  <div style="background:linear-gradient(135deg,#0d2137 0%,#1a3a5c 60%,#0d2137 100%);border-radius:8px;overflow:hidden;box-shadow:0 4px 18px rgba(0,0,0,0.18);">
    <div style="height:5px;background:linear-gradient(90deg,#b8962e,#e2b94a,#b8962e);"></div>
    <div style="padding:20px 28px 18px 28px;display:flex;align-items:flex-start;gap:20px;">
      <div style="flex-shrink:0;width:52px;height:52px;background:rgba(184,150,46,0.15);border:2px solid #e2b94a;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:24px;line-height:1;text-align:center;padding-top:4px;">
        ⚖️
      </div>
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
    <div style="background:rgba(184,150,46,0.12);border-top:1px solid rgba(226,185,74,0.25);padding:8px 28px;">
      <p style="color:rgba(200,216,232,0.6);font-size:7.5pt;margin:0;letter-spacing:0.3px;">
        LEXDOC · Documento generado con fines informativos · Naturaleza: Minuta para Acto Notarial · Colombia
      </p>
    </div>
  </div>
</div>`
  }

  // ── PRIVADO (default) ───────────────────────────────────────────────────────
  return `
<div class="aviso-legal-print" style="margin-top:48pt;font-family:'Times New Roman',serif;">
  <div style="background:linear-gradient(135deg,#0d2137 0%,#1a3a5c 60%,#0d2137 100%);border-radius:8px;overflow:hidden;box-shadow:0 4px 18px rgba(0,0,0,0.18);">
    <div style="height:5px;background:linear-gradient(90deg,#b8962e,#e2b94a,#b8962e);"></div>
    <div style="padding:20px 28px 18px 28px;display:flex;align-items:flex-start;gap:20px;">
      <div style="flex-shrink:0;width:52px;height:52px;background:rgba(184,150,46,0.15);border:2px solid #e2b94a;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:24px;line-height:1;text-align:center;padding-top:4px;">
        🛡️
      </div>
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
    <div style="background:rgba(184,150,46,0.12);border-top:1px solid rgba(226,185,74,0.25);padding:8px 28px;">
      <p style="color:rgba(200,216,232,0.6);font-size:7.5pt;margin:0;letter-spacing:0.3px;">
        LEXDOC · Documento generado con fines informativos · Naturaleza: Documento Privado · Colombia
      </p>
    </div>
  </div>
</div>`
}

function toHTML(filledText, title, tipo_tramite, categoryId) {
  const CLAUSULAS = ['PRIMERA:', 'SEGUNDA:', 'TERCERA:', 'CUARTA:', 'QUINTA:', 'SEXTA:', 'SÉPTIMA:', 'OCTAVA:', 'NOVENA:', 'DÉCIMA:', 'PRIMERA.', 'SEGUNDA.', 'TERCERA.', 'CUARTA.', 'QUINTA.', 'SEXTA.', 'SÉPTIMA.', 'OCTAVA.', 'PRIMERO.', 'SEGUNDO.', 'TERCERO.', 'CUARTO.', 'QUINTO.', 'SEXTO.', 'SÉPTIMO.', 'OCTAVO.', 'NOVENO.'];
  const FIRMAS = ['EL PROMINENTE', 'TESTIGOS', 'PROMITIENTE', 'PROMETIENTE', 'EL VENDEDOR', 'EL COMPRADOR', 'LAS COMPARECIENTES', 'COMPARECIENTES:', 'PODERDANTE:', 'CONTRAYENTES:'];
  const ROMANOS = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX'];
  let numeroClausula = 0;
  const normalizar = s => s.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim();
  const tituloNormalizado = normalizar(cleanTitle(title));
  const parrafos = filledText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .filter((line, idx) => !(idx === 0 && line === line.toUpperCase() && line.length < 90 && !line.includes(":")))
    .map(line => {
      const isClausula = CLAUSULAS.some(c => line.startsWith(c));
      const isFirma = FIRMAS.some(f => line.startsWith(f));
      const isLinea = line.startsWith('_');
      if (isClausula) {
        const romano = ROMANOS[numeroClausula] || String(numeroClausula + 1);
        numeroClausula++;
        const m = line.match(/^([A-ZÁÉÍÓÚÑ]+[:.])\s*(.*)$/);
        const ordinal = m ? m[1] : line.split(' ')[0];
        const resto = m ? m[2] : line.slice(ordinal.length).trim();
        return `<div class="lx-clause">
      <div class="lx-clause-num">${romano}.</div>
      <div class="lx-clause-body">
        <p class="lx-clause-text"><strong>${ordinal} </strong>${resto}</p>
      </div>
    </div>`;
      }
      if (isFirma && !isLinea) {
        return `<p class="lx-firma-label">${line}</p>`;
      }
      if (isLinea) {
        return `<p class="lx-firma-linea">${line}</p>`;
      }
      return `<p class="lx-intro">${line}</p>`;
    })
    .join('\n');
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page { margin: 0; size: A4; }
    @media print {
      body { padding: 0 !important; background: #fff !important; }
      header, footer { display: none !important; }
      .aviso-legal-print { display: none !important; }
      .lx-page { box-shadow: none !important; border: none !important; max-width: none !important; margin: 0 !important; }
    }
    * { box-sizing: border-box; }
    body {
      font-family: Georgia, 'Times New Roman', Times, serif;
      background: #e9e6df;
      margin: 0;
      padding: 32px 16px;
      color: #1a1a1a;
    }
    .lx-page {
      max-width: 800px;
      margin: 0 auto;
      background: #fdfcfa;
      border: 1px solid #ddd6c8;
      padding: 44px 56px 36px;
    }
    .lx-brand { text-align: center; margin-bottom: 14pt; }
    .lx-brand-name { font-size: 24pt; letter-spacing: 10pt; color: #1a3a5c; margin: 0; }
    .lx-brand-sub { font-size: 8.5pt; letter-spacing: 3pt; color: #8a7550; margin: 4pt 0 2pt; text-transform: uppercase; }
    .lx-brand-tag { font-size: 7.5pt; letter-spacing: 2pt; color: #999; margin: 0; text-transform: uppercase; }
    .lx-hr { display: flex; align-items: center; gap: 10px; margin: 16pt 0; }
    .lx-hr::before, .lx-hr::after { content: ''; flex: 1; height: 1px; background: #ccc3ac; }
    .lx-hr span { color: #b8962e; font-size: 11pt; }
    h1 {
      text-align: center;
      font-size: 15pt;
      font-weight: normal;
      letter-spacing: 0.5pt;
      text-transform: uppercase;
      margin: 0 0 14pt 0;
      line-height: 1.45;
      color: #1a1a1a;
    }
    .lx-intro { text-align: justify; word-wrap: break-word; margin: 0 0 14pt 0; font-size: 11pt; line-height: 1.65; }
    .lx-intro strong, .lx-clause-text strong { font-weight: 700; }
    .lx-clause { display: flex; gap: 14px; margin-bottom: 13pt; align-items: flex-start; }
    .lx-clause-num { flex-shrink: 0; width: 34px; font-size: 12pt; font-weight: 700; color: #8a7550; padding-top: 1pt; white-space: nowrap; }
    .lx-clause-head { font-weight: 700; text-transform: uppercase; letter-spacing: 0.3pt; margin: 0 0 3pt 0; font-size: 10.5pt; color: #1a1a1a; }
    .lx-clause-text { text-align: justify; word-wrap: break-word; margin: 0; font-size: 10.5pt; line-height: 1.6; }
    .lx-firma-label { font-weight: 700; font-size: 10.5pt; margin: 14pt 0 2pt 0; text-transform: uppercase; }
    .lx-firma-linea { font-family: monospace; font-size: 10.5pt; margin: 2pt 0; }
    .lx-signblock { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 20pt; padding-top: 12pt; border-top: 1px solid #ddd6c8; }
    .lx-footer-diamond { text-align: center; color: #b8962e; font-size: 10pt; margin: 22pt 0 12pt; }
    .lx-footer { display: flex; justify-content: center; gap: 22px; flex-wrap: wrap; font-size: 8pt; color: #999; }
    @media screen and (max-width: 600px) {
      body { padding: 12px 6px; }
      .lx-page { padding: 22px 18px 20px; }
      .lx-brand-name { font-size: 16pt; letter-spacing: 5pt; }
      .lx-signblock { grid-template-columns: 1fr; }
      .lx-footer { flex-direction: column; gap: 4px; text-align: center; }
    }
  </style>
</head>
<body>
  <div class="lx-page">
    <div class="lx-brand">
      <p class="lx-brand-name">LEXDOC</p>
      <p class="lx-brand-sub">Generador de minutas legales</p>
      <p class="lx-brand-tag">Derecho · Claridad · Confianza</p>
    </div>
    <div class="lx-hr"><span>◆</span></div>
    <h1>${cleanTitle(title)}</h1>
    ${parrafos}
    ${notaLegal(tipo_tramite, categoryId)}
    <div class="lx-footer-diamond">◆</div>
    <div class="lx-footer">
      <span>LEXDOC · Colombia</span>
      <span>Documento generado automáticamente</span>
    </div>
  </div>
</body>
</html>`;
}
async function toDocx(filledText, title) {
  const CLAUSULAS = ['PRIMERA:', 'SEGUNDA:', 'TERCERA:', 'CUARTA:', 'QUINTA:', 'SEXTA:', 'SÉPTIMA:', 'OCTAVA:', 'NOVENA:', 'DÉCIMA:', 'PRIMERA.', 'SEGUNDA.', 'TERCERA.', 'CUARTA.', 'QUINTA.', 'SEXTA.', 'SÉPTIMA.', 'OCTAVA.', 'PRIMERO.', 'SEGUNDO.', 'TERCERO.', 'CUARTO.', 'QUINTO.'];
  const FIRMAS = ['EL PROMINENTE', 'TESTIGOS', 'PROMITIENTE', 'PROMETIENTE', 'EL VENDEDOR', 'EL COMPRADOR', 'LAS COMPARECIENTES', 'COMPARECIENTES:', 'PODERDANTE:', 'CONTRAYENTES:'];
  const ROMANOS = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX'];
  const normalizarDocx = s => s.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim();
  const tituloNormalizadoDocx = normalizarDocx(cleanTitle(title));
  const lines = filledText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .filter((line, idx) => !(idx === 0 && line === line.toUpperCase() && line.length < 90 && !line.includes(":")));
  const paragraphs = [];

  paragraphs.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 40 },
    children: [ new TextRun({ text: 'LEXDOC', bold: true, size: 40, font: 'Georgia', color: '1a3a5c', characterSpacing: 60 }) ]
  }));
  paragraphs.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 20 },
    children: [ new TextRun({ text: 'GENERADOR DE MINUTAS LEGALES', size: 15, font: 'Georgia', color: '8a7550', characterSpacing: 20 }) ]
  }));
  paragraphs.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    border: { bottom: { color: 'ccc3ac', space: 8, style: BorderStyle.SINGLE, size: 6 } },
    children: [ new TextRun({ text: 'DERECHO · CLARIDAD · CONFIANZA', size: 12, font: 'Georgia', color: '999999', characterSpacing: 15 }) ]
  }));

  paragraphs.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 280 },
    children: [ new TextRun({ text: cleanTitle(title).toUpperCase(), bold: true, size: 28, font: 'Georgia' }) ]
  }));

  let numeroClausula = 0;
  lines.forEach(line => {
    const isClausula = CLAUSULAS.some(c => line.startsWith(c));
    const isFirma = FIRMAS.some(f => line.startsWith(f));
    const isLinea = line.startsWith('_');
    if (isClausula) {
      const romano = ROMANOS[numeroClausula] || String(numeroClausula + 1);
      numeroClausula++;
      const m = line.match(/^([A-ZÁÉÍÓÚÑ]+[:.])\s*(.*)$/);
      const ordinal = m ? m[1] : line.split(" ")[0];
      const resto = m ? m[2] : line.slice(ordinal.length).trim();
      paragraphs.push(new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { before: 200, after: 120 },
        indent: { left: 340, hanging: 340 },
        children: [
          new TextRun({ text: romano + ".  ", bold: true, size: 24, font: "Georgia", color: "8a7550" }),
          new TextRun({ text: ordinal + " ", bold: true, size: 22, font: "Georgia" }),
          new TextRun({ text: resto, size: 22, font: "Georgia" })
        ]
      }));
      return;
    }
    if (isFirma && !isLinea) {
      paragraphs.push(new Paragraph({
        spacing: { before: 300, after: 60 },
        children: [ new TextRun({ text: line, bold: true, size: 22, font: 'Georgia' }) ]
      }));
      return;
    }
    paragraphs.push(new Paragraph({
      alignment: isLinea ? AlignmentType.LEFT : AlignmentType.JUSTIFIED,
      spacing: { after: isLinea ? 40 : 180 },
      children: [ new TextRun({ text: line, size: 22, font: isLinea ? 'Courier New' : 'Georgia' }) ]
    }));
  });

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: { top: 1418, right: 1701, bottom: 1418, left: 1701 }
        }
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              border: { top: { color: 'ddd6c8', space: 6, style: BorderStyle.SINGLE, size: 4 } },
              children: [ new TextRun({ text: 'LEXDOC · Colombia  ·  Documento generado automáticamente', size: 14, font: 'Georgia', color: '999999' }) ]
            })
          ]
        })
      },
      children: paragraphs
    }]
  });
  return await Packer.toBuffer(doc);
}
router.post('/preview', (req, res) => {
  const { template, title, data, tipo_tramite, categoryId } = req.body;
  const filled = generateFromTemplate(template, data);
  const html = toHTML(filled, title, tipo_tramite, categoryId);
  res.json({ html, filled });
});

router.post('/pdf', (req, res) => {
  const { template, title, data, tipo_tramite, categoryId } = req.body;
  const filled = generateFromTemplate(template, data);
  const html = toHTML(filled, title, tipo_tramite, categoryId);
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

router.post('/word-edited', async (req, res) => {
  try {
    const { editedText, title, fileName } = req.body;
    const buffer = await toDocx(editedText, title || '');
    const nombreArchivo = fileName || title || 'documento';
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${cleanTitle(nombreArchivo)}.docx"`
    });
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;