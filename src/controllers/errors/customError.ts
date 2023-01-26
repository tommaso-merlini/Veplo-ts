const customError = ({ code, path, message }) => {
  throw Object.assign(new Error("Error"), {
    extensions: {
      customCode: code,
      customPath: path,
      customMessage: message,
    },
  });
};

export default customError;
