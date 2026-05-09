import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { getSession } from "./auth-client";

export const getServerSession = createServerFn({ method: "GET" }).handler(
  async () => {
    const headers = getRequestHeaders();
    const { data: session } = await getSession({
      fetchOptions: {
        headers: headers as any,
      },
    });
    return session;
  },
);
