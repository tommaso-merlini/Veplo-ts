const checkFirebaseErrors = (e: any) => {
  const code = e.errorInfo.code;
  switch (code) {
    case "auth/argument-error":
      throw Object.assign(new Error("Error"), {
        extensions: {
          customCode: "401",
          customPath: "token",
          customMessage: "Token is not valid",
        },
      });
    case "auth/id-token-expired":
      throw Object.assign(new Error("Error"), {
        extensions: {
          customCode: "401",
          customPath: "token",
          customMessage: "Token has expired",
        },
      });
  }
};

export default checkFirebaseErrors;
