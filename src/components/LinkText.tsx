import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Link, LinkProps, Tooltip } from "@chakra-ui/react";

interface Props {
  href: string;
  label: string;
}

export const LinkText = ({ href, label, ...linkProps }: Props & LinkProps) => {
  return (
    <Tooltip
      label={"Click to go to the original page. This is an external link"}
    >
      <Link
        display="flex"
        gap={2}
        alignItems="center"
        color="#31A078"
        target="_blank"
        href={href}
        fontWeight="medium"
        {...linkProps}
      >
        {label}
        <ExternalLinkIcon w={3} h={3} />
      </Link>
    </Tooltip>
  );
};
