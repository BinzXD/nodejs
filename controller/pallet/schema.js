const { checkSchema } = require("express-validator");
const { db } = require('../../db/models');
const { ENUM } = require("sequelize");
const Pallet = db.pallet;

exports.bodySchema = checkSchema({
  code: {
    notEmpty: {
      errorMessage: 'Code is required',
    },
    isLength: {
      options: { max: 100 },
      errorMessage: 'Code max 100 characters',
    },
    custom: {
      options: async (value) => {
        const existingOutlet = await Pallet.findOne({ where: { code: value } });
        if (existingOutlet) {
          throw new Error('Kode sudah digunakan');
        }
      },
    },
  },
  description: {
    notEmpty: {
      errorMessage: 'Description is required',
    },
    isString: {
      errorMessage: 'Description must be a string',
    },
  },
  location:{
    notEmpty:{
      errorMessage: 'Locations is required',
    },
    isString: {
      errorMessage: 'Location must be a string',
    },
  },
  status: {
    notEmpty: true,
    errorMessage: 'Status is required',
    isIn: {
      options: [['active', 'inactive']],
      errorMessage: 'Status must be active or inactive'
    }
  },
  is_used: {
    isBoolean: {
      errorMessage: 'is_available must be a boolean (true or false)',
    },
    optional:true,
    toBoolean: true, 
  },
  product_status: {
    notEmpty: true,
    errorMessage: 'product_status is required',
    isIn: {
      options: [['good', 'reject', 'pending','empty']],
      errorMessage: 'Product_Status must be good or reject or pending or empty'
    }
  },
});

exports.updateSchema = checkSchema({
  description: {
    isString: {
      errorMessage: 'Description must be a string',
    },
  },
  status: {
    errorMessage: 'Status is required',
    isIn: {
      options: [['active', 'inactive']],
      errorMessage: 'Status must be active or inactive'
    }
  }
});
