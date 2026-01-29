import { z } from "zod";

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      // In this Zod version, errors are stored in .issues
      const errors = error.issues || [];
      
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.map((err) => ({
          field: err.path ? err.path.join('.') : 'unknown',
          message: err.message || "Invalid value",
        })),
      });
    }
    next(error);
  }
};
