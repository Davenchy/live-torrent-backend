class CustomError extends Error {
  constructor(code, message, label, extra) {
    super();
    this.code = code;
    this.message = message;
    this.label = label;
    this.extra = extra;
  }

  toJSON() {
    const { code, message, label, extra } = this;
    return {
      status: "error",
      label,
      code,
      message,
      extra
    };
  }
}

function handleErrors(err, req, res, next) {
  if (!err) next();
  if (err instanceof CustomError) {
    res.status(err.code).send(err.toJSON());
  } else {
    res.status(500).send({
      status: "error",
      label: "General Error",
      code: 500,
      message: err.message
    });
  }
  console.error(err);
}

module.exports = {
  CustomError,
  handleErrors
};
