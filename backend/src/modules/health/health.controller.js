export const healthController = (req, res) => {
  res.status(200).json({
    success: true,
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    timestamp: new Date()
  });
};