import { Dispatch, FC, Fragment, SetStateAction, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { HiCheck, HiSelector } from "react-icons/hi";
import { useMutation } from "@apollo/client";
import { useWorkspaceData } from "../WorkspaceDataProvider/WorkspaceDataProvider";
import { FolderModel } from "../../graphql/types";
import ConfirmModal from "../UI/ConfirmModal";
import Typography from "../UI/Typography";
import Button from "../UI/Button";
import { MutationType } from "../../types/types";
import classNames from "../../utils/classNames";
import { MOVE_PROJECT_BETWEEN_FOLDERS } from "../../graphql/mutations/moveProjectsBetweenFolders";

interface SelectFoldersModalProps {
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  id: string;
  allFolders: FolderModel[];
  workspaceId?: string;
  folderId?: string;
}

const SelectFoldersModal: FC<SelectFoldersModalProps> = ({
  openModal,
  setOpenModal,
  id,
  allFolders,
  workspaceId,
  folderId,
}) => {
  const { projects, setAllProjects, folders, setAllFolders } =
    useWorkspaceData();

  const [moveProjectsBetweenFoldersMutation, { loading, error }] = useMutation<
    MutationType<"moveProjectsBetweenFolders">
  >(MOVE_PROJECT_BETWEEN_FOLDERS, {
    onCompleted: async () => {
      await projects({ variables: { workspaceId, folderId } }).then((res) => {
        setAllProjects(res.data?.projects ?? null);
      });
      await folders().then((res) => {
        setAllFolders(res.data?.folders ?? null);
      });
    },
  });
  const [selected, setSelected] = useState<FolderModel>(allFolders[0]);

  return (
    <ConfirmModal
      setOpen={setOpenModal}
      open={openModal}
      modalTitle={
        <Typography variant="bold" size="title">
          Select Folder
        </Typography>
      }
      modalContent={
        <div className="py-4">
          <Listbox value={selected} onChange={setSelected}>
            {({ open }) => (
              <>
                <Listbox.Label className="block text-sm font-medium text-gray-700">
                  Assigned to
                </Listbox.Label>
                <div className="relative mt-1">
                  <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                    <span className="block truncate">{selected.name}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <HiSelector
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>

                  <Transition
                    show={open}
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute -top-2 z-40 mt-1 max-h-36 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {allFolders.map((folder) => (
                        <Listbox.Option
                          key={folder.id}
                          className={({ active }) =>
                            classNames(
                              active
                                ? "text-white bg-indigo-600"
                                : "text-gray-900",
                              "relative cursor-default select-none py-2 pl-3 pr-9"
                            )
                          }
                          value={folder}
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={classNames(
                                  selected ? "font-semibold" : "font-normal",
                                  "block truncate"
                                )}
                              >
                                {folder.name}
                              </span>

                              {selected ? (
                                <span
                                  className={classNames(
                                    active ? "text-white" : "text-indigo-600",
                                    "absolute inset-y-0 right-0 flex items-center pr-4"
                                  )}
                                >
                                  <HiCheck
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </>
            )}
          </Listbox>
        </div>
      }
      closeButton={
        <div className="flex mt-4 ml-auto sm:w-1/2 gap-4">
          <Button
            className="w-full"
            text="Cancel"
            type="transparent"
            onClickHandler={() => setOpenModal(false)}
          />
          <Button
            id={id}
            className="hover:bg-red-700 w-full "
            text="Confirm"
            type="primary"
            isLoading={loading}
            onClickHandler={() =>
              moveProjectsBetweenFoldersMutation({
                variables: { projects: id, folderId: selected.id },
              })
            }
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
  );
};
export default SelectFoldersModal;
