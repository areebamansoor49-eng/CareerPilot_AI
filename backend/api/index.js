const app = require("../server");

module.exports = (req, res) => {
  try {
    return app(req, res);
  } catch (error) {
    console.error("Vercel runtime error:", error);

    return res.status(500).json({
      success: false,
      message: "Backend runtime error.",
      error: error.message,
    });
  }
};