const FileService = require("../../../src/modules/file/file.service");

jest.mock("../../../src/config/prisma", () => ({
  file: {
    create: jest.fn(),
    findUnique: jest.fn(),
  },
}));


jest.mock("../../../src/config/cloudinary", () => ({
  uploader: {
    upload_stream: jest.fn(),
  },
}));

const prisma = require("../../../src/config/prisma");
const cloudinary = require("../../../src/config/cloudinary");

describe("FileService Unit Tests", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });


  describe("validateFile", () => {
    it("should pass valid file", () => {
      const file = {
        mimetype: "image/png",
        size: 1024,
      };

      expect(() => FileService.validateFile(file)).not.toThrow();
    });

    it("should throw invalid file type", () => {
      const file = {
        mimetype: "video/mp4",
        size: 1024,
      };

      expect(() => FileService.validateFile(file)).toThrow("Invalid file type");
    });

    it("should throw file too large", () => {
      const file = {
        mimetype: "image/png",
        size: 20 * 1024 * 1024,
      };

      expect(() => FileService.validateFile(file)).toThrow("File too large");
    });
  });

  
  describe("authorizeAccess", () => {
    it("should return file if owner matches", async () => {
      prisma.file.findUnique.mockResolvedValue({
        id: "1",
        userId: "user1",
      });

      const result = await FileService.authorizeAccess({
        ownerId: "user1",
        fileId: "1",
      });

      expect(result.userId).toBe("user1");
    });

    it("should throw if file not found", async () => {
      prisma.file.findUnique.mockResolvedValue(null);

      await expect(
        FileService.authorizeAccess({
          ownerId: "user1",
          fileId: "1",
        })
      ).rejects.toThrow("File not found");
    });

    it("should throw access denied", async () => {
      prisma.file.findUnique.mockResolvedValue({
        id: "1",
        userId: "user2",
      });

      await expect(
        FileService.authorizeAccess({
          ownerId: "user1",
          fileId: "1",
        })
      ).rejects.toThrow("Access denied");
    });
  });

 
  describe("uploadFile", () => {

    it("should upload file and save metadata", async () => {

      // mock validateFile (no throw)
      jest.spyOn(FileService, "validateFile").mockImplementation(() => {});

      // mock uploadToCloudinary
      jest.spyOn(FileService, "uploadToCloudinary").mockResolvedValue({
        public_id: "test-file",
        secure_url: "http://cloudinary.com/test.jpg",
      });

      prisma.file.create.mockResolvedValue({
        id: "1",
        filename: "test-file",
      });

      const result = await FileService.uploadFile({
        ownerId: "user1",
        file: {
          originalname: "test.png",
          mimetype: "image/png",
          size: 1000,
        },
      });

      expect(result.filename).toBe("test-file");
      expect(FileService.validateFile).toHaveBeenCalled();
      expect(FileService.uploadToCloudinary).toHaveBeenCalled();
      expect(prisma.file.create).toHaveBeenCalled();
    });

  });

});