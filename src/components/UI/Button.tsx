import { FC, MouseEventHandler, ReactNode, useMemo } from "react";
import Spinner from "./Spinner";

export type IButtonProps = {
  text?: string | ReactNode;
  type?: "primary" | "transparent" | "text-variant" | "other";
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  submit?: boolean;
  onClickHandler?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  disabled?: boolean;
  iconButton?: boolean;
  isLoading?: boolean;
  onPointerEnter?: MouseEventHandler<HTMLButtonElement>;
  onPointerLeave?: MouseEventHandler<HTMLButtonElement>;
  id?: string;
  autoFocus?: boolean;
  onMouseEnter?: MouseEventHandler<HTMLButtonElement>;
  onMouseLeave?: MouseEventHandler<HTMLButtonElement>;
};

const Button: FC<IButtonProps> = ({
  text,
  type = "primary",
  submit,
  onClickHandler,
  className,
  disabled = false,
  iconButton,
  isLoading,
  iconStart,
  iconEnd,
  onPointerEnter,
  onPointerLeave,
  id,
  autoFocus,
  onMouseEnter,
  onMouseLeave,
}) => {
  const buttonClass = useMemo(() => {
    const listOfClassNames = [
      "font-Inter",
      "rounded-md",
      "min-w-max",
      "font-medium",
      "flex",
      "disabled:bg-indigo-300",
      "items-center",
      "shadow-sm",
      "focus:outline-none",
      "relative",
    ];

    const isAnyType = !["text-variant", "primary"].includes(type);

    if (iconButton)
      listOfClassNames.push(
        "p-1",
        "h-auto",
        ...(isAnyType ? ["border-0"] : [])
      );
    else
      listOfClassNames.push(
        "p-3",
        "h-12",
        ...(isAnyType ? ["border", "border-black"] : [])
      );

    if (type === "text-variant")
      listOfClassNames.push(
        "text-xs",
        "border",
        "border-transparent",
        "border-indigo-300",
        "hover:border-indigo-600"
      );
    else if (type === "primary")
      listOfClassNames.push(
        "border-0",
        "text-white text-button",
        "hover:bg-indigo-700",
        "hover:text-button",
        "justify-center",
        "bg-indigo-600",
        "text-sm",
        "focus:ring-2",
        "focus:ring-indigo-500",
        "focus:ring-offset-2"
      );
    else {
      listOfClassNames.push(
        "text-button",
        "hover:bg-black",
        "hover:text-white",
        "justify-center",
        "text-sm"
      );

      if (type === "transparent") listOfClassNames.push("bg-transparent");
    }

    if (className) listOfClassNames.push(className);

    return listOfClassNames.join(" ").trim();
  }, [type, className, iconButton]);

  return (
    <button
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      id={id}
      type={submit ? "submit" : "button"}
      className={buttonClass}
      onClick={onClickHandler}
      autoFocus={autoFocus}
      disabled={disabled || isLoading}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      {isLoading && <Spinner />}
      {iconStart && (
        <div className={!iconButton ? "mr-1" : ""}>{iconStart}</div>
      )}
      {!iconButton && text}
      {iconEnd && <div className={!iconButton ? "ml-1" : ""}>{iconEnd}</div>}
    </button>
  );
};

export default Button;
