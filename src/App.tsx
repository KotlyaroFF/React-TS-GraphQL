import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import AccountPage from "./pages/AccountPage/AccountPage";
import ProjectPage from "./pages/ProjectPage/ProjectPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import WithAuth from "./components/WithAuth";
import ConfirmPage from "./pages/ConfirmPage";
import ConfirmInvitePage from "./pages/ConfirmInvitePage";
import WorkspaceSettingsPage from "./pages/WorkspaceSettingsPage/WorkspaceSettingsPage";
import ProjectsPage from "./pages/ProjectsPage/ProjectsPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<Layout />} path="/">
        <Route path="/" element={<ProjectsPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/workspace/settings" element={<WorkspaceSettingsPage />} />
        <Route path="/project" element={<ProjectsPage />} />
        <Route path="folder/:id" element={<ProjectsPage />} />
        <Route path="project/:id" element={<ProjectPage />} />
        <Route path="*" element={<div>404</div>} />
        <Route path="/confirm" element={<ConfirmPage />} />
      </Route>
      <Route path="/confirm-invite" element={<ConfirmInvitePage />} />
    </Routes>
  );
}

export default WithAuth(App);
