module.exports = function validateTaskInput(req, res, next) {
  const { title } = req.body;

  if (req.method === "POST") {
    if (!title || typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({
        error: "Validation failed",
        details: ["Title is required and cannot be empty."],
      });
    }
  }

  if (req.method === "PUT") {
    if (title !== undefined && (typeof title !== "string" || title.trim() === "")) {
      return res.status(400).json({
        error: "Validation failed",
        details: ["Title cannot be empty."],
      });
    }
  }

  next();
};
