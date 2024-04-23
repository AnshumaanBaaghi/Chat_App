import React from "react";
import { IconContext } from "react-icons";

export const ReactIcon = ({ children, color, size }) => {
  return (
    <IconContext.Provider value={{ color, size }} className="cursor-pointer">
      <div className="cursor-pointer">{children}</div>
    </IconContext.Provider>
  );
};
