import { FC, useState } from "react";
import { HiClipboardList, HiChevronDown, HiChevronRight } from "react-icons/hi";
import { useMutation } from "@apollo/client";
import { useLocation, useNavigate } from "react-router-dom";
import NavItem from "../UI/NavList/NavItem";
import NavList from "../UI/NavList/NavList";
import { useWorkspaceData } from "../WorkspaceDataProvider/WorkspaceDataProvider";
import Spinner from "../UI/Spinner";
import { MutationType } from "../../types/types";
import { CREATE_PROJECT } from "../../graphql/mutations/createProject";
import { ToolCategoryModel } from "../../graphql/types";
import Typography from "../UI/Typography";
import Button from "../UI/Button";
import ConfirmModal from "../UI/ConfirmModal";

const data = ["Quick Content", "Pro Builder", "Summarizer", "My Projects"];

interface selectToolDataProps {
  category: ToolCategoryModel;
  toolId: string;
}

const NavMenu: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectTopItem, setSelectTopItem] = useState<string[]>([]);
  const [selectCategory, setSelectCategory] = useState<string[]>([]);
  const [expandAllOpen, setExpandAllOpen] = useState<boolean>(false);
  const [showModel, setShowModel] = useState<boolean>(false);
  const [selectToolData, setSelectToolData] = useState<
    selectToolDataProps | undefined
  >(undefined);

  const {
    allCategories,
    allTools,
    selectWorkspace,
    setSelectCategory: setSelectCategoryInProject,
    setIsLoading,
    setSelectProject,
  } = useWorkspaceData();
  const [createProjectMutation, createProjectResult] = useMutation<
    MutationType<"createProject">
  >(CREATE_PROJECT, {
    onCompleted: (res) => {
      setIsLoading(false);
      navigate(`/project/${res.createProject.id}`);
    },
  });

  const expandAll = () => {
    setExpandAllOpen(!expandAllOpen);
    const topListWords: string[] = [];
    const middleListWords: string[] = [];
    data.map((topList) => {
      topListWords.push(topList);
      if (!expandAllOpen) {
        return setSelectTopItem(topListWords);
      }
      return setSelectTopItem([]);
    });
    allCategories?.map((category) => {
      middleListWords.push(category.id);
      if (!expandAllOpen) {
        return setSelectCategory(middleListWords);
      }
      return setSelectCategory([]);
    });
  };

  const openMiddleList = (topList: string) => {
    const words = Object.assign([], selectTopItem);
    if (!selectTopItem.includes(topList)) {
      words.push(topList);
      setSelectTopItem(words);
    } else {
      words.map((word, index) => {
        if (word === topList) {
          words.splice(index, 1);
        }
        return word;
      });
      setSelectTopItem(words);
    }
  };
  const openBottomList = (id: string) => {
    const words = Object.assign([], selectCategory);
    if (!selectCategory.includes(id)) {
      words.push(id);
      setSelectCategory(words);
    } else {
      words.map((word, index) => {
        if (word === id) {
          words.splice(index, 1);
        }
        return word;
      });
      setSelectCategory(words);
    }
  };

  const selectTool = async ({ category, toolId }: selectToolDataProps) => {
    setIsLoading(true);
    setSelectProject(null);
    setSelectCategoryInProject(category);
    await createProjectMutation({
      variables: {
        workspaceId: selectWorkspace?.id,
        toolsId: toolId,
      },
    });
    setShowModel(false);
  };

  return (
    <div className="relative z-10 flex flex-col bg-white gap-5 ">
      <div>
        <button
          onClick={expandAll}
          className="absolute -right-4 my-0.5 text-gray-500 top-5 text-xs"
          type="button"
        >
          {!expandAllOpen ? "expand all" : "collapse all"}
        </button>
      </div>
      {data.map((topList) => (
        <NavList key={topList}>
          <li>
            <NavItem
              id={topList}
              className="w-full"
              onClick={() => openMiddleList(topList)}
            >
              <HiClipboardList
                className={
                  selectTopItem.includes(topList)
                    ? "fill-indigo-600 h-5 w-6 my-auto"
                    : "fill-black h-5 w-6 my-auto"
                }
              />
              <span className="text-sm font-bold">{topList}</span>
            </NavItem>
            {topList === "Quick Content" && selectTopItem.includes(topList) && (
              <NavList>
                {allCategories?.map((category) => (
                  <li className="ml-5" key={category.id}>
                    <NavItem
                      className="py-1.5"
                      id={category.id}
                      onClick={() => openBottomList(category.id)}
                    >
                      {selectCategory.includes(category.id) ? (
                        <HiChevronDown className="mr-2 my-auto" />
                      ) : (
                        <HiChevronRight className="mr-2 my-auto" />
                      )}

                      <span className="my-auto font-bold text-sm">
                        {category.label}
                      </span>
                    </NavItem>
                    {selectCategory.includes(category.id) && (
                      <NavList className=" gap-2">
                        {allTools?.map((tool) => {
                          if (category.id === tool.category) {
                            return (
                              <NavItem
                                onClick={async () => {
                                  setSelectToolData({
                                    category,
                                    toolId: tool.id,
                                  });
                                  if (
                                    location.pathname.includes("/project/") &&
                                    selectToolData
                                  ) {
                                    setShowModel(true);
                                  } else {
                                    await selectTool(
                                      selectToolData as selectToolDataProps
                                    );
                                  }
                                }}
                                className="ml-8 py-1.5"
                                id={tool.id}
                                key={tool.id}
                              >
                                <span className="text-gray-700 text-sm font-semibold">
                                  {tool.name}
                                </span>
                              </NavItem>
                            );
                          }
                          return null;
                        })}
                      </NavList>
                    )}
                  </li>
                ))}
              </NavList>
            )}
          </li>
        </NavList>
      ))}
      <ConfirmModal
        setOpen={setShowModel}
        open={showModel}
        modalTitle={
          <Typography variant="bold" size="title">
            Undo changes?
          </Typography>
        }
        modalContent={
          <div>
            <Typography>
              {"Project not saved, all changes will be "}
              <span className="font-bold underline">lost!</span>
            </Typography>
          </div>
        }
        closeButton={
          <div className="flex mt-4 ml-auto sm:w-1/2 gap-4">
            <Button
              className="w-full"
              text="Cancel"
              type="transparent"
              onClickHandler={() => setShowModel(false)}
            />
            <Button
              className="hover:bg-red-700 bg-red-600 w-full "
              text="Confirm"
              type="primary"
              isLoading={createProjectResult.loading}
              onClickHandler={async () => {
                await selectTool(selectToolData as selectToolDataProps);
              }}
            />
            {createProjectResult.error && (
              <div className="absolute bottom-1">
                <Typography size="extraSmall" className="text-red-600">
                  {createProjectResult.error?.message}
                </Typography>
              </div>
            )}
          </div>
        }
      />
    </div>
  );
};
export default NavMenu;
