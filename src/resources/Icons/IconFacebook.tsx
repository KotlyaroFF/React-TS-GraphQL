import { FC } from "react";

export interface IconProps {
  className?: string;
  w?: string;
  h?: string;
}

const IconFacebook: FC<IconProps> = ({
  className = "fill-white",
  w = "40",
  h = "40",
}) => (
  <svg
    className={className ?? ""}
    enableBackground="new 0 0 64 64"
    width={w}
    height={h}
    version="1.1"
    viewBox="0 0 28 29"
    xmlSpace="preserve"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 14.2793C0 22.0113 6.26801 28.2793 14 28.2793C21.732 28.2793 28 22.0113 28 14.2793C28 6.54731 21.732 0.279297 14 0.279297C6.26801 0.279297 0 6.54731 0 14.2793Z"
      fill="white"
    />
    <path
      d="M22 14.2793C22 9.8793 18.4 6.2793 14 6.2793C9.6 6.2793 6 9.8793 6 14.2793C6 18.2793 8.9 21.5793 12.7 22.1793V16.5793H10.7V14.2793H12.7V12.4793C12.7 10.4793 13.9 9.3793 15.7 9.3793C16.6 9.3793 17.5 9.5793 17.5 9.5793V11.5793H16.5C15.5 11.5793 15.2 12.1793 15.2 12.7793V14.2793H17.4L17 16.5793H15.1V22.2793C19.1 21.6793 22 18.2793 22 14.2793Z"
      fill="#1877F2"
    />
  </svg>
);

export default IconFacebook;
