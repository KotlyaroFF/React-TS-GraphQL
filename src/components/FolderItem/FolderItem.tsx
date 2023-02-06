import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { HiDotsVertical, HiPencil, HiTrash } from "react-icons/hi";
import { Menu } from "@headlessui/react";
import { useMutation } from "@apollo/client";
import RenameFolderForm from "../RenameFolderForm/RenameFolderForm";
import Typography from "../UI/Typography";
import Dropdown from "../UI/Dropdown";
import Button from "../UI/Button";
import classNames from "../../utils/classNames";
import { DELETE_FOLDER } from "../../graphql/mutations/deleteFolder";
import { MutationType } from "../../types/types";
import ConfirmModal from "../UI/ConfirmModal";
import { useWorkspaceData } from "../WorkspaceDataProvider/WorkspaceDataProvider";

interface FolderItemProps {
  name: string;
  projectQuantity: string | number;
  id: string;
  index: number;
}

const AvatarFolderColors: string[] = [
  "bg-pink-600",
  "bg-purple-600",
  "bg-yellow-500",
  "bg-green-500",
];

const FolderItem: FC<FolderItemProps> = ({
  name,
  projectQuantity,
  id,
  index,
}) => {
  const [renameFormOpen, setRenameFormOpen] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const { folders, setAllFolders } = useWorkspaceData();

  const [deleteFolderMutation, { loading, error }] = useMutation<
    MutationType<"deleteFolder">
  >(DELETE_FOLDER, {
    onCompleted: async () => {
      folders().then((res) => {
        setAllFolders(res.data?.folders ?? null);
      });
    },
  });

  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const AvatarColor =
    AvatarFolderColors[index >= AvatarFolderColors.length ? index - 4 : index];

  const handeDelete = async (id: string) => {
    await deleteFolderMutation({
      variables: { folderId: id },
    });
    setShowModal(false);
  };

  return (
    <li key={name} className="col-span-1 flex rounded-md shadow-sm">
      <div
        className={classNames(
          AvatarColor,
          "flex-shrink-0  flex items-center justify-center w-16  text-white text-sm font-medium rounded-l-lg"
        )}
      >
        {initials}
      </div>
      <div
        className={classNames(
          "px-2",
          "flex flex-1 items-center justify-between bg-white hover:bg-gray-300  rounded-r-lg"
        )}
      >
        {renameFormOpen === id ? (
          <div className="my-4 py-px">
            <RenameFolderForm
              initialName={name}
              folderId={id}
              rename="folder"
              setRenameFormOpen={setRenameFormOpen}
            />
          </div>
        ) : (
          <Link
            to={`/folder/${id}`}
            className="flex-1 text-start truncate text-ellipsis w-16 px-4 py-2"
          >
            <Typography>{name}</Typography>
            <Typography
              className="block mt-1.5"
              size="extraSmall"
              color="grey-light"
            >
              {projectQuantity} Projects
            </Typography>
          </Link>
        )}
        <div className="flex-shrink-0 relative overflow-visible pr-2">
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
                        onClick={(event) => {
                          setRenameFormOpen(event.currentTarget.id);
                        }}
                        className={classNames(
                          active ? "bg-gray-300 rounded-t-sm" : "",
                          " w-full px-2 py-2 text-left opacity-60 text-sm"
                        )}
                      >
                        <div className="flex items-center ">
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
                        onClickHandler={() => setShowModal(true)}
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
        <ConfirmModal
          setOpen={setShowModal}
          open={showModal}
          modalTitle={
            <Typography variant="bold" size="title">
              Delete Folder
            </Typography>
          }
          modalContent={
            <div>
              <Typography>
                {"Delete Folder will be "}
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
                onClickHandler={() => handeDelete(id)}
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
      </div>
    </li>
  );
};

export default FolderItem;
