"use client";

import {
  ApiProvider,
  AlertProvider,
  AccountProvider,
} from "@gear-js/react-hooks";
import { Alert, alertStyles } from "@gear-js/ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 0,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ApiProvider
        initialArgs={{ endpoint: process.env.NEXT_PUBLIC_NODE_ADDRESS }}
      >
        <AlertProvider template={Alert} containerClassName={alertStyles.root}>
          <AccountProvider appName="schola">{children}</AccountProvider>
        </AlertProvider>
      </ApiProvider>
    </QueryClientProvider>
  );
}
