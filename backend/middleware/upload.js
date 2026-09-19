const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();

  const isPDF =
    extension === ".pdf" &&
    file.mimetype === "application/pdf";

  if (isPDF) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed."));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: fileFilter,
});

module.exports = upload;