import { FC, ReactNode } from "react";

interface NavListProps {
  className?: string;
  children: ReactNode;
}

const NavList: FC<NavListProps> = ({ className, children }) => (
  <ul className={`flex flex-col ${className !== undefined ? className : ""}`}>
    {children}
  </ul>
);
export default NavList;
