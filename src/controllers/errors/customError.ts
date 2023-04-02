type CustomError = {
  code: string;
  path: string;
  message: string;
};

const customError = ({ code, path, message }: CustomError) => {
  throw Object.assign(new Error("Error"), {
    extensions: {
      customCode: code,
      customPath: path,
      customMessage: message,
    },
  });
};

export default customError;
