import { FC, Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { HiOutlineStar, HiChevronDown } from "react-icons/hi";
import { useMutation } from "@apollo/client";
import classNames from "../../utils/classNames";
import {
  ProjectModel,
  ToolCategoryModel,
  ToolModel,
} from "../../graphql/types";
import { useWorkspaceData } from "../WorkspaceDataProvider/WorkspaceDataProvider";
import { UPDATE_PROJECT } from "../../graphql/mutations/updateProject";
import { MutationType } from "../../types/types";
import Spinner from "../UI/Spinner";

interface SelectProps {
  selectItems: ToolModel[];
  label?: string;
  category: ToolCategoryModel;
  project?: ProjectModel;
  selectTool: ToolModel | null;
}

const SelectTools: FC<SelectProps> = ({
  selectItems,
  label,
  category,
  project,
  selectTool,
}) => {
  const [selected, setSelected] = useState(selectTool);
  const { setSelectProject } = useWorkspaceData();
  const [updateProject, { loading }] = useMutation<
    MutationType<"updateProject">
  >(UPDATE_PROJECT, {
    onCompleted: (data) => {
      setSelectProject(data.updateProject);
    },
  });
  if (loading)
    return (
      <div className="py-4">
        <Spinner className="w-1/4" />
      </div>
    );

  // console.log(category);

  return (
    <Listbox
      value={selected}
      onChange={async (value) => {
        setSelected(value);
        await updateProject({
          variables: { projectId: project?.id, tool: value?.id },
        });
      }}
    >
      {({ open }) => (
        <>
          {label ? (
            <Listbox.Label className="block text-sm font-medium text-gray-700">
              {category.label}
            </Listbox.Label>
          ) : null}
          <div className="relative m-2">
            <Listbox.Button className="relative w-full cursor-default flex rounded-md bg-white py-2 pl-3 pr-10 text-left focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
              <HiOutlineStar
                className="h-5 w-5 mr-1 text-white"
                aria-hidden="true"
              />
              <span className="block truncate">{selected?.name}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <HiChevronDown
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {selectItems.map((item) => (
                  <Listbox.Option
                    key={item.name}
                    className={({ active }) =>
                      classNames(
                        active ? "text-white bg-indigo-600" : "text-gray-900",
                        "relative cursor-default select-none py-2 pl-8 pr-4"
                      )
                    }
                    value={item}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={classNames(
                            selected ? "font-semibold" : "font-normal",
                            "block truncate"
                          )}
                        >
                          {item.name}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active
                                ? "text-gray-300 hover:text-white"
                                : " text-gray-300",
                              "absolute inset-y-0 left-0 flex items-center pl-1.5"
                            )}
                          >
                            <HiOutlineStar
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
};

export default SelectTools;
