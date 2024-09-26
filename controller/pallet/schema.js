const { checkSchema } = require("express-validator");
const { db } = require('../../db/models');
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
  is_active: {
    isBoolean: {
      errorMessage: 'is_active must be a boolean (true or false)',
    },
    toBoolean: true, 
  },
  is_available: {
    isBoolean: {
      errorMessage: 'is_available must be a boolean (true or false)',
    },
    optional: true,
    toBoolean: true, 
  },
  status_product: {
    notEmpty: {
      errorMessage: 'Status Product is required',
    },
    isUUID: {
      errorMessage: 'Status Product must be a valid UUID',
    },
  },
});

exports.updateSchema = checkSchema({
  description: {
    isString: {
      errorMessage: 'Description must be a string',
    },
  },
  is_active: {
    isBoolean: {
      errorMessage: 'is_active must be a boolean (true or false)',
    },
    toBoolean: true, 
  },
});
