"use client";

import { ChakraProvider } from "@chakra-ui/react";
import TRPCProvider from "./_trpc/Provider";

import { Provider } from "jotai";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TRPCProvider>
      <ChakraProvider>
        <Provider>{children}</Provider>
      </ChakraProvider>
    </TRPCProvider>
  );
}
