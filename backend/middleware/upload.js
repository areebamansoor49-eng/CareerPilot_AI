const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDirectory = path.join(__dirname, "../uploads");

// Create uploads folder if it doesn't exist
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const extension = path
    .extname(file.originalname)
    .toLowerCase();

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
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter,
});

module.exports = upload;