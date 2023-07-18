import React from "react";
import { Link } from "gatsby";

export type UniversalButtonProps = {
  to?: string;
  from?: string;
  href?: string;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  title?: string;
};

export const UniversalButton = ({
  to,
  from,
  href,
  disabled,
  children,
  onClick,
  ...props
}: React.PropsWithChildren<UniversalButtonProps>) => {
  const withPathname = {
    pathname: to,
    state: { from },
  };

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopenner noreferrer" {...props}>
        {children}
      </a>
    );
  }

  if (to) {
    return (
      <Link to={from ? withPathname : to} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button disabled={disabled} {...props} onClick={onClick}>
      {children}
    </button>
  );
};
