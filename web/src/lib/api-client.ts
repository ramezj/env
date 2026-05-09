import { hc } from "hono/client";
import type { AppType } from "@api/index";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

/**
 * Fully-typed Hono RPC client.
 * Every method is inferred from the AppType exported by the API — 
 * request bodies, path params, and response shapes are all type-checked.
 */
export const apiClient = hc<AppType>(API_URL, {
  init: {
    credentials: "include", // send session cookies automatically
  },
});
