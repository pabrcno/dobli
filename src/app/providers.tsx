"use client";

import { ChakraProvider } from "@chakra-ui/react";
import TRPCProvider from "./_trpc/Provider";
import theme from "./styles/_theme";
import { Provider } from "jotai";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TRPCProvider>
      <ChakraProvider theme={theme}>
        <Provider>{children}</Provider>
      </ChakraProvider>
    </TRPCProvider>
  );
}
