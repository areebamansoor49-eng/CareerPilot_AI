const app = require("../server");
const connectDB = require("../config/db");

let dbPromise = null;
let routesLoaded = false;

module.exports = async (req, res) => {
  try {
    if (!dbPromise) {
      dbPromise = connectDB().catch((error) => {
        dbPromise = null;
        throw error;
      });
    }

    await dbPromise;

    // Load all Express routes before handling the Vercel request.
    if (!routesLoaded) {
      app.loadRoutes();
      routesLoaded = true;
    }

    return app(req, res);
  } catch (error) {
    console.error(
      "Vercel backend startup error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Backend startup failed.",
      error: error.message,
    });
  }
};