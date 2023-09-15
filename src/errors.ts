class NullBodyError extends Error {
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
export { NullBodyError, UnauthorizedError, PrismaError };
