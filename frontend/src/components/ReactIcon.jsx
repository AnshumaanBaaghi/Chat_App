import React from "react";
import { IconContext } from "react-icons";

export const ReactIcon = ({ children, color, size, ...props }) => {
  return (
    <IconContext.Provider value={{ color, size }} {...props}>
      <div className="cursor-pointer">{children}</div>
    </IconContext.Provider>
  );
};
