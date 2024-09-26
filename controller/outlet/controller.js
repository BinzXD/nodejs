const { db } = require("../../db/models");
const Outlet = db.outlet;
const UUID = require("uuid");
const { validationResult } = require("express-validator");
const paginations = require("../../helper/pagination")

class Controller {
  static async add(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { code, name, description, franchise,  is_active,  adress } = req.body;

    try {
      const newOutlet = await Outlet.create({
        id: UUID.v4(),
        code,
        name,
        franchise,
        adress,
        description,
        is_active,
      });
      return res.status(201).json({
        message: "Oulet berhasil dibuat",
        data: newOutlet,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Terjadi kesalahan saat membuat outlet",
        error: error.message,
      });
    }
  }

  static async list(req, res) {
    try {
        const status = req.query.status || null
        const paginatedData = await paginations(Outlet, req, {
            attributes: [
              "id",
              "code",
              "name",
              "franchise",
              "description",
              "adress",
              "is_active",
            ],
          });

      return res.status(200).json({
        message: "Data outlets berhasil diambil",
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
    const { code, name, franchise, description, adress, is_active } = req.body;

  try {
    const outlet = await Outlet.findOne({ where: { id } });
    if (!outlet) {
      return res.status(404).json({
        message: "Outlet tidak ditemukan",
      });
    }

    const dataUpdate = await outlet.update({
      code,
      name,
      franchise,
      description,
      adress,
      is_active,
    });
    return res.status(200).json({
      message: "Outlet berhasil diperbarui",
      data: dataUpdate
    });
  } catch (error) {
    return res.status(500).json({
      message: "something wrong",
      error: error.message,
    });
  }

  }
}

module.exports = Controller;
