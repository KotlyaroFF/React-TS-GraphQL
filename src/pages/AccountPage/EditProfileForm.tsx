import { useFormik } from "formik";
import * as Yup from "yup";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { FC, useState } from "react";
import { useMutation } from "@apollo/client";
import { HiBadgeCheck } from "react-icons/hi";
import Typography from "../../components/UI/Typography";
import Button from "../../components/UI/Button";
import FormTextItem from "../../components/Form/FormTextItem";
import { UserModel } from "../../graphql/types";
import { USER_UPDATE } from "../../graphql/mutations/updateUser";
import Alert from "../../components/UI/Alert";
import { MutationType } from "../../types/types";

const FormSchema = Yup.object().shape({
  "First Name": Yup.string()
    .min(3, "Too Short!")
    .max(25, "Too Long!")
    .required("Required"),
  "Last Name": Yup.string()
    .min(3, "Too Short!")
    .max(25, "Too Long!")
    .required("Required"),
});

const EditProfileForm: FC<{ user: UserModel }> = ({ user }) => {
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [updateUserMutation, { loading }] =
    useMutation<MutationType<"updateUser">>(USER_UPDATE);
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
      "First Name": user.firstname,
      "Last Name": user.lastname,
    },
    isInitialValid: false,
    onSubmit: async (values) => {
      await updateUserMutation({
        variables: {
          firstname: values["First Name"],
          lastname: values["Last Name"],
        },
      });
      setOpenAlert(true);
    },
    validationSchema: FormSchema,
  });

  if (openAlert) {
    setTimeout(() => {
      setOpenAlert(false);
    }, 3000);
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="flex border-2 border-white rounded-lg self-center w-full bg-white shadow -mx-6  p-6 flex-col max-w-xl"
    >
      <div className="flex flex-row flex-wrap gap-4 justify-between">
        <div className="my-auto min-w-max pr-1">
          <Typography variant="bold" size="title" className="min-w-max">
            Account Settings
          </Typography>
        </div>
        <div>
          <Button
            isLoading={loading}
            submit
            type="primary"
            disabled={!isValid}
            text="Save changes"
          />
        </div>
      </div>
      {Object.keys(values).map((key) => (
        <FormTextItem
          key={key}
          label={key}
          id={key + 1}
          name={key}
          placeholder={`Enter your ${key.toLowerCase()}`}
          onChangeHandler={handleChange}
          onBlurHandler={handleBlur}
          values={values}
          errors={errors}
          touched={touched}
        />
      ))}
      {openAlert && (
        <div className="absolute top-0 left-0 w-full">
          <Alert
            text="Personal data has been successfully changed!"
            icon={<HiBadgeCheck className="h-5 w-5 text-success" />}
            variant="success"
          />
        </div>
      )}
    </form>
  );
};
export default EditProfileForm;
