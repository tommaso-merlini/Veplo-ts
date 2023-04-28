import crypto from "crypto";

export const formatError = (err: any) => {
  let path = err.path;
  if (err.path === undefined) {
    path = "graphql fields";
  }

  const errorId = crypto.randomUUID();
  console.log("================================================");
  console.log(`errorId: ${errorId}`);
  console.log(`path: ${path}`);
  console.log(`message: ${err.extensions.customMessage || err.message}`);
  console.log(`date: ${new Date()}`);
  console.log("===============================================");

  // Don't give the specific errors to the client (in production)
  if (err.extensions!.code.startsWith("INTERNAL_SERVER_ERROR")) {
    if (process.env.NODE_ENV === "development") {
      return err;
    } else {
      if (!err.extensions.customCode) {
        err.extensions.customCode = "500";
      }
      if (!err.extensions.customPath) {
        err.extensions.customPath = err.path[0];
      }
      if (!err.extensions.customMessage) {
        err.extensions.customMessage = err.message;
      }
      return {
        name: err.extensions.customMessage,
        code: err.extensions.customCode,
        path: err.extensions.customPath,
        id: errorId,
        message: "Internal Server Error",
      };
    }
  }

  if (err.extensions!.code.startsWith("GRAPHQL_VALIDATION_FAILED")) {
    if (process.env.NODE_ENV === "development") {
      return err;
    } else {
      return {
        name: err.message,
        code: "400",
        path: "fields",
        message: "Graphql Validation Failed",
        id: errorId,
      };
    }
  }

  return {
    name: err.extensions.code || "Unknown Error",
    code: "500",
    path: err.path[0] || "unknown",
    message: err.message || "unknown",
    id: errorId,
  };
};
