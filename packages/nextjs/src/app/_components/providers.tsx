"use client";

import { ReactNode, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const DynamicApiProvider = dynamic(
  () => import("@gear-js/react-hooks").then((mod) => mod.ApiProvider),
  { ssr: false },
);
const DynamicAlertProvider = dynamic(
  () => import("@gear-js/react-hooks").then((mod) => mod.AlertProvider),
  { ssr: false },
);
const DynamicAccountProvider = dynamic(
  () => import("@gear-js/react-hooks").then((mod) => mod.AccountProvider),
  { ssr: false },
);
const DynamicAlert = dynamic(
  () => import("@gear-js/ui").then((mod) => mod.Alert),
  { ssr: false },
);

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

function ClientSideProviders({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <DynamicApiProvider
      initialArgs={{ endpoint: process.env.NEXT_PUBLIC_NODE_ADDRESS }}
    >
      <DynamicAlertProvider
        template={DynamicAlert}
        containerClassName="alertStyles.root"
      >
        <DynamicAccountProvider appName="schola">
          {children}
        </DynamicAccountProvider>
      </DynamicAlertProvider>
    </DynamicApiProvider>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ClientSideProviders>{children}</ClientSideProviders>
    </QueryClientProvider>
  );
}
