import { Dispatch, FC, SetStateAction, useState } from "react";
import { HiChevronUp } from "react-icons/hi";
import WorkspaceAvatar from "./WorkspaceAvatar";
import { useAuth } from "../AuthProvider/AuthProvider";
import Loader from "../UI/Loader";
import WorkspaceModal from "./WorkspaceModal";
import { useWorkspaceData } from "../WorkspaceDataProvider/WorkspaceDataProvider";
import { UserRole } from "../../graphql/types";

const WorkspaceButton: FC<{
  setSidebarOpen?: Dispatch<SetStateAction<boolean>>;
}> = ({ setSidebarOpen }) => {
  const { allWorkspaces, selectWorkspace } = useWorkspaceData();
  const { user } = useAuth();
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(!open);
  if (!allWorkspaces || !user || !selectWorkspace)
    return (
      <div className="block fixed bottom-1 z-10 bg-white w-60 left-1">
        <div className="border-2 flex  justify-center border-grey-lighter self-center w-full max-w-xl rounded-lg  bg-indigo-400  p-4 ">
          <Loader />
        </div>
      </div>
    );

  const userPlan: string = user.role === UserRole.User ? "Standard" : "Pro";
  return (
    <div className="block fixed bottom-0 z-20 bg-white w-64  border border-r-gray-200 left-0 ">
      <div key={selectWorkspace.id}>
        <div className="b-t w-full h-0 " />
        <div className="flex py-10 items-center justify-between cursor-pointer h-20 z-30 sticky bottom-0 bg-gray-50">
          <button
            className="cursor-pointer flex items-center h-full text-left w-full focus:outline-none focus:ring-0"
            type="button"
            onClick={handleOpen}
          >
            <WorkspaceAvatar className="w-10 h-10 m-2 ml-4">
              {selectWorkspace.name[0].toUpperCase()}W
            </WorkspaceAvatar>
            <div className="flex flex-col flex-grow">
              <span className="text-sm font-medium text-green-900 line-clamp-1">
                {selectWorkspace.name}
              </span>
              <span className="text-xs font-light text-green-800 line-clamp-1">
                {userPlan}
              </span>
            </div>
            <div>
              <HiChevronUp className="w-6 h-6 mr-4" />
            </div>
          </button>
        </div>
      </div>
      <WorkspaceModal
        setSidebarOpen={setSidebarOpen}
        allWorkspaces={allWorkspaces}
        open={open}
        setOpen={setOpen}
      />
    </div>
  );
};

export default WorkspaceButton;
