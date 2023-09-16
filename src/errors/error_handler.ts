const error_handler = ({ code, error, set }) => {
  switch (code) {
    case "INVALID_PAYLOAD":
    case "VALIDATION":
    case "NULL_BODY":
      set.status = 400;
      break;
    case "UNAUTHORIZED":
      set.status = 401;
      break;
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
      break;
    case "NOT_FOUND":
      set.status = 404;
      break;
    case "INTERNAL_SERVER_ERROR":
    default:
      set.status = 500;
  }
  return { error: error.message };
};

export default error_handler;
