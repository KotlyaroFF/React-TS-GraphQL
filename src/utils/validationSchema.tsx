import * as Yup from "yup";

export const WorkspaceNameSchema = Yup.object().shape({
  "Workspace Name": Yup.string()
    .min(3, "Too Short!")
    .max(25, "Too Long!")
    .required("Required"),
});
export const FolderNameSchema = Yup.object().shape({
  "Folder Name": Yup.string()
    .min(3, "Too Short!")
    .max(25, "Too Long!")
    .required("Required"),
});

export const ProjectNameSchema = Yup.object().shape({
  "Project Name": Yup.string()
    .min(3, "Too Short!")
    .max(25, "Too Long!")
    .required("Required"),
});
