const express = require("express");
const router = express.Router();
const multer = require('multer');
const {protect} = require("../../middleware/auth.middleware");
const upload = multer(); 
const {uploadFile , download} = require("../file/file.controller");



/**
 * @openapi
 * /file/v1/api/upload:
 *   post:
 *     summary: Upload a file
 *     description: Uploads a file and stores it for the authenticated user
 *     tags:
 *       - Files
 *
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 file:
 *                   type: object
 *
 *       401:
 *         description: Unauthorized
 *
 *       500:
 *         description: Server error
 */
router.post('/api/upload',protect,upload.single('file'), uploadFile );



/**
 * @openapi
 * /file/v1/api/{fileId}:
 *   get:
 *     summary: Download a file
 *     description: Downloads a file if the user has access
 *     tags:
 *       - Files
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the file to download
 *
 *     responses:
 *       200:
 *         description: File downloaded successfully (binary stream)
 *       403:
 *         description: Forbidden (no access to file)
 *       404:
 *         description: File not found
 */
router.get('/api/:fileId', protect , download);

module.exports = router;