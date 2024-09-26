const { checkSchema } = require("express-validator");
const { db } = require('../../db/models');
const Outlet = db.outlet;

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
        const existingOutlet = await Outlet.findOne({ where: { code: value } });
        if (existingOutlet) {
          throw new Error('Kode sudah digunakan');
        }
      },
    },
  },
  name: {
    notEmpty:{
        errorMessage: 'Name is required'
    },
    isLength:{
        options: {max: 100},
        errorMessage: 'Name max 100 character',
    },

  },
  franchise: {
    notEmpty: {
      errorMessage: 'Franchise is required',
    },
    isBoolean: {
      errorMessage: 'Franchise must be a boolean (true or false)',
    },
    toBoolean: true, 
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
    notEmpty: {
      errorMessage: 'is_active is required',
    },
    isBoolean: {
      errorMessage: 'is_active must be a boolean (true or false)',
    },
    toBoolean: true, 
  },
  adress: {
    notEmpty: {
      errorMessage: 'Adress is required',
    },
    isString: {
      errorMessage: 'Adress must be a string',
    },
  },
});


exports.updateSchema = checkSchema({
  code: {
    isLength: {
      options: { max: 100 },
      errorMessage: 'Code max 100 characters',
    },
    custom: {
      options: async (value) => {
        const existingOutlet = await Outlet.findOne({ where: { code: value } });
        if (existingOutlet) {
          throw new Error('Kode sudah digunakan');
        }
      },
    },
  },
  name: {
    isLength:{
        options: {max: 100},
        errorMessage: 'Name max 100 character',
    },

  },
  franchise: {
    isBoolean: {
      errorMessage: 'Franchise must be a boolean (true or false)',
    },
    toBoolean: true, 
  },
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
  adress: {
    isString: {
      errorMessage: 'Adress must be a string',
    },
  },
});
