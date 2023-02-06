import { FC } from "react";

import EditProfileForm from "./EditProfileForm";
import { useAuth } from "../../components/AuthProvider/AuthProvider";
import Loader from "../../components/UI/Loader";
import EditEmailForm from "./EditEmailForm";

const AccountPage: FC = () => {
  const { user } = useAuth();
  if (!user)
    return (
      <div className="flex justify-center">
        <div className="border-2 flex py-36 justify-center border-white self-center w-full max-w-xl rounded-lg -mx-6 bg-white mt-6 p-6 ">
          <Loader />
        </div>
      </div>
    );

  return (
    <div className=" p-6 flex flex-col ">
      <EditProfileForm user={user} />
      <div className="border-2 border-white shadow self-center w-full max-w-xl rounded-lg -mx-6 bg-white mt-6 p-6">
        <EditEmailForm user={user} />
      </div>
    </div>
  );
};

export default AccountPage;
