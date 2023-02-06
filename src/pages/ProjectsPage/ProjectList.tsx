import { FC } from "react";
import { HiDocumentAdd } from "react-icons/hi";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import Typography from "../../components/UI/Typography";
import Button from "../../components/UI/Button";
import ProjectItem from "../../components/ProjectItem/ProjectItem";
import { ProjectModel, WorkspaceModel } from "../../graphql/types";
import { CREATE_PROJECT } from "../../graphql/mutations/createProject";
import { MutationType } from "../../types/types";
import { useWorkspaceData } from "../../components/WorkspaceDataProvider/WorkspaceDataProvider";
import Spinner from "../../components/UI/Spinner";

const ProjectList: FC<{
  folderId?: string;
  project: ProjectModel[];
  workspace: WorkspaceModel;
}> = ({ project, folderId, workspace }) => {
  const navigate = useNavigate();
  const { allCategories, category, setSelectCategory, setIsLoading } =
    useWorkspaceData();
  const [createProjectMutation, createProjectResult] = useMutation<
    MutationType<"createProject">
  >(CREATE_PROJECT, {
    onCompleted: (res) => {
      setIsLoading(true);
      if (allCategories) {
        category({
          variables: { id: allCategories[0].id },
        }).then((res) => {
          setSelectCategory(res.data?.category ?? null);
        });
      }
      setIsLoading(false);

      navigate(`/project/${res.createProject.id}`);
    },
  });

  return (
    <div>
      <div className=" px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="min-w-0 flex-1 my-3">
          <Typography size="title" variant="bold" className="sm:truncate ">
            Projects
          </Typography>
        </div>
        <div className="mt-4 flex sm:mt-0 sm:ml-4">
          <Button
            type="primary"
            isLoading={createProjectResult.loading}
            iconStart={<HiDocumentAdd className="w-5 h-5" />}
            text="Create Project"
            onClickHandler={() =>
              createProjectMutation({
                variables: { workspaceId: workspace.id, folderId },
              })
            }
          />
        </div>
      </div>
      <ul className="grid grid-cols-1 p-6 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {project.map((person) => (
          <div key={person.id}>
            <ProjectItem
              folderId={folderId}
              workspaceId={workspace.id}
              id={person.id}
              name={person.name}
              description={person.name}
            />
          </div>
        ))}
      </ul>
    </div>
  );
};

export default ProjectList;
