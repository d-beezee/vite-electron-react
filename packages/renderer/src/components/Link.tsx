import React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import type { LinkProps } from "react-router-dom";

const Link = (props: LinkProps & { isExternal?: boolean }) => {
  const navigate = useNavigate();
  if (props.isExternal) {
    return (
      <a
        className={props.className}
        href="#"
        onClick={(e) => {
          e.preventDefault();
          navigate("/empty");
          typeof props.to === "string" && window.electron.openWeb(props.to);
        }}
      >
        {props.children}
      </a>
    );
  }
  return (
    <RouterLink
      {...props}
      onClick={(e) => {
        e.preventDefault();
        window.electron.closeWeb();
        navigate(props.to);
        props.onClick && props.onClick(e);
      }}
    >
      {props.children}
    </RouterLink>
  );
};
export default Link;
