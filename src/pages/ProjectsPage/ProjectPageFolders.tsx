import { FC } from "react";
import { HiFolderAdd } from "react-icons/hi";
import Typography from "../../components/UI/Typography";
import FolderItem from "../../components/FolderItem/FolderItem";
import { FolderModel } from "../../graphql/types";
import CreateButton from "../../components/CreateButton/CreateButton";

const ProjectPageFolders: FC<{ folders: FolderModel[] }> = ({ folders }) => (
  <div className="pb-8">
    <div className=" px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
      <div className="min-w-0 flex-1">
        <Typography size="title" variant="bold" className="sm:truncate">
          Folders
        </Typography>
      </div>
      <div className="mt-4 flex sm:mt-0 sm:ml-4">
        <CreateButton
          create="folder"
          type="primary"
          iconStart={<HiFolderAdd className="w-5 h-5" />}
          text="Create Folder"
        />
      </div>
    </div>
    <ul className="mt-3 grid grid-cols-1 p-6 gap-5 sm:grid-cols-2 min-h-fit sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
      {folders.length ? (
        folders.map((project, index: number) => (
          <FolderItem
            key={project.id}
            index={index}
            name={project.name}
            id={project.id}
            projectQuantity={project.countProjects}
          />
        ))
      ) : (
        <div className="flex sm:col-span-2 lg:col-start-2 lg:col-end-3 xl:col-end-4 flex-col items-center mb-8">
          <p className="text-sm py-2 text-gray-400">
            You dont have any folders yet.
          </p>
        </div>
      )}
    </ul>
  </div>
);
export default ProjectPageFolders;
