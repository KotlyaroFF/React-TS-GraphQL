import { Dispatch, FC, SetStateAction } from "react";
import { Link } from "react-router-dom";
import { HiDocumentAdd, HiUserAdd } from "react-icons/hi";
import Button from "../UI/Button";
import NavMenu from "./NavMenu";
import Logo from "../UI/Logo";
import WorkspaceButton from "../Workspace/WorkspaceButton";
import InviteButton from "../InviteButton/InviteButton";

const NavBar: FC<{ setSidebarOpen?: Dispatch<SetStateAction<boolean>> }> = ({
  setSidebarOpen,
}) => (
  <div className="relative">
    <Link to="/" className="hidden lg:block mb-10">
      <Logo className="font-bold text-2xl" />
    </Link>
    <div className="mb-12">
      <Button
        className="mx-auto w-full"
        text="Generate new content"
        type="primary"
        iconStart={<HiDocumentAdd className="h-5 w-5" />}
      />
    </div>
    <NavMenu />
    <div className="my-14">
      <InviteButton
        text="Invite a colleague"
        type="transparent"
        iconStart={<HiUserAdd className="h-5 w-5" />}
      />
    </div>
    <WorkspaceButton setSidebarOpen={setSidebarOpen} />
  </div>
);

export default NavBar;
