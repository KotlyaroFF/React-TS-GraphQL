import { FC, MouseEventHandler, useState } from "react";
import {
  HiDotsVertical,
  HiFolderDownload,
  HiPencil,
  HiTrash,
} from "react-icons/hi";
import { Menu } from "@headlessui/react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import RenameFolderForm from "../RenameFolderForm/RenameFolderForm";
import Typography from "../UI/Typography";
import Dropdown from "../UI/Dropdown";
import Button from "../UI/Button";
import classNames from "../../utils/classNames";
import ConfirmModal from "../UI/ConfirmModal";
import { MutationType } from "../../types/types";
import { useWorkspaceData } from "../WorkspaceDataProvider/WorkspaceDataProvider";
import { DELETE_PROJECT } from "../../graphql/mutations/deleteProject";
import SelectFoldersModal from "./SelectFoldersModal";
import Loader from "../UI/Loader";

interface ProjectItemProps {
  name: string;
  id: string;
  description: string;
  workspaceId?: string;
  folderId?: string;
}

const ProjectItem: FC<ProjectItemProps> = ({
  id,
  name,
  description,
  workspaceId,
  folderId,
}) => {
  const [renameFormOpen, setRenameFormOpen] = useState<string | null>(null);
  const { projects, setAllProjects, allFolders } = useWorkspaceData();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const navigate = useNavigate();

  const [deleteProjectMutation, { loading, error }] = useMutation<
    MutationType<"deleteProject">
  >(DELETE_PROJECT, {
    onCompleted: async () => {
      projects({ variables: { workspaceId, folderId } }).then((res) => {
        setAllProjects(res.data?.projects ?? null);
      });
    },
  });

  const handeDelete: MouseEventHandler<HTMLButtonElement> = async (event) => {
    await deleteProjectMutation({
      variables: { projectId: event.currentTarget.id },
    });
    setShowModal(false);
  };

  if (!allFolders)
    return (
      <div className="block fixed  z-30 bg-white w-56 left-4">
        <div className="border-2 flex  justify-center border-grey-lighter self-center w-full max-w-xl rounded-lg -mx-6 bg-indigo-200 mt-6 p-6 ">
          <Loader />
        </div>
      </div>
    );

  return (
    <li className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white hover:bg-gray-300 shadow">
      <div className="flex w-full items-center justify-between space-x-6 p-6">
        <button
          id={id}
          onClick={(e) => navigate(`/project/${e.currentTarget.id}`)}
          type="button"
          className="flex-1 truncate"
        >
          <div className=" flex items-center space-x-3">
            <h3 className="truncate text-sm font-medium text-gray-900">
              <div
                className={
                  renameFormOpen === id
                    ? "flex items-center  justify-between p-0.5 rounded-lg space-x-3"
                    : "flex items-center justify-between py-1 rounded-lg space-x-3"
                }
              >
                {renameFormOpen === id ? (
                  <RenameFolderForm
                    folderId={folderId}
                    workspaceId={workspaceId}
                    rename="project"
                    projectId={id}
                    initialName={name}
                    setRenameFormOpen={setRenameFormOpen}
                  />
                ) : (
                  <Typography variant="bold">{name}</Typography>
                )}
              </div>
            </h3>
          </div>
          <p className="mt-1 truncate text-start text-sm text-gray-500">
            {description}
          </p>
        </button>
        <Dropdown
          menuButton={
            <Button
              className="shadow-none"
              iconButton
              type="transparent"
              iconStart={<HiDotsVertical className="h-5 w-5" />}
            />
          }
          menuItem={
            <>
              <Menu.Item>
                {({ active }) => (
                  <div>
                    <button
                      id={id}
                      type="button"
                      onClick={() => setOpenModal(true)}
                      className={classNames(
                        active ? "bg-gray-300" : "",
                        "block w-full px-2 py-2 opacity-60  text-left text-sm"
                      )}
                    >
                      <div className="flex items-center">
                        <HiFolderDownload className="h-4 w-4 mr-1" />
                        <Typography size="small">Move to Folder</Typography>
                      </div>
                    </button>
                  </div>
                )}
              </Menu.Item>
              <hr className="text-light-blue-light" />
              <Menu.Item>
                {({ active }) => (
                  <div>
                    <button
                      id={id}
                      type="button"
                      onClick={(event) => {
                        setRenameFormOpen(event.currentTarget.id);
                      }}
                      className={classNames(
                        active ? "bg-gray-300" : "",
                        "block w-full px-2 py-2 text-left text-sm"
                      )}
                    >
                      <div className="flex opacity-60  items-center">
                        <HiPencil className="h-4 w-4 mr-1" />
                        <Typography size="small">Rename</Typography>
                      </div>
                    </button>
                  </div>
                )}
              </Menu.Item>
              <hr className="text-light-blue-light" />
              <Menu.Item>
                {({ active }) => (
                  <div>
                    <Button
                      id={id}
                      onClickHandler={(event) =>
                        event.currentTarget.id === id && setShowModal(true)
                      }
                      type="text-variant"
                      iconStart={<HiTrash className="h-4 w-4" />}
                      className={classNames(
                        active ? "bg-gray-300" : "",
                        " w-full px-2 py-2 h-auto border-none rounded-none opacity-60"
                      )}
                      text={
                        <Typography className="font-gray-500" size="small">
                          Delete
                        </Typography>
                      }
                    />
                  </div>
                )}
              </Menu.Item>
            </>
          }
        />
      </div>
      <SelectFoldersModal
        workspaceId={workspaceId}
        folderId={folderId}
        allFolders={allFolders}
        id={id}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
      <ConfirmModal
        setOpen={setShowModal}
        open={showModal}
        modalTitle={
          <Typography variant="bold" size="title">
            Delete Project
          </Typography>
        }
        modalContent={
          <div>
            <Typography>
              {"Delete Project will be "}
              <span className="font-bold underline">irreversible!</span>
            </Typography>
          </div>
        }
        closeButton={
          <div className="flex mt-4 ml-auto sm:w-1/2 gap-4">
            <Button
              className="w-full"
              text="Cancel"
              type="transparent"
              onClickHandler={() => setShowModal(false)}
            />
            <Button
              id={id}
              className="hover:bg-red-700 bg-red-600 w-full "
              text="Confirm"
              type="primary"
              isLoading={loading}
              onClickHandler={handeDelete}
            />

            {error && (
              <div className="absolute bottom-1">
                <Typography size="extraSmall" className="text-red-600">
                  {error.message}
                </Typography>
              </div>
            )}
          </div>
        }
      />
    </li>
  );
};
export default ProjectItem;
