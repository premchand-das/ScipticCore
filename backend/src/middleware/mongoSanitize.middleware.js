const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== "object") return obj;

  for (const key of Object.keys(obj)) {
    if (key.startsWith("$") || key.includes(".")) {
      const cleanKey = key.replace(/\$/g, "_").replace(/\./g, "_");
      obj[cleanKey] = obj[key];
      delete obj[key];
    }

    if (typeof obj[key] === "object") {
      sanitizeObject(obj[key]);
    }
  }

  return obj;
};

export const mongoSanitizeMiddleware = (req, res, next) => {
  if (req.body) sanitizeObject(req.body);
  if (req.params) sanitizeObject(req.params);

  // Do NOT mutate req.query directly because it is getter-only in your setup.
  next();
};

export default mongoSanitizeMiddleware;