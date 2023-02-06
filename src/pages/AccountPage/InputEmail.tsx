import { FC } from "react";

import { IFormItemProps } from "../../components/Form/FormTextItem";

const InputEmail: FC<IFormItemProps> = ({
  label,
  id,
  name,
  onChangeHandler,
  onBlurHandler,
  values,
  errors,
  touched,
}) => (
  <div className="flex-grow w-full">
    <label
      htmlFor="firstName"
      className="flex flex-col text-sm font-medium text-gray-700 relative undefined "
    >
      {label}
      <div>
        <input
          id={id}
          name={name}
          type="text"
          placeholder="Search your content"
          className="block mt-1 w-full font-normal rounded-md border-gray-300 shadow-sm focus:border-indigo-500
          focus:ring-indigo-500 sm:text-sm animate"
          onChange={onChangeHandler}
          onBlur={onBlurHandler}
          value={values[name]}
        />
      </div>
    </label>
    <span className="text-small font-medium text-primary-error absolute -bottom-4 left-0">
      {touched[name] && errors[name]}
    </span>
  </div>
);

export default InputEmail;
