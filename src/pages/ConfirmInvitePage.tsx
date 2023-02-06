import { FC, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { HiExclamationCircle } from "react-icons/hi";
import Loader from "../components/UI/Loader";
import { MutationType } from "../types/types";
import { CONFIRM_INVITE } from "../graphql/mutations/confirmInvite";
import { useAuth } from "../components/AuthProvider/AuthProvider";
import Typography from "../components/UI/Typography";
import Button from "../components/UI/Button";
import Logo from "../components/UI/Logo";
import { useWorkspaceData } from "../components/WorkspaceDataProvider/WorkspaceDataProvider";

const ConfirmInvitePage: FC = () => {
  const { getMe, setUser, setIsAuth } = useAuth();
  const { workspace, setSelectWorkspace } = useWorkspaceData();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [confirmInvite, { loading, error }] = useMutation<
    MutationType<"confirmInvite">
  >(CONFIRM_INVITE, {
    onCompleted: (data) => {
      getMe()
        .then((res) => {
          if (res.data) {
            setUser(res.data.me);
            setIsAuth(true);
            localStorage.getItem("auth");
            localStorage.getItem("refreshToken");
          }
          setSelectWorkspace(data?.confirmInvite ?? null);
          workspace().then((res) =>
            setSelectWorkspace(res.data?.workspace ?? null)
          );
        })
        .catch(() => {
          localStorage.removeItem("auth");
          localStorage.removeItem("refreshToken");
        });
      navigate("/");
    },
  });

  useEffect(() => {
    const getToken = async () => {
      await confirmInvite({
        variables: {
          token: searchParams.get("token"),
        },
      });
    };
    getToken().catch(console.error);
  }, [searchParams]);

  return (
    <div className="flex justify-center h-screen ">
      <div className="border-2 flex justify-center border-grey-lighter self-center w-full max-w-xl rounded-lg -mx-6 bg-primary-lighter mt-6 p-6 ">
        {loading && <Loader />}
        {error && (
          <div className="flex flex-col w-full items-center gap-8">
            <Logo className="font-bold text-large" />
            <HiExclamationCircle className="w-12 h-12 text-primary-error" />
            <div>
              <Typography size="large">{error.message}</Typography>
            </div>
            <div className="w-full">
              <Button
                className="w-full"
                text="Login"
                onClickHandler={() => navigate("/login")}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default ConfirmInvitePage;
