import { FC, Fragment, ReactNode } from "react";
import { Menu, Transition } from "@headlessui/react";

interface DropdownProps {
  menuButton: string | ReactNode;
  menuItem: ReactNode;
  show?: boolean;
  className?: string;
}

const Dropdown: FC<DropdownProps> = ({
  menuButton,
  menuItem,
  show,
  className,
}) => (
  <Menu as="div" className="relative border-none inline-block text-left">
    <div>
      <Menu.Button>{menuButton}</Menu.Button>
    </div>

    <Transition
      show={show}
      as={Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <Menu.Items className="absolute right-0 z-10 mt-2 min-w-max origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className={className || ""}>{menuItem}</div>
      </Menu.Items>
    </Transition>
  </Menu>
);
export default Dropdown;
