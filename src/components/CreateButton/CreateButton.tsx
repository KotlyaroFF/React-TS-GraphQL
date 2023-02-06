import { FC, useState } from "react";
import { useMutation } from "@apollo/client";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../UI/ConfirmModal";
import Button, { IButtonProps } from "../UI/Button";
import Typography from "../UI/Typography";
import FormTextItem from "../Form/FormTextItem";
import { CREATE_WORKSPACE } from "../../graphql/mutations/createWorkspace";
import { MutationType } from "../../types/types";
import { useWorkspaceData } from "../WorkspaceDataProvider/WorkspaceDataProvider";
import { CREATE_FOLDER } from "../../graphql/mutations/createFolder";
import {
  FolderNameSchema,
  WorkspaceNameSchema,
} from "../../utils/validationSchema";

interface CreateButton extends IButtonProps {
  create: "workspace" | "folder";
}

const CreateButton: FC<CreateButton> = ({
  text,
  type = "transparent",
  className,
  disabled = false,
  iconButton,
  iconStart,
  iconEnd,
  create = "workspace",
}) => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const {
    setSelectWorkspace,
    setAllWorkspaces,
    workspaces,
    setIsLoading,
    setAllFolders,
  } = useWorkspaceData();
  const { selectWorkspace, folders } = useWorkspaceData();
  const [createWorkspaceMutation, createWorkspaceResult] = useMutation<
    MutationType<"createWorkspace">
  >(CREATE_WORKSPACE, {
    onCompleted: async (data) => {
      setSelectWorkspace(data?.createWorkspace ?? null);
      workspaces().then((res) => {
        setAllWorkspaces(res.data?.workspaces ?? null);
      });
      setOpenModal(false);
      setIsLoading(false);
      navigate("/");
    },
  });
  const [createFolderMutation, createFolderResult] = useMutation<
    MutationType<"createProject">
  >(CREATE_FOLDER, {
    onCompleted: async () => {
      setIsLoading(true);
      folders().then((res) => {
        setAllFolders(res.data?.folders ?? null);
      });
      setIsLoading(false);
      setOpenModal(false);
    },
  });
  const initialValue: { [key: string]: string } =
    create === "workspace" ? { "Workspace Name": "" } : { "Folder Name": "" };
  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormik({
      initialValues: initialValue,
      isInitialValid: false,
      onSubmit: async (values) => {
        setIsLoading(true);

        if (create === "workspace") {
          await createWorkspaceMutation({
            variables: {
              name: values[Object.keys(initialValue).toString()],
            },
          });
        } else {
          await createFolderMutation({
            variables: {
              name: values[Object.keys(initialValue).toString()],
              workspaceId: selectWorkspace?.id,
            },
          });
        }
      },
      validationSchema:
        create === "workspace" ? WorkspaceNameSchema : FolderNameSchema,
    });

  const handleOpen = () => {
    setOpenModal(true);
  };

  return (
    <div>
      <Button
        className={className}
        disabled={disabled}
        iconStart={iconStart}
        type={type}
        iconButton={iconButton}
        iconEnd={iconEnd}
        text={text}
        onClickHandler={handleOpen}
      />
      <ConfirmModal
        open={openModal}
        setOpen={setOpenModal}
        modalTitle={
          <Typography variant="bold" size="title">
            {create === "workspace" ? `Create Workspace` : "Create Folder"}
          </Typography>
        }
        closeButton={
          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex w-full sm:items-end -mt-8 flex-col gap-4">
              {Object.keys(values).map((key) => (
                <FormTextItem
                  className="w-full"
                  key={key}
                  label={key}
                  id={key + 1}
                  name={key}
                  placeholder={`Enter ${key.toLowerCase()}`}
                  onChangeHandler={handleChange}
                  onBlurHandler={handleBlur}
                  values={values}
                  errors={errors}
                  touched={touched}
                />
              ))}
              <div className="flex pt-4 sm:w-1/2 gap-4">
                <Button
                  submit
                  className="w-full"
                  text="Confirm"
                  type="primary"
                  isLoading={
                    createWorkspaceResult.loading || createFolderResult.loading
                  }
                />
                <Button
                  className="w-full"
                  text="Cancel"
                  type="transparent"
                  onClickHandler={() => setOpenModal(false)}
                />
                {(createWorkspaceResult.error || createFolderResult.error) && (
                  <div className="absolute bottom-1">
                    <Typography size="extraSmall" className="text-red-700">
                      Something went wrong
                    </Typography>
                  </div>
                )}
              </div>
            </div>
          </form>
        }
        modalContent={
          <div>
            <Typography>
              {create === "workspace"
                ? "Enter name to create Workspace"
                : "Enter name to create Folder"}
            </Typography>
          </div>
        }
      />
    </div>
  );
};
export default CreateButton;
