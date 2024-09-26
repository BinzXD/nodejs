const {db} = require('../../../db/models')
const Status = db.status_product
const { checkSchema } = require("express-validator");


exports.bodySchema = checkSchema({
    name: {
      notEmpty: {
        errorMessage: 'Name is required',
      },
      isLength: {
        options: { max: 100 },
        errorMessage: 'Name max 100 characters',
      },
      custom: {
        options: async (value) => {
          const existingOutlet = await Status.findOne({ where: { name: value } });
          if (existingOutlet) {
            throw new Error('name sudah digunakan');
          }
        },
      },
    },
  });
  
  exports.updateSchema = checkSchema({
    name: {
        isLength: {
          options: { max: 100 },
          errorMessage: 'Name max 100 characters',
        },
        custom: {
          options: async (value) => {
            const existingOutlet = await Status.findOne({ where: { name: value } });
            if (existingOutlet) {
              throw new Error('name sudah digunakan');
            }
          },
        },
    },
  });
  