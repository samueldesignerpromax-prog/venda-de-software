const express = require('express');
const router = express.Router();
const multer = require('multer');
const softwareController = require('../controllers/softwareController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const upload = multer({ dest: 'uploads/softwares/' });

router.get('/', softwareController.listar);
router.get('/:id', softwareController.detalhar);
router.post('/', auth, admin, upload.single('arquivo'), softwareController.criar);
router.put('/:id', auth, admin, softwareController.atualizar);
router.delete('/:id', auth, admin, softwareController.deletar);

module.exports = router;
