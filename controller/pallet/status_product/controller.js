const { db } = require("../../../db/models");
const Status = db.status_product;
const UUID = require("uuid");
const { validationResult } = require("express-validator");
const paginations = require('../../../helper/pagination')

class Controller {
    static async add(req, res) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { name } = req.body;
  
      try {
        const newStatus = await Status.create({
          id: UUID.v4(),
          name,
        });
  
        return res.status(201).json({
          message: "Status berhasil dibuat",
          data: newStatus,
        });
      } catch (error) {
        return res.status(500).json({
          message: "Terjadi kesalahan saat membuat Status",
          error: error.message,
        });
      }
    }
  
    static async list(req, res) {
        try {
            const paginatedData = await paginations(Status, req, {
                attributes: [
                  "id",
                  "name",
                ],
              });
    
          return res.status(200).json({
            message: "Data status berhasil diambil",
            data: paginatedData.data,
            pagination: paginatedData.pagination,
          });
        } catch (error) {
          return res.status(500).json({
            message: "Terjadi kesalahan saat mengambil data outlets",
            error: error.message,
          });
        }
    }


    static async edit(req, res) {
        const { id } = req.params;
        const { name } = req.body;
      
        try {
          const status = await Status.findOne({ where: { id } });
          if (!status) {
            return res.status(404).json({
              message: "Status tidak ditemukan",
            });
          }
      
          await Status.update(
            { name },
            { where: { id } } 
          );
      
          return res.status(200).json({
            message: "Status berhasil diperbarui",
            data: { id, name }, 
          });
        } catch (error) {
          return res.status(500).json({
            message: "Terjadi kesalahan",
            error: error.message,
          });
        }
    }
      

    static async all(req, res) {
        try {
          const AllData = await Status.findAll({
            attributes: [
              "id",
              "name",
            ],
          });
      
          return res.status(200).json({
            message: "Data Status berhasil diambil",
            data: AllData,
          });
        } catch (error) {
          return res.status(500).json({
            message: "Terjadi kesalahan saat mengambil data Status",
            error: error.message,
          });
        }
    }
}
  
module.exports = Controller;
  