import {  FC } from "react";
import { IFormItemProps } from "./FormTextItem";

interface FormSelectItemProps extends IFormItemProps {
  value: string[] | null;
}

const FormSelectItem: FC<FormSelectItemProps> = ({
  count,
  label,
  id,
  name,
  onChangeHandler,
  onBlurHandler,
  errors,
  touched,
  className,
  value,
}) => (
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
      <select
        id={id}
        onChange={onChangeHandler}
        onBlur={onBlurHandler}
        name={name}
        className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        defaultValue="Canada"
      >
        {value?.map((option) => (
          <option key={option} label={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
    {name !== "email" && (
      <span className="text-sm font-normal text-red-600 absolute -bottom-6 left-0">
        {touched[name] && errors[name]}
      </span>
    )}
  </>
);

export default FormSelectItem;
