import { FC, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { EMAIL_CHANGE_CONFIRM } from "../graphql/mutations/emailChangeConfirm";
import Loader from "../components/UI/Loader";
import { MutationType } from "../types/types";

const ConfirmPage: FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [emailChange, { loading }] = useMutation<MutationType<"changeEmail">>(
    EMAIL_CHANGE_CONFIRM,
    {
      onCompleted: () => {
        navigate("/account");
      },
    }
  );

  useEffect(() => {
    const getToken = async () => {
      await emailChange({
        variables: {
          token: searchParams.get("token"),
        },
      });
    };
    getToken().catch(console.error);
  }, [searchParams]);

  return (
    <div className="flex  justify-center">
      <div className="border-2 flex py-36 justify-center border-grey-lighter self-center w-full max-w-xl rounded-lg -mx-6 bg-primary-lighter mt-6 p-6 ">
        {loading && <Loader />}
      </div>
    </div>
  );
};
export default ConfirmPage;
