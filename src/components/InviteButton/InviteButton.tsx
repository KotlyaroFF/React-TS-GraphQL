import { FC, useState } from "react";
import { useMutation } from "@apollo/client";
import { HiBadgeCheck } from "react-icons/hi";
import { useFormik } from "formik";
import * as Yup from "yup";
import ConfirmModal from "../UI/ConfirmModal";
import Button, { IButtonProps } from "../UI/Button";
import Alert from "../UI/Alert";
import { INVITE_TO_WORKSPACE } from "../../graphql/mutations/inviteToWorkspace";
import InputEmail from "../../pages/AccountPage/InputEmail";
import Loader from "../UI/Loader";
import Typography from "../UI/Typography";
import { MutationType } from "../../types/types";
import { useWorkspaceData } from "../WorkspaceDataProvider/WorkspaceDataProvider";

const FormSchema = Yup.object().shape({
  Email: Yup.string().email().required("Required"),
});

const InviteButton: FC<IButtonProps> = ({
  text,
  type = "transparent",
  className,
  disabled = false,
  iconButton,
  iconStart,
  iconEnd,
}) => {
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { selectWorkspace, setSelectWorkspace, workspace } = useWorkspaceData();

  const [inviteToWorkspaceMutation, { loading }] = useMutation<
    MutationType<"inviteToWorkspace">
  >(INVITE_TO_WORKSPACE, {
    fetchPolicy: "network-only",
    onCompleted: async () => {
      workspace().then((res) => {
        setSelectWorkspace(res.data?.workspace ?? null);
      });
      setOpenModal(false);
      setOpenAlert(true);
    },
  });
  if (openAlert) {
    setTimeout(() => {
      setOpenAlert(false);
    }, 3000);
  }
  const {
    values,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormik({
    initialValues: {
      Email: "",
    },
    isInitialValid: false,
    onSubmit: async () => {
      await inviteToWorkspaceMutation({
        variables: {
          email: values.Email,
          workspaceId: selectWorkspace?.id,
        },
      });
    },
    validationSchema: FormSchema,
  });

  const handleOpen = () => {
    setOpenModal(true);
    values.Email = "";
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
            Email
          </Typography>
        }
        closeButton={
          <form onSubmit={handleSubmit} className="w-full ">
            <div className="flex flex-col sm:items-end gap-4">
              {Object.keys(values).map((key) => (
                <InputEmail
                  className="w-full"
                  key={key}
                  id={key + 1}
                  name={key}
                  onChangeHandler={handleChange}
                  onBlurHandler={handleBlur}
                  values={values}
                  errors={errors}
                  touched={touched}
                  type={key}
                />
              ))}
              <div className="flex  sm:w-1/2 gap-4">
                <Button
                  className="w-full"
                  text="Cancel"
                  type="transparent"
                  onClickHandler={() => {
                    setOpenModal(false);
                  }}
                />
                <Button
                  submit
                  className="w-full"
                  text="Confirm"
                  type="primary"
                  disabled={!isValid}
                  isLoading={loading}
                />
              </div>
            </div>
          </form>
        }
        modalContent={
          <div>
            <Typography>Enter email to send invitation to Workspace</Typography>
          </div>
        }
      />
      {openAlert && (
        <div className="absolute top-0 left-0 w-full">
          <Alert
            text="Mail sent, check your email"
            icon={<HiBadgeCheck className="h-5 w-5 text-success" />}
            variant="success"
          />
        </div>
      )}
    </div>
  );
};
export default InviteButton;
