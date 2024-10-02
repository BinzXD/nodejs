const express = require('express');
const router = express.Router();
const { signup } = require('../controller/authController');


router.use('/pallets', require('../controller/pallet/index'))
router.post('/signup', signup);
router.use('/outlets', require('../controller/outlet/index'))




module.exports = router;