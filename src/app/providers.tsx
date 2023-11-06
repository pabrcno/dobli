"use client";

import { ChakraProvider } from "@chakra-ui/react";
import Provider from "./_trpc/Provider";
import theme from "./styles/_theme";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </Provider>
  );
}
