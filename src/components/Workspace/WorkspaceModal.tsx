import { Dispatch, FC, Fragment, SetStateAction, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { HiCog, HiPlusCircle } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import Typography from "../UI/Typography";
import { UserRole, WorkspaceModel } from "../../graphql/types";
import WorkspaceAvatar from "./WorkspaceAvatar";
import { useAuth } from "../AuthProvider/AuthProvider";
import Loader from "../UI/Loader";
import CreateButton from "../CreateButton/CreateButton";
import { useWorkspaceData } from "../WorkspaceDataProvider/WorkspaceDataProvider";

interface WorkspaceModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  allWorkspaces: WorkspaceModel[];
  setSidebarOpen?: Dispatch<SetStateAction<boolean>>;
}

const WorkspaceModal: FC<WorkspaceModalProps> = ({
  open,
  setOpen,
  allWorkspaces,
  setSidebarOpen,
}) => {
  const cancelButtonRef = useRef(null);
  const { selectWorkspace, workspace, setSelectWorkspace } = useWorkspaceData();
  const navigate = useNavigate();
  const { user } = useAuth();

  const selectWorkspaceId = async (id: WorkspaceModel) => {
    setSelectWorkspace(id);
    await workspace({
      variables: {
        id: id.id,
      },
    }).then((res) => {
      setSelectWorkspace(res.data?.workspace ?? null);
    });
    navigate("/");
    setOpen(false);
    if (setSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  if (!allWorkspaces || !user || !selectWorkspace)
    return (
      <div className="block fixed  z-30 bg-white w-56 left-4">
        <div className="border-2 flex  justify-center border-grey-lighter self-center w-full max-w-xl rounded-lg -mx-6 bg-indigo-200 mt-6 p-6 ">
          <Loader />
        </div>
      </div>
    );
  const userPlan: string = user.role === UserRole.User ? "Standard" : "Pro";

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-30"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="" />
        </Transition.Child>
        <div className="flex min-h-full fixed inset-0 z-30 overflow-y-auto items-end justify-start p-4 text-center ">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <Dialog.Panel className="relative transform overflow-hidden rounded-lg ml-4 mb-16 border border-light-blue-light bg-white text-left shadow-2xl transition-all">
              <ul className="flex flex-col bg-white ">
                <li className="max-h-72 overflow-auto">
                  {allWorkspaces.map((item) => {
                    const selectWorkspaceClass =
                      selectWorkspace.id === item.id
                        ? " p-4 bg-gray-200 opacity-80 cursor-default"
                        : " p-4 hover:bg-gray-300";
                    return (
                      <ul key={item.id}>
                        <li className={selectWorkspaceClass}>
                          <button
                            onClick={async () => {
                              await selectWorkspaceId(item);
                            }}
                            disabled={selectWorkspace.id === item.id}
                            className="flex items-center h-full text-left w-full focus:outline-none focus:ring-0"
                            type="button"
                          >
                            <WorkspaceAvatar className="w-10 h-10 m-2 ml-0">
                              {item.name[0].toUpperCase()}W
                            </WorkspaceAvatar>
                            <div className="flex flex-col flex-grow">
                              <span className="text-sm font-medium text-green-900 line-clamp-1">
                                {item.name}
                              </span>
                              <span className="text-xs font-light text-green-800 line-clamp-1">
                                {userPlan}
                              </span>
                            </div>
                          </button>
                        </li>
                        <hr className="text-light-blue-light " />
                      </ul>
                    );
                  })}
                </li>
                <li className="hover:bg-gray-300 px-1">
                  <CreateButton
                    create="workspace"
                    className=" w-full border-none animate-none"
                    type="text-variant"
                    iconStart={<HiPlusCircle className="mr-1 w-5 h-5" />}
                    text={<Typography>New Workspace</Typography>}
                  />
                </li>
                <hr className="text-light-blue-light " />
                <Link
                  to="/workspace/settings"
                  onClick={() => {
                    if (setSidebarOpen) {
                      setSidebarOpen(false);
                    }
                    setOpen(false);
                  }}
                >
                  <li className="flex flex-row p-4 hover:bg-gray-300">
                    <HiCog className="mr-2 w-5 h-5" />
                    <Typography>Workspace Settings</Typography>
                  </li>
                </Link>
              </ul>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
export default WorkspaceModal;
