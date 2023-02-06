import { FC, ReactNode } from "react";

const TEXT_COLOR = {
  black: "text-black",
  primary: "text-indigo-600",
  transparent: "text-transparent",
  grey: "text-gray-700",
  "grey-light": "text-gray-500",
  white: "text-white",
  "light-blue-dark": "text-gray-300",
  "light-blue": "text-indigo-300",
  "primary-error": "text-red-600",
};

const FONT_SIZE = {
  base: "text-base",
  small: "text-sm",
  flag: "text-xl",
  title: "text-2xl",
  extraSmall: "text-xs",
  large: "text-lg",
};

const FONT_VARIANT = {
  semibold: "font-semibold",
  bold: "font-bold",
};

interface TypographyProps {
  className?: string;
  children: ReactNode;
  size?: "base" | "small" | "flag" | "title" | "extraSmall" | "large";
  variant?: "semibold" | "bold";
  color?:
    | "transparent"
    | "primary"
    | "black"
    | "grey"
    | "grey-light"
    | "white"
    | "light-blue"
    | "light-blue-dark"
    | "primary-error";
}

const Typography: FC<TypographyProps> = ({
  className,
  children,
  size = "base",
  variant = "semibold",
  color = "black",
}) => (
  <span
    className={`font-Inter ${FONT_VARIANT[variant]} ${TEXT_COLOR[color]} ${
      FONT_SIZE[size]
    } ${className ?? ""}`}
  >
    {children}
  </span>
);
export default Typography;
