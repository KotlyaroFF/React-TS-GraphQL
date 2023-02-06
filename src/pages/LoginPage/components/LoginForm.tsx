import { useFormik } from "formik";
import * as Yup from "yup";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import FormTextItem from "../../../components/Form/FormTextItem";
import Button from "../../../components/UI/Button";
import { useAuth } from "../../../components/AuthProvider/AuthProvider";

const LoginForm: FC<{ fromURL: string }> = ({ fromURL }) => {
  const { login, loginResult, confirmLogin, confirmLoginResult } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState("");
  const [searchParams] = useSearchParams();

  const {
    values,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    setErrors,
  } = useFormik({
    initialValues: {
      email: "",
      token: "",
    },
    onSubmit: async () => {
      await login(values.email.trim());
      navigate(
        {
          search: "?isLogin=true",
        },
        { state: { ...location.state } }
      );
    },
    isInitialValid: false,
    validationSchema: Yup.object().shape({
      email: Yup.string().trim().email("Invalid email").required("Required"),
      token: Yup.number().typeError("Must be a number"),
    }),
  });

  useEffect(() => {
    const param = searchParams.get("isLogin");
    if (param) setIsLogin(param);
  }, [searchParams]);

  const tokenInputHandler = async (e: ChangeEvent) => {
    handleChange(e);
    setErrors({ ...errors, token: "" });
    const value = (e.target as HTMLInputElement).value
      .trim()
      .replace(/\s/g, "");
    if (value.length === 6 && isValid) {
      confirmLogin(values.email.trim(), value, fromURL);
    }
  };

  useEffect(() => {
    if (confirmLoginResult?.error?.message)
      setErrors({ ...errors, token: confirmLoginResult.error.message });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmLoginResult.error]);

  return (
    <form onSubmit={handleSubmit}>
      {loginResult?.data?.login && isLogin ? (
        <div className="lg:mb-[108px] mb-[104px] relative">
          <FormTextItem
            autoFocus
            label="Enter your email code"
            id="token"
            name="token"
            placeholder="Enter your code"
            onChangeHandler={tokenInputHandler}
            onBlurHandler={handleBlur}
            values={values}
            errors={errors}
            touched={touched}
          />
          <button
            className="text-sm text-indigo-600 font-light hover:underline animate cursor-pointer absolute right-0 top-8"
            type="button"
            onClick={() => {
              navigate({ search: "" });
              setIsLogin("");
            }}
          >
            Choose other email
          </button>
        </div>
      ) : (
        <>
          <FormTextItem
            autoFocus
            label="Enter your email"
            id="email"
            name="email"
            placeholder="Your email"
            onChangeHandler={handleChange}
            onBlurHandler={handleBlur}
            values={values}
            errors={errors}
            touched={touched}
          />
          <p className="mt-2 mb-2 text-sm h-10 font-light animate">
            {!isValid ? "Type the correct email and press " : "Press "}
            the button and we’ll email you a code for a password-free
            registration.
          </p>
          <Button
            text="Continue"
            submit
            disabled={!isValid}
            isLoading={loginResult.loading}
            className="w-full"
          />
        </>
      )}
    </form>
  );
};

export default LoginForm;
