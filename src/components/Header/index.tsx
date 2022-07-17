import { Link as ChakraLink } from "@chakra-ui/react";
import Link from "next/link";
import { ColorModeToggle } from "../ColorModeToggle";

export const Header = () => {
  return (
    <>
      <Link href="/" as="/" passHref>
        <ChakraLink fontWeight="extrabold" w={36} overflow="none">
          Project Spinoza
        </ChakraLink>
      </Link>
      <ColorModeToggle ml={2} />
    </>
  );
};
