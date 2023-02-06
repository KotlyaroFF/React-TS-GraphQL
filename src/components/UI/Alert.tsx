import { FC, ReactNode } from "react";

interface AlertProps {
  variant?: "success" | "default" | "info" | "error";
  icon?: ReactNode;
  buttonClosed?: ReactNode;
  text: string | ReactNode;
  className?: string;
}

const Alert: FC<AlertProps> = ({
  variant = "default",
  icon,
  buttonClosed,
  text,
  className,
}) => {
  let variantColor: string;
  switch (variant) {
    case "success":
      variantColor = "bg-green-200 rounded-b-lg border-t-0";
      break;
    case "error":
      variantColor = "bg-red-200 rounded-b-lg border-t-0";
      break;
    case "info":
      variantColor = "bg-gray-300 rounded-lg";
      break;
    case "default":
      variantColor = "bg-gray-600 rounded-lg";
      break;
    default:
      variantColor = "";
  }
  return (
    <div className={`${variantColor} ${className || ""}`}>
      <div className=" p-4">
        <div className="flex">
          <div className="flex-shrink-0">{icon}</div>
          <div className="ml-3">{text}</div>
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">{buttonClosed}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alert;
