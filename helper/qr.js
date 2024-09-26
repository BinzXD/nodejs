const QRCode = require('qrcode')

const generateQR = async (text) => {
  try {
    const url = await QRCode.toDataURL(text)
    return url
  } catch (err) {
    throw err
  }
}

module.exports = { generateQR }

// const QRCode = require('qrcode');

// module.exports = {
//   async generateQR(data) {
//     try {
//       const buffer = await QRCode.toBuffer(data, { type: 'png' });
//       return buffer;
//     } catch (error) {
//       throw new Error('Gagal menghasilkan QR code');
//     }
//   }
// };

