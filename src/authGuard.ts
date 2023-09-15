import { UnauthorizedError } from "./errors";
const authGuard = ({ bearer }: any) => {
  if (!bearer) {
    throw new UnauthorizedError("Unauthorized");
  }

  // the bearer should match with the api_key in the database
  //  or the master key
  if (bearer === process.env.MASTER_KEY) {
    return;
  }

  throw new UnauthorizedError("Unauthorized");
};

export default authGuard;
