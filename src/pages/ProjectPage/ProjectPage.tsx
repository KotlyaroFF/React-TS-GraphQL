import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import Form from "../../containers/Form";
import EditorContainer from "../../containers/EditorContainer";
import Loader from "../../components/UI/Loader";
import { useWorkspaceData } from "../../components/WorkspaceDataProvider/WorkspaceDataProvider";
import { TOOL } from "../../graphql/queries/tool";
import { QueryType } from "../../types/types";
import { AnswerModel, ToolModel } from "../../graphql/types";
import PageLoader from "../../components/UI/PageLoader";

const ProjectPage = () => {
  const params = useParams();
  const {
    project,
    setSelectProject,
    selectProject,
    allCategories,
    category,
    categoryLoading,
    selectCategory,
    setSelectCategory,
    allTools,
    answers,
    setTextVariant,
    textVariant,
  } = useWorkspaceData();
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(true);
  const [selectTool, setSelectTool] = useState<ToolModel | null>(null);

  const [tool] = useLazyQuery<QueryType<"tool">>(TOOL, {
    variables: { id: selectProject?.tool },
  });
  useEffect(() => {
    project({ variables: { id: params.id } }).then((res) => {
      setSelectProject(res.data?.project ?? null);
    });
    if (allCategories && allTools && selectProject) {
      allTools.map((tool) => {
        if (selectProject.tool === tool.id) {
          category({ variables: { id: tool.category } }).then((res) => {
            setSelectCategory(res.data?.category ?? null);
          });
        }
        return null;
      });
    }
    if (selectProject) {
      tool({
        variables: { id: selectProject?.tool },
      }).then((res) => setSelectTool(res.data?.tool ?? null));
      answers({ variables: { projectId: selectProject.id } }).then((res) =>
        setTextVariant(res.data?.answers ?? null)
      );
    }
  }, [allCategories, params.id, selectProject, allTools, category]);

  if (
    !selectProject ||
    !selectTool ||
    !selectCategory ||
    !allTools ||
    categoryLoading ||
    !textVariant
  )
    return <PageLoader />;
  return (
    <div className="flex flex-col sm:flex-row grow justify-center relative">
      <Form
        allTools={allTools}
        selectCategory={selectCategory}
        tool={selectTool}
        project={selectProject}
        isEditorOpen={isEditorOpen}
        textVariant={textVariant}
        setTextVariant={setTextVariant}
      />
      <EditorContainer
        isEditorOpen={isEditorOpen}
        setIsEditorOpen={setIsEditorOpen}
      />
    </div>
  );
};

export default ProjectPage;
