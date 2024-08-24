import { Headers } from "next/headers";

export function headers() {
  const headersList = new Headers();
  headersList.set(
    "Content-Security-Policy",
    "script-src 'self' 'unsafe-eval';", // Add other directives as needed
  );

  return headersList;
}
