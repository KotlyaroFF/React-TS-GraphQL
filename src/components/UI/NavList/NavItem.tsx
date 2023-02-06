import { FC, MouseEventHandler, ReactNode } from "react";

interface NavItem {
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  id?: string;
}

const NavItem: FC<NavItem> = ({ children, className, onClick, id }) => {
  const cursor = onClick ? "" : "cursor-auto";
  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      className={`${cursor} flex max-w-fit flex-row ${
        className !== undefined ? className : ""
      }`}
    >
      {children}
    </button>
  );
};
export default NavItem;
