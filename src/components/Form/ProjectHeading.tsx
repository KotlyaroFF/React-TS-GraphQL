import { FC } from "react";
import classNames from "../../utils/classNames";
import SelectTools from "./SelectTools";
import {
  ProjectModel,
  ToolCategoryModel,
  ToolModel,
} from "../../graphql/types";
import ProjectButtonsGroup from "../ProjectButtonsGroup";

const tabs = [
  { name: "Create", href: "#", current: true },
  { name: "Saved", href: "#", current: false },
];

interface ProjectHeadingProps {
  allTools: ToolModel[];
  selectCategory: ToolCategoryModel;
  project: ProjectModel;
}

const ProjectHeading: FC<ProjectHeadingProps> = ({
  allTools,
  selectCategory,
  project,
}) => {
  const selectCategoryArr = [];
  selectCategoryArr.push(selectCategory);
  return (
    <div className="border-b bg-white w-full border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between relative sm:items-baseline">
        <div className="flex">
          {selectCategoryArr.map((category) => {
            const tool: ToolModel[] = [];
            let selectTool: ToolModel | null = null;
            allTools.forEach((tools) => {
              if (tools.category === category.id) {
                tool.push(tools);
                if (tools.id === project.tool) selectTool = tools;
              }
            });
            return (
              <SelectTools
                key={project.tool}
                selectTool={selectTool}
                project={project}
                category={category}
                selectItems={tool}
              />
            );
          })}
        </div>
        <ProjectButtonsGroup className="absolute right-0 top-0 h-8 my-3 mx-4 sm:hidden" />

        <div className="mt-4 sm:mt-0 sm:ml-10">
          <nav className="-mb-px flex space-x-2">
            {tabs.map((tab) => (
              <a
                key={tab.name}
                href={tab.href}
                className={classNames(
                  tab.current
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                  "whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm"
                )}
                aria-current={tab.current ? "page" : undefined}
              >
                {tab.name}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};
export default ProjectHeading;
