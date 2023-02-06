import { FC } from "react";
import Button from "../../../components/UI/Button";
import IconFacebook from "../../../resources/Icons/IconFacebook";

const FacebookButton: FC<{ socialLogin: (type: string) => void }> = ({
  socialLogin,
}) => (
  <Button
    text="Continue with Facebook"
    type="other"
    iconStart={<IconFacebook />}
    className="flex space-around items-center text-blue border border-[#3183f4]
            w-full bg-white hover:bg-[#3183f4] hover:text-white"
    onClickHandler={() => socialLogin("facebook")}
  />
);

export default FacebookButton;
