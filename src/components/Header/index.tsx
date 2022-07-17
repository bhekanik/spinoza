import { Badge, Link as ChakraLink, useColorMode } from "@chakra-ui/react";
import Link from "next/link";
import { config } from "src/lib/config";
import { ColorModeToggle } from "../ColorModeToggle";

export const Header = () => {
  const { colorMode } = useColorMode();

  return (
    <>
      <Link href="/" as="/" passHref>
        <>
          <ChakraLink fontWeight="extrabold" w={36} overflow="none">
            Project Spinoza
          </ChakraLink>
          {!config.isProd && (
            <Badge size="xs" variant="outline" colorScheme="green">
              {process.env.NEXT_PUBLIC_DEPLOYMENT_ENV}
            </Badge>
          )}
        </>
      </Link>
      <ColorModeToggle ml={2} />
    </>
  );
};
