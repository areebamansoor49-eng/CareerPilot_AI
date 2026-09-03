const fs = require("fs");
const { PDFParse } = require("pdf-parse");

const { analyzeResume } = require("../services/resumeAnalyzer");

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No PDF uploaded.",
      });
    }

    console.log("=================================");
    console.log("Resume received:");
    console.log("File:", req.file.originalname);
    console.log("Size:", req.file.size);
    console.log("=================================");

    const pdfBuffer = fs.readFileSync(req.file.path);

    const parser = new PDFParse({
      data: pdfBuffer,
    });

    const pdfData = await parser.getText();

    await parser.destroy();

    const resumeText = (pdfData.text || "").trim();

    console.log("PDF pages:", pdfData.total);
    console.log(
      "Extracted text length:",
      resumeText.length
    );

    if (!resumeText) {
      return res.status(400).json({
        success: false,
        message:
          "The PDF was uploaded, but no readable text could be extracted.",
      });
    }

    // =====================================
    // REAL RESUME ANALYSIS
    // =====================================

    const analysis = analyzeResume(
      resumeText,
      pdfData.total
    );

    console.log("========== ATS ANALYSIS ==========");
    console.log("ATS Score:", analysis.atsScore);
    console.log("Word Count:", analysis.wordCount);
    console.log("Skills:", analysis.skills);
    console.log("Suggestions:", analysis.suggestions);
    console.log("==================================");

    return res.status(200).json({
      success: true,

      message:
        "Resume uploaded and analyzed successfully.",

      file: {
        originalName: req.file.originalname,
        filename: req.file.filename,
        size: req.file.size,
        path: `/uploads/${req.file.filename}`,
      },

      analysis,
    });
  } catch (error) {
    console.error(
      "Resume processing error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to process resume.",
    });
  }
};

module.exports = {
  uploadResume,
};