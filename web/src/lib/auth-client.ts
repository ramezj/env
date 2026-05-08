import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "../../../api/src/auth";

export const authClient = createAuthClient({
  baseURL: "http://localhost:8080",
  plugins: [inferAdditionalFields<typeof auth>()],
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;
