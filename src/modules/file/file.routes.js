const express = require("express");
const router = express.Router();
const multer = require('multer');
const {protect} = require("../../middleware/auth.middleware");
const upload = multer(); 
const {uploadFile , download} = require("../file/file.controller");




router.post('/api/upload',protect,upload.single('file'), uploadFile );
router.get('/:fileId/download', protect , download);

module.exports = router;