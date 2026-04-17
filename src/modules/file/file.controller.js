const FileService = require("../file/file.service");


exports.uploadFile = async (req, res) => {
  try {
    const ownerId = req.user.userId; 
    const file = req.file;
    const savedFile = await FileService.uploadFile({ ownerId, file });
    res.status(200).json({ file: savedFile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


exports.download = async (req, res) => {

  console.log("📥 Download request received");

  try {
    
    const ownerId = req.user.userId;
    const fileId = req.params.fileId;

    console.log("Owner ID:", ownerId);
    console.log("File ID:", fileId);

  
    if (!ownerId) {
      return res.status(401).json({
        error: "Unauthorized: user not found in request"
      });
    }

    if (!fileId) {
      return res.status(400).json({
        error: "File ID is required"
      });
    }

   

    const file = await FileService.authorizeAccess({ ownerId, fileId });

     if (!file) {
      return res.status(404).json({
        error: "File not found"
      });
    }

     console.log("File found:", file.id);

    const signedUrl = await FileService.generateSignedUrl(file.filename);

    if (!signedUrl) {
      throw new Error("Failed to generate signed URL");
    }

    console.log("Redirecting to:", signedUrl);
    
    return res.redirect(signedUrl);
   
    
  } catch (err) {
    console.error("❌ Download error:", err);
   return res.status(500).json({
      error: err.message || "Internal server error",
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
  }
}