const { db } = require("../../db/models");
const Pallet = db.pallet;
const StatusProduct = db.status_product;
const UUID = require("uuid");
const { validationResult } = require("express-validator");
const paginations = require("../../helper/pagination");
const QR = require('../../helper/qr');
const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');
const { send } = require("process");



class Controller {
  static async add(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { code, description, is_active, status_product } = req.body;
    const is_available =
      req.body.is_available !== undefined ? req.body.is_available : true;

    try {
      const newPallet = await Pallet.create({
        id: UUID.v4(),
        code,
        description,
        is_available,
        status_product,
        is_active,
      });

      const value = { code: newPallet.code };
      const valJson = JSON.stringify(value);
      const qr = await QR.generateQR(valJson);

      newPallet.qr = qr;
      await newPallet.save();

      return res.status(201).json({
        message: "Pallet berhasil dibuat",
        data: newPallet,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Terjadi kesalahan saat membuat pallet",
        error: error.message,
      });
    }
  }

  static async list(req, res) {
    try {
      const status = req.query.status || null;
      const paginatedData = await paginations(Pallet, req, {
        attributes: [
          "id",
          "code",
          "description",
          "is_available",
          "is_active",
          "status_product",
          "qr"
        ],
        order: [['createdAt', 'DESC']]
        // include: [{
        //   model: StatusProduct,
        //   as: 'status',
        //   attributes: ['id', 'name'],
        // }],
      });

      return res.status(200).json({
        message: "Data Pallets berhasil diambil",
        data: paginatedData.data,
        pagination: paginatedData.pagination,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Terjadi kesalahan saat mengambil data pallets",
        error: error.message,
      });
    }
  }

  static async edit(req, res) {
    const { id } = req.params;
    const { description, is_active } = req.body;

    try {
      const pallet = await Pallet.findOne({ where: { id } });
      if (!pallet) {
        return res.status(404).json({
          message: "Pallet tidak ditemukan",
        });
      }

      const dataUpdate = await Pallet.update(
        {
          description,
          is_active,
        },
        {
          where: { id },
        }
      );
      return res.status(200).json({
        message: "Pallet berhasil diperbarui",
        data: dataUpdate,
      });
    } catch (error) {
      return res.status(500).json({
        message: "something wrong",
        error: error.message,
      });
    }
  }


  static async show(req, res) {
    const { id } = req.params; 
  
    try {
      const pallet = await Pallet.findOne({
        where: { id },
        attributes: [
          "id",
          "code",
          "description",
          "is_available",
          "is_active",
          "status_product",
          "qr"
        ],
      });
  
      if (!pallet) {
        return res.status(404).json({
          message: "Pallet tidak ditemukan",
        });
      }
      return res.status(200).json({
        message: "Pallet berhasil ditemukan",
        data: pallet,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Terjadi kesalahan saat mengambil data pallet",
        error: error.message,
      });
    }
  }

  static async scan(req, res) {
    const { code } = req.params; 

    try {
      const pallet = await Pallet.findOne({ where: { code } });
      if (!pallet) {
        return res.status(404).json({
          message: "Pallet tidak ditemukan",
        });
      }

      pallet.is_available = false;
      await pallet.save();

      return res.status(200).json({
        message: "Pallet berhasil di-scan ",
        data: pallet,
      });
      
    } catch (error) {
      return res.status(500).json({
        message: "Terjadi kesalahan saat memproses scan",
        error: error.message,
      });
    }
  }
  

  static async download(req, res) {
    try {
      const { ids } = req.body; 
      const pallets = await Pallet.findAll({
        where: {
          id: ids,
          is_active: true,
        },
      });
  
      if (!pallets.length) {
        return res.status(404).json({
          message: "Tidak ada pallet aktif yang ditemukan untuk ID yang diberikan",
        });
      }
  
      const zip = new JSZip(); 
  
      for (const pallet of pallets) {
        if (pallet.qr) {
          // Decode base64 QR code dan simpan ke dalam buffer
          const buffer = Buffer.from(pallet.qr.split(',')[1], 'base64');
          
     
          zip.file(`${pallet.code}.png`, buffer);
        }
      }
  
      
      const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
      const zipFileName = 'qrcodes.zip';
  
     
      res.set({
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${zipFileName}"`,
      });
  
    
      return res.send(zipBuffer);
      
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Terjadi kesalahan saat mengunduh gambar",
        error: error.message,
      });
    }
  }
  
}

module.exports = Controller;
