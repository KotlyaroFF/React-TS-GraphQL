import { FC } from "react";
import Button from "../../../components/UI/Button";
import IconGoogle from "../../../resources/Icons/IconGoogle";

const GoogleButton: FC<{ socialLogin: (type: string) => void }> = ({
  socialLogin,
}) => (
  <Button
    text="Continue with Google"
    iconStart={<IconGoogle />}
    className="flex space-around items-center text-white border border-indigo-500
            w-full bg-indigo-500 hover:bg-white hover:border-indigo-500 hover:text-indigo-500"
    onClickHandler={() => socialLogin("google")}
  />
);

export default GoogleButton;
