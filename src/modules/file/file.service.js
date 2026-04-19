const crypto = require('crypto');
const prisma = require("../../config/prisma");
const cloudinary = require("../../config/cloudinary");

class FileService {
  static allowedMimeTypes = ['image/png', 'image/jpeg', 'application/pdf'];
  static maxFileSize = 10 * 1024 * 1024; 

  static validateFile(file) {
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new Error('Invalid file type');
    }
    if (file.size > this.maxFileSize) {
      throw new Error('File too large');
    }
  }


  static async uploadToCloudinary(file) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "bytevault",
        resource_type: "auto"
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(file.buffer); 
  });
}
  // 🔥 UPDATED: Save metadata (no local storage)
  static async saveFileMetadata({ ownerId, file, uploadResult }) {
    return prisma.file.create({
      data: {
        filename: uploadResult.public_id,      // Cloudinary ID
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: uploadResult.secure_url,         // URL instead of local path
        url: uploadResult.secure_url,

        userId: ownerId
      },
    });
  }

  // 🔥 MAIN FLOW UPDATED
  static async uploadFile({ ownerId, file }) {
    this.validateFile(file);

    // 1. Upload to Cloudinary
    const uploadResult = await this.uploadToCloudinary(file);

    // 2. Save metadata
    const metadata = await this.saveFileMetadata({
      ownerId,
      file,
      uploadResult
    });

    return metadata;
  };


  static generateSignedUrl(publicId) {
  return cloudinary.url(publicId, {
    secure: true,
    sign_url: true
  });
}




  
  static async authorizeAccess({ ownerId, fileId }) {
    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file) throw new Error('File not found');
    if (file.userId !== ownerId) throw new Error('Access denied');

    return file;
  }
}

module.exports = FileService;