module.exports = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Vercel backend function is working.",
    timestamp: new Date().toISOString(),
  });
};