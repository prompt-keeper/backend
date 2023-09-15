const error_handler = ({ code, error, set }) => {
  switch (code) {
    // With auto-completion
    case "INTERNAL_SERVER_ERROR":
      // With type narrowing
      // Error is typed as CustomError
      return { error: error.message };
    case "VALIDATION":
      // Error is typed as ValidationError
      return { error: error.message };
    case "NULL_BODY":
      set.status = 400;
      return {
        error: error.message,
      };
    case "INVALID_PAYLOAD":
      set.status = 400;
      return {
        error: error.message,
      };
    case "PRISMA":
      switch (error.prismaCode) {
        case "P2025":
          set.status = 404;
          break;
        case "P2002":
          set.status = 409;
          break;
        default:
          set.status = 500;
      }
      return {
        error: error.message,
      };
    case "UNAUTHORIZED":
      set.status = 401;
      return {
        error: error.message,
      };
    default:
      // Error is typed as unknown
      return {
        code: code,
        error: error.message,
      };
  }
};

export default error_handler;
