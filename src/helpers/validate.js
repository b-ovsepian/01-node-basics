export function validate(schema, reqPart = "body") {
  return (req, res, next) => {
    const validationResult = schema.validate(req[reqPart]);
    if (Object.keys(req[reqPart]).length == 0) {
      return res.status(400).json({
        message: "missing fields",
      });
    }
    if (validationResult.error) {
      return res.status(400).json({
        message: validationResult.error.message,
      });
    }

    next();
  };
}
