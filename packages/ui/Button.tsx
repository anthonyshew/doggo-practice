import * as React from "react";

export const Button = ({ onClick, text }: any) => {
  return <button onClick={() => onClick()}>{text}</button>;
};
