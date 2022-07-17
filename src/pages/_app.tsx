import { ChakraProvider, createLocalStorageManager } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { theme } from "src/lib/theme";
import "../styles/globals.css";

export const client = new QueryClient();
const manager = createLocalStorageManager("theme");

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={client}>
      <ChakraProvider colorModeManager={manager} theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
