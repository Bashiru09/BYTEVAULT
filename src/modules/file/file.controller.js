const FileService = require("../file/file.service");
const path = require('path');

exports.uploadFile = async (req, res) => {
  try {
    console.log("running");
    const ownerId = req.user.userId; 
    console.log({id: ownerId});
    const file = req.file;
    const savedFile = await FileService.uploadFile({ ownerId, file });
    res.status(200).json({ file: savedFile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


exports.download = async (req, res) => {
  try {
    const ownerId = req.user.userId;
    const fileId = req.params.fileId;

    const file = await FileService.authorizeAccess({ ownerId, fileId });

    res.download(path.join(__dirname, '../../', file.path), file.original_name);
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
}