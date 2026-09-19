const pdf = require("pdf-parse");
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

    if (
      !req.file.buffer ||
      !Buffer.isBuffer(req.file.buffer)
    ) {
      return res.status(400).json({
        success: false,
        message: "Uploaded PDF data could not be read.",
      });
    }

    const pdfData = await pdf(req.file.buffer);

    const resumeText = (pdfData.text || "").trim();

    console.log("PDF pages:", pdfData.numpages);
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

    const analysis = analyzeResume(
      resumeText,
      pdfData.numpages
    );

    console.log("========== ATS ANALYSIS ==========");
    console.log("ATS Score:", analysis.atsScore);
    console.log("Word Count:", analysis.wordCount);
    console.log("Skills:", analysis.skills);
    console.log(
      "Suggestions:",
      analysis.suggestions
    );
    console.log("==================================");

    return res.status(200).json({
      success: true,
      message:
        "Resume uploaded and analyzed successfully.",

      file: {
        originalName: req.file.originalname,
        size: req.file.size,
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