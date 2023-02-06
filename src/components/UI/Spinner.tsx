import { FC } from "react";

const Spinner: FC<{ className?: string }> = ({ className }) => (
  <div
    className={`w-full opacity-30 fill-white absolute bg-gray-900  left-0 top-0 h-full rounded flex justify-center items-center w-full  ${
      className || ""
    } `}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="animate-spin"
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
    >
      <path d="M12 22C17.5228 22 22 17.5228 22 12H19C19 15.866 15.866 19 12 19V22Z" />
      <path d="M2 12C2 6.47715 6.47715 2 12 2V5C8.13401 5 5 8.13401 5 12H2Z" />
    </svg>
  </div>
);
export default Spinner;
