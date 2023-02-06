import { FC, useState } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import Typography from "./UI/Typography";
import Button from "./UI/Button";
import ConfirmModal from "./UI/ConfirmModal";
import { useWorkspaceData } from "./WorkspaceDataProvider/WorkspaceDataProvider";
import { MutationType } from "../types/types";
import { DELETE_PROJECT } from "../graphql/mutations/deleteProject";
import { UPDATE_PROJECT } from "../graphql/mutations/updateProject";

const ProjectButtonsGroup: FC<{ className?: string }> = ({ className }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const { selectProject, editor, setSelectProject } = useWorkspaceData();

  const [deleteProjectMutation, deleteProjectResult] = useMutation<
    MutationType<"deleteProject">
  >(DELETE_PROJECT, {
    onCompleted: async () => {
      navigate("/");
    },
  });
  const [updateProjectMutation, updateProjectMutationResult] = useMutation<
    MutationType<"updateProject">
  >(UPDATE_PROJECT, {
    onCompleted: async (data) => {
      setSelectProject(data.updateProject);
      console.log(data.updateProject);
    },
  });

  if (!selectProject) {
    return (
      <div className="flex justify-between items-center">
        <div>
          <div className="h-2.5 bg-gray-300 rounded-full w-24 mb-2.5" />
          <div className="w-32 h-2 bg-gray-200 rounded-full " />
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    editor
      .save()
      .then((outputData: any) => {
        updateProjectMutation({
          variables: {
            projectId: selectProject.id,
            content: JSON.stringify(
              outputData.blocks !== "" ? outputData.blocks : []
            ),
          },
        });
      })
      .catch((error: any) => {
        console.log("Saving failed: ", error);
      });
  };
  console.log(selectProject.content);

  return (
    <div className={`flex flex-row gap-2 h-full ${className || ""}`}>
      <button
        type="button"
        className="text-red-500 px-2 py-3 hover:text-red-600 md:block md:max-w-xs"
        onClick={() => setShowModal(true)}
      >
        Delete
      </button>
      <Button
        text="Cancel"
        type="transparent"
        className="md:block  px-2"
        onClickHandler={() => setShowCancelModal(true)}
      />
      <Button
        onClickHandler={handleSave}
        isLoading={updateProjectMutationResult.loading}
        type="primary"
        text="Save"
        className="md:block w-16 px-4"
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
              id={selectProject.id}
              className="hover:bg-red-700 bg-red-600 w-full "
              text="Confirm"
              type="primary"
              isLoading={deleteProjectResult.loading}
              onClickHandler={async () => {
                await deleteProjectMutation({
                  variables: { projectId: selectProject.id },
                });
                setShowModal(false);
              }}
            />

            {(deleteProjectResult.error ||
              updateProjectMutationResult.error) && (
              <div className="absolute bottom-1">
                <Typography size="extraSmall" className="text-red-600">
                  {deleteProjectResult.error?.message ||
                    updateProjectMutationResult.error?.message}
                </Typography>
              </div>
            )}
          </div>
        }
      />
      <ConfirmModal
        setOpen={setShowCancelModal}
        open={showCancelModal}
        modalTitle={
          <Typography variant="bold" size="title">
            Undo changes?
          </Typography>
        }
        modalContent={
          <div>
            <Typography>
              {"all changes will be "}
              <span className="font-bold underline">lost!</span>
            </Typography>
          </div>
        }
        closeButton={
          <div className="flex mt-4 ml-auto sm:w-1/2 gap-4">
            <Button
              className="w-full"
              text="Cancel"
              type="transparent"
              onClickHandler={() => setShowCancelModal(false)}
            />
            <Button
              id={selectProject.id}
              className="hover:bg-red-700 bg-red-600 w-full "
              text="Confirm"
              type="primary"
              isLoading={deleteProjectResult.loading}
              onClickHandler={() => {
                navigate("/");
                setShowCancelModal(false);
              }}
            />
            {(deleteProjectResult.error ||
              updateProjectMutationResult.error) && (
              <div className="absolute bottom-1">
                <Typography size="extraSmall" className="text-red-600">
                  {deleteProjectResult.error?.message ||
                    updateProjectMutationResult.error?.message}
                </Typography>
              </div>
            )}
          </div>
        }
      />
    </div>
  );
};

export default ProjectButtonsGroup;
