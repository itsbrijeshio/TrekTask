const asyncWrapper = require("../middlewares/asyncWrapper.middleware.js");
const schema = require("./schema.js");

const validate = (schema, source = "body") =>
  asyncWrapper(async (req, res, next) => {
    await schema.parseAsync(req[source]);
    next();
  });

  module.exports = { validate, schema };
