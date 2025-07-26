const express = require('express');
const fs = require('fs');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

const app = express();
app.use(express.json());

const API_KEY = 'projectwork-imhotep-001';

app.post('/api/gerar-relatorio', async (req, res) => {
  const userKey = req.headers.authorization?.split(' ')[1];
  if (userKey !== API_KEY) {
    return res.status(401).json({ error: 'Chave de API inválida' });
  }

  const { cliente, itens } = req.body;

  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const { height } = page.getSize();

    page.drawText(`Relatório Técnico – ${cliente}`, {
      x: 50,
      y: height - 80,
      size: 18,
      font,
      color: rgb(0, 0.2, 0.6)
    });

    let posY = height - 130;
    page.drawText('Checklist de verificação:', { x: 50, y: posY, size: 14, font });

    itens.forEach((item) => {
      posY -= 25;
      page.drawText(`- ${item}`, { x: 70, y: posY, size: 12, font });
    });

    posY -= 60;
    page.drawText('Assinado por Imhotep – O Engenheiro IA', {
      x: 50,
      y: posY,
      size: 10,
      font,
      color: rgb(0.5, 0.5, 0.5)
    });

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync('relatorio-validado.pdf', pdfBytes);

    res.sendFile(__dirname + '/relatorio-validado.pdf');
  } catch (err) {
    res.status(500).json({ error: 'Erro ao gerar relatório', details: err.message });
  }
});

app.listen(3000, () => {
  console.log('✅ API do Imhotep rodando na porta 3000');
});