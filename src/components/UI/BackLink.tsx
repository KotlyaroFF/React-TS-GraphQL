import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { HiChevronLeft } from "react-icons/hi";
import Typography from "./Typography";

interface BackLinkProps {
  className?: string;
}

const BackLink: FC<BackLinkProps> = ({ className }) => {
  const navigate = useNavigate();
  return (
    <button
      className={`flex ${className ?? ""}`}
      type="button"
      onClick={() => navigate(-1)}
    >
      <div className="my-auto">
        <HiChevronLeft className="w-5 h-5 animate" />
      </div>
      <div>
        <Typography variant="bold" size="small">
          Back
        </Typography>
      </div>
    </button>
  );
};

export default BackLink;
