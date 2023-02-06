import {
  Dispatch,
  FC,
  Fragment,
  ReactNode,
  SetStateAction,
  useRef,
} from "react";
import { Dialog, Transition } from "@headlessui/react";

export interface ModalProps {
  open?: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  closeButton?: ReactNode;
  modalContent?: string | ReactNode;
  modalTitle?: string | ReactNode;
  icon?: ReactNode;
}

const Modal: FC<ModalProps> = ({
  open,
  setOpen,
  closeButton,
  modalContent,
  modalTitle,
}) => {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
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
        <div className="fixed inset-0 z-10 overflow-y-auto">
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg  bg-white text-left shadow-xl transition-all sm:my-8 sm:max-w-screen-md">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-8 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="text-center w-full sm:text-left">
                      <div className="flex flex-row justify-between">
                        <Dialog.Title as="h3" className="flex">
                          <div className="my-auto">{modalTitle}</div>
                        </Dialog.Title>
                        <div className="w-11">{closeButton}</div>
                      </div>
                      <hr className="text-light-blue-light mt-4" />
                      <div className="mt-2">{modalContent}</div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6" />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Modal;
