const express = require('express');
const router = express.Router();
const Controller = require('./controller'); 
const { bodySchema, updateSchema } = require('./schema');


router.post('/', bodySchema, Controller.add);
router.get('/', Controller.list)
router.patch('/:id', updateSchema, Controller.edit)
router.get('/:id', Controller.show)
router.patch('/scan/:code', Controller.scan)
router.post('/download', Controller.download);





module.exports = router;
