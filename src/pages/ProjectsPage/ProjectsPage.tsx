import { FC, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProjectPageFolders from "./ProjectPageFolders";
import ProjectList from "./ProjectList";
import NewProject from "./NewProject";
import { useWorkspaceData } from "../../components/WorkspaceDataProvider/WorkspaceDataProvider";
import Loader from "../../components/UI/Loader";
import Spinner from "../../components/UI/Spinner";
import PageLoader from "../../components/UI/PageLoader";

const ProjectsPage: FC = () => {
  const { id } = useParams();
  const {
    allFolders,
    selectWorkspace,
    folders,
    setAllFolders,
    projects,
    setAllProjects,
    allProjects,
    setSelectProject,
    setIsLoading,
  } = useWorkspaceData();

  useEffect(() => {
    if (selectWorkspace) {
      folders({ variables: { workspaceId: selectWorkspace.id } }).then(
        (res) => {
          setAllFolders(res.data?.folders ?? null);
        }
      );
      projects({
        variables: { folderId: id, workspaceId: selectWorkspace?.id },
      }).then((res) => {
        setAllProjects(res.data?.projects ?? null);
      });
    }
    setSelectProject(null);
  }, [selectWorkspace, id]);

  if (!allFolders || !selectWorkspace || !allProjects) {
    return <PageLoader />;
  }

  return (
    <div className="p-8">
      {!id && <ProjectPageFolders folders={allFolders} />}
      {allProjects.length ? (
        <ProjectList
          folderId={id}
          workspace={selectWorkspace}
          project={allProjects}
        />
      ) : (
        <NewProject folderId={id} workspace={selectWorkspace} />
      )}
    </div>
  );
};
export default ProjectsPage;
