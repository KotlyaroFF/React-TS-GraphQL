import { FC, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

import { ModalProps } from "./Modal";

const SidebarModal: FC<ModalProps> = ({
  open,
  setOpen,
  closeButton,
  modalContent,
  modalTitle,
}) => (
  <Transition.Root show={open} as={Fragment}>
    <Dialog as="div" className="relative z-20 lg:hidden" onClose={setOpen}>
      <Transition.Child
        as={Fragment}
        enter="transition-opacity ease-linear duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity ease-linear duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-indigo-300  bg-opacity-75" />
      </Transition.Child>

      <div className="fixed inset-0 z-20  w-[19.5rem] flex">
        <Transition.Child
          as={Fragment}
          enter="transition ease-in-out duration-300 transform"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
        >
          <Dialog.Panel className="relative flex w-full w-1/6 max-w-xs flex-1 flex-col bg-white pt-5 pb-4">
            <Transition.Child
              as={Fragment}
              enter="ease-in-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in-out duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                {closeButton}
              </div>
            </Transition.Child>
            {modalTitle}
            <div className="mt-5 h-0 flex-1 overflow-y-auto">
              {modalContent}
            </div>
          </Dialog.Panel>
        </Transition.Child>
        <div className="w-14 flex-shrink-0" aria-hidden="true" />
      </div>
    </Dialog>
  </Transition.Root>
);

export default SidebarModal;
