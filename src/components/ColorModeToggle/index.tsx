import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
  IconButton,
  IconButtonProps,
  useColorMode,
  useMediaQuery,
} from "@chakra-ui/react";

export const ColorModeToggle = (
  props: Partial<IconButtonProps>
): JSX.Element => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [isLessThan768] = useMediaQuery("(max-width: 768px)");

  return (
    <IconButton
      {...props}
      name="color-mode-toggle"
      role="button"
      size={isLessThan768 ? "lg" : "md"}
      aria-label="Toggle Dark Mode Switch"
      icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
      onClick={() => {
        toggleColorMode();
      }}
    />
  );
};
