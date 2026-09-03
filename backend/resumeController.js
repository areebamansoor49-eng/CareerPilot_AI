const path = require("path");

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No PDF file was uploaded.",
      });
    }

    console.log("Resume received successfully:");
    console.log("Original name:", req.file.originalname);
    console.log("Saved name:", req.file.filename);
    console.log("Size:", req.file.size);

    return res.status(200).json({
      success: true,
      message: "Resume uploaded successfully.",
      resume: {
        originalName: req.file.originalname,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype,
        url: `/uploads/${req.file.filename}`,
        path: path.join("uploads", req.file.filename),
      },
    });
  } catch (error) {
    console.error("Resume upload error:", error);

    return res.status(500).json({
      success: false,
      message: "Resume upload failed.",
      error: error.message,
    });
  }
};

module.exports = {
  uploadResume,
};