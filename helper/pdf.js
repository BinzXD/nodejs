const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function generatePdfFromImages(imageUrls, fileName) {
  const doc = new PDFDocument();
  const output = path.join(__dirname, '..', 'pdfs', fileName);
  const tempDir = path.join(__dirname, '..', 'temp');

  if (!fs.existsSync(path.dirname(output))) {
    fs.mkdirSync(path.dirname(output), { recursive: true });
  }
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const downloadImage = async (url, filePath) => {
    try {
      const response = await axios({
        url,
        responseType: 'stream',
      });

      return new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);
        writer.on('finish', resolve);
        writer.on('error', reject);
      });
    } catch (error) {
      console.error(`Error downloading image from URL: ${url}`, error);
      throw new Error(`Failed to download image from ${url}`);
    }
  };

  try {
    // Mengumpulkan buffer untuk PDF
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {});

    for (let i = 0; i < imageUrls.length; i++) {
      const imageUrl = imageUrls[i];

      if (imageUrl !== null) {
        const imagePath = path.join(tempDir, `image_${i}_${Date.now()}.jpg`);
        await downloadImage(imageUrl, imagePath);

        // Menambahkan halaman baru untuk setiap gambar
        doc.addPage().image(imagePath, {
          fit: [500, 500],
          align: 'center',
          valign: 'center',
        });

        // Menambahkan keterangan kode di bawah gambar
        doc.text(`Code: ${path.basename(imagePath, '.jpg')}`, {
          align: 'center',
          underline: true,
          fontSize: 12,
          baseline: 'middle',
          continued: true,
        });

        fs.unlink(imagePath, (err) => {
          if (err) console.log(`Error deleting file: ${imagePath}`);
        });
      }
    }

    doc.end();
    const pdfBuffer = Buffer.concat(buffers);

    return { file: pdfBuffer, fileName };
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF from images');
  }
}

module.exports = generatePdfFromImages;
