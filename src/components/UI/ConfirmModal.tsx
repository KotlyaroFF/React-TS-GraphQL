import { FC, Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ModalProps } from "./Modal";

const ConfirmModal: FC<ModalProps> = ({
  open,
  setOpen,
  closeButton,
  modalContent,
  modalTitle,
  icon,
}) => {
  const cancelButtonRef = useRef(null);
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-30"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-indigo-300 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-30 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:top-1/2 sm:w-full sm:max-w-lg sm:p-6">
                <div className="sm:flex sm:items-start">
                  {icon && (
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      {icon}
                    </div>
                  )}
                  <div className="mt-3 sm:mt-0 text-center w-full sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      {modalTitle}
                    </Dialog.Title>
                    <div className="mt-2">{modalContent}</div>
                  </div>
                </div>
                <div>{closeButton}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
export default ConfirmModal;
