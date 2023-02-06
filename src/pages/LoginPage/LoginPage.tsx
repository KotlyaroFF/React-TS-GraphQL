import { useLocation, useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import GoogleButton from "./components/GoogleButton";
import FacebookButton from "./components/FacebookButton";
import LoginForm from "./components/LoginForm";
import { useAuth } from "../../components/AuthProvider/AuthProvider";
import { auth } from "../../App";

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});
const loginViaGoogle = async () => {
  const { user } = await signInWithPopup(auth, googleProvider);
  return user.getIdToken();
};

const facebookProvider = new FacebookAuthProvider();
const loginViaFacebook = async () => {
  const { user } = await signInWithPopup(auth, facebookProvider);
  return user.getIdToken();
};

const LoginPage = () => {
  const { socialLogin } = useAuth();
  const location = useLocation();
  const [fromURL, setFromURL] = useState(location.state?.from?.pathname || "/");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("from_admin")) setFromURL("admin");
  }, [searchParams]);

  const socialLoginHandler = useCallback(
    async (type: string) => {
      const token =
        type === "google" ? await loginViaGoogle() : await loginViaFacebook();
      socialLogin(token, fromURL);
    },
    [fromURL, socialLogin]
  );

  return (
    <div className="grid grid-cols-1 max-w-3xl min-h-screen mx-auto px-6 py-24 bg-gradient-to-br from-green-75 to-green-300 lg:grid-cols-3 lg:py-20 lg:px-0">
      <div className="col-span-1 text-center lg:text-left lg:mr-10">
        <h1 className="text-title font-medium">
          Log in or
          <br />
          create an account
        </h1>
        <p className="text-small mt-4 font-light">
          Quickly get started by signing in using your existing accounts.
        </p>
      </div>
      <div className="col-span-2 bg-white">
        <p className="text-small hidden lg:block font-light">
          By proceeding, you are agreeing to QuickworksAI{" "}
          <b>Terms of Service</b> and <b>Privacy Notice</b>
        </p>
        <div className="flex flex-col lg:flex-row gap-2 justify-between mt-6">
          <GoogleButton socialLogin={socialLoginHandler} />
          <FacebookButton socialLogin={socialLoginHandler} />
        </div>
        <div className="w-full text-center my-4 text-small">or</div>
        <LoginForm fromURL={fromURL} />
      </div>
    </div>
  );
};

export default LoginPage;
