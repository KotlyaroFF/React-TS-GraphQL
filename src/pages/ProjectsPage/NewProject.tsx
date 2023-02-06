import { FC } from "react";
import { HiOutlineDocumentAdd } from "react-icons/hi";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { MutationType } from "../../types/types";
import { CREATE_PROJECT } from "../../graphql/mutations/createProject";
import { WorkspaceModel } from "../../graphql/types";
import { useWorkspaceData } from "../../components/WorkspaceDataProvider/WorkspaceDataProvider";
import Spinner from "../../components/UI/Spinner";
import PageLoader from "../../components/UI/PageLoader";

interface NewProjectProps {
  workspace: WorkspaceModel;
  folderId?: string;
}

const NewProject: FC<NewProjectProps> = ({ workspace, folderId }) => {
  const navigate = useNavigate();
  const { allCategories, category, setSelectCategory, setIsLoading } =
    useWorkspaceData();
  const [createProjectMutation, createProjectResult] = useMutation<
    MutationType<"createProject">
  >(CREATE_PROJECT, {
    onCompleted: (res) => {
      setIsLoading(true);
      if (allCategories) {
        category({ variables: { id: allCategories[0].id } }).then((res) => {
          setSelectCategory(res.data?.category ?? null);
        });
      }
      setIsLoading(false);
      navigate(`/project/${res.createProject.id}`);
    },
  });

  return (
    <div className="flex bg-primary-lighter justify-center">
      <button
        type="button"
        className="text-center hover:bg-grey animate shadow bg-white p-4 mt-4 rounded-lg"
      >
        <HiOutlineDocumentAdd className="mx-auto h-12 w-12 text-gray-400" />

        <h3 className="mt-2 text-sm font-medium text-gray-900">No projects</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating a new project.
        </p>
        <div className="mt-6">
          <button
            onClick={() =>
              createProjectMutation({
                variables: { workspaceId: workspace.id, folderId },
              })
            }
            type="button"
            className="inline-flex relative items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {createProjectResult.loading && <Spinner />}
            <HiOutlineDocumentAdd
              className="-ml-1 mr-2 h-5 w-5"
              aria-hidden="true"
            />
            New Project
          </button>
        </div>
      </button>
    </div>
  );
};
export default NewProject;
