class CustomError extends Error {
  constructor(code, message) {
    super();
    this.code = code;
    this.message = message;
  }

  toJSON() {
    const { code, message } = this;
    return {
      status: "error",
      code,
      message
    };
  }
}

function handleErrors(err, req, res) {
  if (err instanceof CustomError) {
    res.status(err.code).send(err.toJSON());
  } else {
    res.status(500).send({
      status: "error",
      message: err.message
    });
  }
}

module.exports = {
  CustomError,
  handleErrors
};
