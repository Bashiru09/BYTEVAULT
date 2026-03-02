const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const prisma = require("../../config/prisma")

const UPLOAD_DIR = path.join(__dirname, '../../uploads'); 
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

class FileService {
  static allowedMimeTypes = ['image/png', 'image/jpeg', 'application/pdf'];
  static maxFileSize = 10 * 1024 * 1024; // 10 MB

  
  static validateFile(file) {
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new Error('Invalid file type');
    }
    if (file.size > this.maxFileSize) {
      throw new Error('File too large');
    }
  }

  
  static generateStoredName(originalName) {
    const ext = path.extname(originalName);
    const hash = crypto.randomBytes(16).toString('hex');
    return `${Date.now()}-${hash}${ext}`;
  }

  
  static async storeFile(file) {
    const storedName = this.generateStoredName(file.originalname);
    const filePath = path.join(UPLOAD_DIR, storedName);

    await fs.promises.writeFile(filePath, file.buffer);

    return { storedName, path: filePath };
  }

  
  static async saveFileMetadata({ ownerId, file, storedName }) {
    return prisma.file.create({
      data: {
        owner_id: ownerId,
        original_name: file.originalname,
        stored_name: storedName,
        mime_type: file.mimetype,
        size: file.size,
        storage_type: 'LOCAL',
        path: `uploads/${storedName}`,
      },
    });
  }

  
  static async uploadFile({ ownerId, file }) {
    this.validateFile(file);

    const { storedName, path } = await this.storeFile(file);
    const metadata = await this.saveFileMetadata({ ownerId, file, storedName });

    return metadata;
  }

  
  static async authorizeAccess({ ownerId, fileId }) {
    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file) throw new Error('File not found');
    if (file.owner_id !== ownerId) throw new Error('Access denied');

    return file;
  }
}

module.exports = FileService;
