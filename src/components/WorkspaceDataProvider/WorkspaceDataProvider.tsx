import {
  createContext,
  Dispatch,
  FC,
  memo,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  useLazyQuery,
  LazyQueryExecFunction,
  OperationVariables,
  QueryResult,
} from "@apollo/client";
import { useLocation } from "react-router-dom";
import {
  AnswerModel,
  FolderModel,
  ProjectModel,
  ToolCategoryModel,
  ToolModel,
  WorkspaceModel,
} from "../../graphql/types";
import { WORKSPACES } from "../../graphql/queries/workspaces";
import { QueryType } from "../../types/types";
import { WORKSPACE } from "../../graphql/queries/workspace";
import { FOLDERS } from "../../graphql/queries/folders";
import { PROJECTS } from "../../graphql/queries/projects";
import { PROJECT } from "../../graphql/queries/progect";
import { CATEGORIES } from "../../graphql/queries/categories";
import { CATEGORY } from "../../graphql/queries/category";
import { TOOLS } from "../../graphql/queries/tolls";
import { ANSWERS } from "../../graphql/queries/answers";

interface IWorkspaceDataContext {
  selectWorkspace: WorkspaceModel | null;
  setSelectWorkspace: Dispatch<SetStateAction<WorkspaceModel | null>>;
  setAllWorkspaces: Dispatch<SetStateAction<WorkspaceModel[] | null>>;
  allWorkspaces: WorkspaceModel[] | null;
  allFolders: FolderModel[] | null;
  setAllFolders: Dispatch<SetStateAction<FolderModel[] | null>>;
  selectFolders: FolderModel | null;
  allProjects: ProjectModel[] | null;
  setAllProjects: Dispatch<SetStateAction<ProjectModel[] | null>>;
  selectProject: ProjectModel | null;
  setSelectProject: Dispatch<SetStateAction<ProjectModel | null>>;
  projects: LazyQueryExecFunction<QueryType<"projects">, OperationVariables>;
  folders: LazyQueryExecFunction<QueryType<"folders">, OperationVariables>;
  setSelectFolders: Dispatch<SetStateAction<FolderModel | null>>;
  workspace: LazyQueryExecFunction<QueryType<"workspace">, OperationVariables>;
  workspaces: LazyQueryExecFunction<
    QueryType<"workspaces">,
    OperationVariables
  >;
  categoryLoading: boolean;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  folderLoading: boolean;
  projectLoading: boolean;
  project: LazyQueryExecFunction<QueryType<"project">, OperationVariables>;
  projectResult: QueryResult<QueryType<"project">>;
  allCategories: ToolCategoryModel[] | null;
  selectCategory: ToolCategoryModel | null;
  setSelectCategory: Dispatch<SetStateAction<ToolCategoryModel | null>>;
  category: LazyQueryExecFunction<QueryType<"category">, OperationVariables>;
  allTools: ToolModel[] | null;
  answers: LazyQueryExecFunction<QueryType<"answers">, OperationVariables>;
  textVariant: AnswerModel[] | null;
  setTextVariant: Dispatch<SetStateAction<AnswerModel[] | null>>;
  setEditor: Dispatch<SetStateAction<any>>;
  editor: any;
  openModal: {
    open: boolean;
    text?: string;
    variant?: "success" | "default" | "info" | "error";
  };
  setOpenModal: Dispatch<
    SetStateAction<{
      open: boolean;
      text?: string;
      variant?: "success" | "default" | "info" | "error";
    }>
  >;
}
export const WorkspaceDataContext = createContext<IWorkspaceDataContext>(
  {} as IWorkspaceDataContext
);
const WorkspaceDataProvider: FC<PropsWithChildren> = memo((props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<{
    open: boolean;
    text?: string;
    variant?: "success" | "default" | "info" | "error";
  }>({ open: false });

  const [allWorkspaces, setAllWorkspaces] = useState<WorkspaceModel[] | null>(
    null
  );
  const [selectWorkspace, setSelectWorkspace] = useState<WorkspaceModel | null>(
    null
  );
  const [allFolders, setAllFolders] = useState<FolderModel[] | null>(null);
  const [selectFolders, setSelectFolders] = useState<FolderModel | null>(null);
  const [allProjects, setAllProjects] = useState<ProjectModel[] | null>(null);
  const [selectProject, setSelectProject] = useState<ProjectModel | null>(null);
  const [allCategories, setAllCategories] = useState<
    ToolCategoryModel[] | null
  >(null);
  const [selectCategory, setSelectCategory] =
    useState<ToolCategoryModel | null>(null);
  const [allTools, setAllTools] = useState<ToolModel[] | null>(null);
  const [textVariant, setTextVariant] = useState<AnswerModel[] | null>(null);
  const [editor, setEditor] = useState(undefined);

  const location = useLocation();
  const [project, projectResult] = useLazyQuery<QueryType<"project">>(PROJECT);
  const [categories] = useLazyQuery<QueryType<"categories">>(CATEGORIES);
  const [category, { loading: categoryLoading }] =
    useLazyQuery<QueryType<"category">>(CATEGORY);
  const [tools] = useLazyQuery<QueryType<"tools">>(TOOLS);
  const [workspaces] = useLazyQuery<QueryType<"workspaces">>(WORKSPACES, {
    fetchPolicy: "network-only",
  });
  const [workspace] = useLazyQuery<QueryType<"workspace">>(WORKSPACE, {
    variables: { id: selectWorkspace?.id },
    fetchPolicy: "network-only",
  });
  const [folders, { loading: folderLoading }] = useLazyQuery<
    QueryType<"folders">
  >(FOLDERS, {
    fetchPolicy: "network-only",
    variables: { workspaceId: selectWorkspace?.id },
  });
  const [projects, { loading: projectLoading }] = useLazyQuery<
    QueryType<"projects">
  >(PROJECTS, {
    fetchPolicy: "network-only",
  });
  const [answers] = useLazyQuery<QueryType<"answers">>(ANSWERS, {
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    if (location.pathname !== "/confirm-invite") {
      if (!allWorkspaces) {
        workspaces().then((res) => {
          setSelectWorkspace(res.data?.workspaces[0] ?? null);
          setAllWorkspaces(res.data?.workspaces ?? null);
        });
      }
      if (!allFolders && selectWorkspace) {
        folders().then((res) => {
          setAllFolders(res.data?.folders ?? null);
          setSelectFolders(res.data?.folders[0] ?? null);
        });
      }
      if (!allProjects && selectWorkspace) {
        projects({ variables: { workspaceId: selectWorkspace?.id } }).then(
          (res) => {
            setAllProjects(res.data?.projects ?? null);
          }
        );
      }
      if (!allCategories) {
        categories().then((res) => {
          setAllCategories(res.data?.categories ?? null);
        });
      }
      if (!allTools) {
        tools().then((res) => setAllTools(res.data?.tools ?? null));
      }
    }
  }, [
    allFolders,
    allProjects,
    allWorkspaces,
    location,
    selectWorkspace,
    allCategories,
    allTools,
  ]);
  const value = useMemo(
    () => ({
      allWorkspaces,
      setAllWorkspaces,
      setSelectWorkspace,
      workspace,
      selectWorkspace,
      workspaces,
      allFolders,
      setAllFolders,
      selectFolders,
      setSelectFolders,
      folders,
      allProjects,
      setAllProjects,
      selectProject,
      setSelectProject,
      projects,
      isLoading,
      setIsLoading,
      folderLoading,
      projectLoading,
      project,
      projectResult,
      allCategories,
      selectCategory,
      setSelectCategory,
      category,
      allTools,
      answers,
      textVariant,
      setTextVariant,
      categoryLoading,
      editor,
      setEditor,
      openModal,
      setOpenModal,
    }),
    [
      allWorkspaces,
      workspace,
      selectWorkspace,
      setSelectWorkspace,
      setAllWorkspaces,
      workspaces,
      allFolders,
      setAllFolders,
      selectFolders,
      setSelectFolders,
      folders,
      allProjects,
      setAllProjects,
      projects,
      isLoading,
      setIsLoading,
      folderLoading,
      projectLoading,
      project,
      selectProject,
      setSelectProject,
      projectResult,
      allCategories,
      selectCategory,
      setSelectCategory,
      category,
      allTools,
      answers,
      textVariant,
      setTextVariant,
      categoryLoading,
      editor,
      setEditor,
      openModal,
      setOpenModal,
    ]
  );

  return <WorkspaceDataContext.Provider value={value} {...props} />;
});

export const useWorkspaceData = () => useContext(WorkspaceDataContext);

export default WorkspaceDataProvider;
