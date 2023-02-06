import { FC, KeyboardEventHandler, useState } from "react";
import { useMutation } from "@apollo/client";
import { useWorkspaceData } from "../WorkspaceDataProvider/WorkspaceDataProvider";
import { MutationType } from "../../types/types";
import { UPDATE_PROJECT } from "../../graphql/mutations/updateProject";
import { ProjectModel } from "../../graphql/types";
import Spinner from "../UI/Spinner";

interface InputTitleProps {
  className?: string;
  selectProject: ProjectModel | null;
}

const InputTitle: FC<InputTitleProps> = ({ className, selectProject }) => {
  const { project, setSelectProject, setIsLoading, projectResult } =
    useWorkspaceData();
  const [error, setError] = useState<string | null>(null);
  const [updateProjectMutation, { loading }] = useMutation<
    MutationType<"updateProject">
  >(UPDATE_PROJECT, {
    onCompleted: async () => {
      setIsLoading(true);
      project({ variables: { id: selectProject?.id } }).then((res) => {
        setSelectProject(res.data?.project ?? null);
      });
      setIsLoading(false);
    },
  });

  const handleChange: KeyboardEventHandler<HTMLInputElement> = async (e) => {
    if (e.key === "Enter") {
      if ((e.target as HTMLInputElement).value.length < 2) {
        setError("Too Short!");
      } else if ((e.target as HTMLInputElement).value.length > 24) {
        setError("Too Long!");
      } else {
        await updateProjectMutation({
          variables: {
            projectId: selectProject?.id,
            name: (e.target as HTMLInputElement).value,
          },
        });
      }
    }
  };

  if (projectResult.loading && !projectResult.data)
    return (
      <div className="flex justify-between items-center">
        <div>
          <div className="h-2.5 bg-gray-300 rounded-full w-24 mb-2.5" />
          <div className="w-32 h-2 bg-gray-200 rounded-full " />
        </div>
      </div>
    );

  return (
    <div className="py-2 w-full max-w-fit">
      <input
        type="text"
        name="Project Name"
        onKeyDown={handleChange}
        className={`border-0 text-title max-w-full  w-full  focus:outline-0 ${
          className ?? ""
        }`}
        defaultValue={selectProject?.name}
      />
      <span className="text-sm font-normal text-red-600 absolute left-0">
        {error}
      </span>
      {loading && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="fill-gray-500 absolute top-0.5 right-1 animate-spin"
          width="24px"
          height="24px"
          viewBox="0 0 24 24"
        >
          <path d="M12 22C17.5228 22 22 17.5228 22 12H19C19 15.866 15.866 19 12 19V22Z" />
          <path d="M2 12C2 6.47715 6.47715 2 12 2V5C8.13401 5 5 8.13401 5 12H2Z" />
        </svg>
      )}
    </div>
  );
};

export default InputTitle;
