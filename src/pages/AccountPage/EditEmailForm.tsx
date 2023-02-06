import { FC, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { HiBadgeCheck, HiMail, HiExclamation } from "react-icons/hi";
import { useMutation } from "@apollo/client";
import InputEmail from "./InputEmail";
import Button from "../../components/UI/Button";
import { UserModel } from "../../graphql/types";
import { EMAIL_CHANGE } from "../../graphql/mutations/emailChange";
import Alert from "../../components/UI/Alert";
import ConfirmModal from "../../components/UI/ConfirmModal";
import Typography from "../../components/UI/Typography";
import { MutationType } from "../../types/types";

const FormSchema = Yup.object().shape({
  Email: Yup.string().email().required("Required"),
});

const EditEmailForm: FC<{ user: UserModel }> = ({ user }) => {
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const [changeEmail, { loading }] = useMutation<MutationType<"changeEmail">>(
    EMAIL_CHANGE,
    {
      onCompleted: () => {
        setOpenModal(false);
        setOpenAlert(true);
      },
    }
  );

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
      Email: user.email,
    },
    isInitialValid: false,
    onSubmit: () => {
      setOpenModal(true);
    },
    validationSchema: FormSchema,
  });

  const handleSuccess = async (values: { Email: string }) => {
    await changeEmail({
      variables: {
        email: values.Email,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-6 flex-col md:flex-row">
      {Object.keys(values).map((key) => (
        <InputEmail
          key={key}
          label={key}
          id={key + 1}
          name={key}
          onChangeHandler={handleChange}
          onBlurHandler={handleBlur}
          values={values}
          errors={errors}
          touched={touched}
        />
      ))}
      <Button
        iconStart={<HiMail className="h-4 w-4" />}
        className="mt-auto h-10"
        text="Send mail"
        type="primary"
        submit
        disabled={!isValid}
      />
      <ConfirmModal
        open={openModal}
        setOpen={setOpenModal}
        icon={<HiExclamation className="w-10 h-10 text-red-600" />}
        modalTitle={
          <Typography className="ml-4" variant="bold" size="title">
            Confirm
          </Typography>
        }
        closeButton={
          <div className="flex mt-4 ml-auto sm:w-1/2 gap-4">
            <Button
              className="w-full"
              text="Confirm"
              type="primary"
              onClickHandler={() => handleSuccess(values)}
              isLoading={loading}
            />
            <Button
              className="w-full"
              text="Cancel"
              type="transparent"
              onClickHandler={() => setOpenModal(false)}
            />
          </div>
        }
        modalContent={
          <Typography className="ml-4">
            Do you really want to change your email?
          </Typography>
        }
      />
      {openAlert && (
        <div className="absolute top-0 left-0 w-full">
          <Alert
            text="Mail sent, check your email"
            icon={<HiBadgeCheck className="h-5 w-5 text-green-600" />}
            variant="success"
          />
        </div>
      )}
    </form>
  );
};

export default EditEmailForm;
