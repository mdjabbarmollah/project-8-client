import { headers } from "next/headers";
import { auth } from "./auth";
import { withMongoRetry } from "./mongodb";

export const getTokenFromServer = async () => {
  try {
    const jwtToken = await withMongoRetry(async () =>
      auth.api.getToken({ headers: await headers() }),
    );
    return jwtToken?.token;
  } catch {
    return undefined;
  }
};
