export const DB_NAME = process.env.WS_DB_NAME;

export const BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_LOCAL_BASE_URL
    : process.env.NEXT_PUBLIC_HOSTED_BASE_URL;

export const SOCKET_BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_SOCKET_LOCAL_URL
    : process.env.NEXT_PUBLIC_SOCKET_HOSTED_URL;
