import { useState } from "react";
import { HiMenuAlt2, HiX } from "react-icons/hi";
import { Link, Outlet } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import Header from "../Header/Header";
import SidebarModal from "../UI/SidebarModal";
import Logo from "../UI/Logo";
import Button from "../UI/Button";
import Loader from "../UI/Loader";
import { useWorkspaceData } from "../WorkspaceDataProvider/WorkspaceDataProvider";
import Alert from "../UI/Alert";
import PageLoader from "../UI/PageLoader";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isLoading, openModal, allCategories, allTools, selectWorkspace } =
    useWorkspaceData();

  if (!allCategories || !allTools || !selectWorkspace) return <PageLoader />;

  return (
    <div className="font-semibold">
      <SidebarModal
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        modalTitle={
          <Link to="/" className="block px-6">
            <Logo className="font-bold text-2xl" />
          </Link>
        }
        closeButton={
          <button
            type="button"
            className="ml-1 flex h-10 w-10 items-center justify-center rounded-full hover:outline-none hover:ring-2 focus:ring-inset hover:ring-white"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="sr-only">Close sidebar</span>
            <HiX className="h-6 w-6 text-white" aria-hidden="true" />
          </button>
        }
        modalContent={
          <nav className=" mt-4 px-6">
            <NavBar setSidebarOpen={setSidebarOpen} />
          </nav>
        }
      />

      <div className="hidden lg:fixed lg:inset-y-0 lg:flex  lg:w-64 lg:flex-col">
        <div className="flex  flex-grow flex-col overflow-y-auto  b-r bg-white pt-5">
          <div className=" flex flex-grow flex-col">
            <nav className="flex-1 px-6">
              <NavBar />
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col  lg:pl-64">
        <div className="sticky top-0 z-10 min-h-screen  bg-gray-100 flex-shrink-0 shadow">
          <div className="flex b-r">
            <div className="lg:hidden bg-white flex b-r">
              <Button
                className="px-4 text-gray rounded-none "
                iconStart={
                  <HiMenuAlt2 className="h-6 w-6" aria-hidden="true" />
                }
                iconButton
                type="transparent"
                onClickHandler={() => setSidebarOpen(true)}
              />
            </div>
            <Header setSidebarOpen={setSidebarOpen} />
          </div>
          <div className="w-full relative ">
            {openModal.open && (
              <div className="fixed bottom-8 z-50 animate right-8">
                <Alert
                  variant={openModal.variant}
                  className="rounded-lg"
                  text={openModal.text}
                />
              </div>
            )}
            {isLoading ? <PageLoader /> : <Outlet />}
          </div>
        </div>
      </div>
    </div>
  );
}
