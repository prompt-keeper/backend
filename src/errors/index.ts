import error_handler from "./error_handler";

class NullBodyError extends Error {
  constructor(public message: string) {
    super(message);
  }
}

class InvalidPayloadError extends Error {
  constructor(public message: string) {
    super(message);
  }
}

class UnauthorizedError extends Error {
  constructor(public message: string) {
    super(message);
  }
}

class PrismaError extends Error {
  constructor(
    public message: string,
    public prismaCode: string = "PRISMA",
  ) {
    super(message);
    this.prismaCode = prismaCode;
  }
}

export {
  InvalidPayloadError,
  NullBodyError,
  PrismaError,
  UnauthorizedError,
  error_handler,
};
