import { ChangeEvent, FC } from "react";
import { FormikErrors, FormikHandlers, FormikTouched } from "formik";

export interface IFormItemProps {
  count?: number;
  label?: string;
  id: string;
  name: string;
  placeholder?: string;
  onChangeHandler:
    | FormikHandlers["handleChange"]
    | ((e: ChangeEvent) => Promise<void>);
  onBlurHandler?: FormikHandlers["handleBlur"];
  values: { [name: string]: string };
  errors: FormikErrors<{ [name: string]: string }>;
  touched: FormikTouched<{ [name: string]: boolean }>;
  type?: string;
  className?: string;
  autoFocus?: boolean;
}

const FormTextItem: FC<IFormItemProps> = ({
  count,
  label,
  id,
  name,
  placeholder,
  onChangeHandler,
  onBlurHandler,
  values,
  errors,
  touched,
  type = "text",
  className,
  autoFocus = false,
}) => {
  const resizeTextArea = (e: ChangeEvent) => {
    const txHeight = 112;
    const target = e.target as HTMLTextAreaElement;

    if (target.value === "") {
      target.setAttribute("style", `height:${txHeight}px;overflow-y:hidden;`);
    } else {
      target.setAttribute(
        "style",
        `height:${
          target.scrollHeight > txHeight ? target.scrollHeight : txHeight
        }px;overflow-y:hidden;`
      );
    }
  };

  return (
    <>
      {count ? (
        <div
          className="block rounded-full relative
        bg-indigo-100 w-9 h-9 justify-center
        text-center p-1 items-center absolute -top-2 2xl:top-7 left-0 2xl:-left-14"
        >
          <span
            className="text-base
        font-black text-indigo-600 ml-1"
          >
            {count}.
          </span>
        </div>
      ) : (
        <div className="p-4" />
      )}
      <label
        htmlFor={id}
        className={`flex flex-col text-sm font-medium text-gray-700 relative ${className} `}
      >
        {label}
        {type && type === "longtext" ? (
          <textarea
            id={id}
            name={name}
            placeholder={placeholder || "Search your content"}
            className="block mt-1 w-full font-normal rounded-md border-gray-300 shadow-sm
            focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm animate"
            onChange={(e) => {
              onChangeHandler(e);
              resizeTextArea(e);
            }}
            onBlur={onBlurHandler}
            style={{
              height: "112px",
            }}
          />
        ) : (
          <input
            id={id}
            name={name}
            type={type}
            autoFocus={autoFocus}
            placeholder={placeholder || "Search your content"}
            className="block mt-1 w-full font-normal rounded-md border-gray-300 shadow-sm
            focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm animate"
            onChange={onChangeHandler}
            onBlur={onBlurHandler}
            value={values[name]}
          />
        )}
        {name !== "email" && (
          <span className="text-sm font-normal text-red-600 absolute -bottom-6 left-0">
            {touched[name] && errors[name]}
          </span>
        )}
      </label>
    </>
  );
};

export default FormTextItem;
