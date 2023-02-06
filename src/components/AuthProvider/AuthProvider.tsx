import React, {
  createContext,
  Dispatch,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  LazyQueryExecFunction,
  MutationResult,
  OperationVariables,
  useLazyQuery,
  useMutation,
  useSubscription,
} from "@apollo/client";
import { useLocation, useNavigate } from "react-router-dom";

import { CONFIRM_LOGIN, LOGIN, SOCIAL_LOGIN } from "../../graphql/mutations";
import { ME } from "../../graphql/queries";

import { UserModel } from "../../graphql/types";

import { client, wsClient } from "../../graphql/client";
import { USER_MODIFY } from "../../graphql/subscription/userModify";
import { MutationType, QueryType, SubscriptionType } from "../../types/types";
// import { LINKEDIN_LOGIN } from "../../graphql/mutations/loginWithLinkedIn";
// import {
//   RESET_PASSWORD,
//   RESET_PASSWORD_AUTHORIZED,
// } from "../../graphql/mutations/resetPassword";
// import { CONFIRM_EMAIL } from "../../graphql/mutations/confirmEmail";

interface IAuthContext {
  // register: (
  //   email: string,
  //   password: string,
  //   firstname?: string,
  //   lastname?: string,
  //   formikAction?: FormikHelpers<FormikValues>
  // ) => void;
  getMe: LazyQueryExecFunction<QueryType<"me">, OperationVariables>;
  login: (
    email: string
    // password: string,
    // formikAction?: FormikHelpers<FormikValues>
  ) => void;
  confirmLogin: (email: string, token: string, fromURL: string) => void;
  logout: () => void;
  // linkedInLogin: (code: string) => void;
  // confirmEmail: (code: string) => void;
  setUser: Dispatch<UserModel | null>;
  setIsAuth: Dispatch<boolean>;
  user: UserModel | null;
  confirmLoginResult: MutationResult;
  loginResult: MutationResult;
  socialLogin: (token: string, fromURL: string) => void;
  // confirmEmailError: ApolloError | undefined;
  // linkedInLoginError: ApolloError | undefined;
  // resetPasswordError: ApolloError | undefined;
  // resetPasswordAuthorizedError: ApolloError | undefined;
  // registrationResult: MutationResult;
  isAuth: boolean;
  // resetPassword: (
  //   newPassword: string,
  //   formikAction?: FormikHelpers<FormikValues>,
  //   code?: string
  // ) => void;
}

export const AuthContext = createContext<IAuthContext>({} as IAuthContext);

const AuthProvider: React.FC<PropsWithChildren> = React.memo((props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [getMe] = useLazyQuery<QueryType<"me">>(ME);
  const [user, setUser] = useState<UserModel | null>(null);
  // const [registerMutation, registrationResult] = useMutation(REGISTER);
  const [loginMutation, loginResult] =
    useMutation<MutationType<"login">>(LOGIN);
  const [confirmLoginMutation, confirmLoginResult] =
    useMutation<MutationType<"confirmLogin">>(CONFIRM_LOGIN);
  const [socialLoginMutation] =
    useMutation<MutationType<"socialLogin">>(SOCIAL_LOGIN);
  // const [confirmEmailMutation, confirmEmailError] = useMutation(CONFIRM_EMAIL);
  // const [linkedInLoginMutation, linkedInLoginError] =
  //   useMutation(LINKEDIN_LOGIN);
  // const [resetPasswordMutation, resetPasswordError] =
  //   useMutation(RESET_PASSWORD);
  // const [resetPasswordAuthorizedMutation, resetPasswordAuthorizedError] =
  //   useMutation(RESET_PASSWORD_AUTHORIZED);
  const [isAuth, setIsAuth] = useState<boolean>(!!localStorage.getItem("auth"));

  useEffect(() => {
    if (location.pathname !== "/confirm-invite") {
      if (!user && isAuth) {
        getMe()
          .then((res) => {
            setUser(res.data?.me ?? null);
          })
          .catch(() => {
            localStorage.removeItem("auth");
            localStorage.removeItem("refreshToken");
            window.location.reload();
          });
      }
      const unsubscribe = client.onResetStore(async () => {
        setUser(null);
        setIsAuth(false);
      });
      return () => unsubscribe();
    }
  }, [isAuth, location, user]);

  // const register = async (
  //   email: string,
  //   password: string,
  //   firstname?: string,
  //   lastname?: string,
  //   formikAction?: FormikHelpers<FormikValues>
  // ) => {
  // await registerMutation({
  //   variables: { email, password, firstname, lastname },
  // });
  //   if (formikAction) {
  //     formikAction.resetForm();
  //     formikAction.setSubmitting(false);
  //   }
  // };

  // const resetPassword = async (
  //   newPassword: string,
  //   formikAction?: FormikHelpers<FormikValues>,
  //   code?: string
  // ) => {
  //   if (formikAction) {
  //     formikAction.resetForm();
  //     formikAction.setSubmitting(false);
  //   }
  //   if (window.location.pathname.startsWith("/auth")) {
  // const data = await resetPasswordMutation({
  //   variables: { newPassword, code },
  // }).then((res) => res.data.resetPassword);
  // setUser(data.user);
  // setIsAuth(true);
  // localStorage.setItem("auth", data.accessToken);
  // localStorage.setItem("refreshToken", data.refreshToken);
  //     navigate("/");
  //   } else {
  //     // const data = await resetPasswordAuthorizedMutation({
  //     //   variables: { newPassword },
  //     // }).then((res) => res.data.changePassword);
  //     // setUser(data);
  //     setTimeout(() => navigate("/"), 1500);
  //   }
  // };

  // const confirmEmail = async (code: string) => {
  // const user = await confirmEmailMutation({ variables: { code } });
  // setUser(user.data.confirmEmail.user);
  // setIsAuth(true);
  // localStorage.setItem("auth", user.data.confirmEmail.accessToken);
  // localStorage.setItem("refreshToken", user.data.confirmEmail.refreshToken);
  // navigate("/");
  // };

  const login = useCallback(
    async (email: string) => {
      await loginMutation({ variables: { email } });
    },
    [loginMutation]
  );

  const confirmLogin = useCallback(
    async (email: string, token: string, fromURL: string) => {
      const data = await confirmLoginMutation({
        variables: { email, token },
        fetchPolicy: "no-cache",
      });
      if (data.data) {
        const { user, accessToken, refreshToken } = data.data.confirmLogin;

        setUser(user);
        setIsAuth(true);
        localStorage.setItem("auth", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        if (fromURL === "admin") {
          window.location.href = `${process.env.REACT_APP_HTTP_PROTOKOL}://${process.env.REACT_APP_ADMIN_URL}/?auth=${accessToken}`;
        } else {
          navigate(fromURL);
        }
      }
    },
    [confirmLoginMutation, navigate]
  );

  useSubscription<SubscriptionType<"userModify">>(USER_MODIFY, {
    skip: !isAuth,
    onData: ({ data }) => {
      setUser(data.data?.userModify ?? null);
    },
  });

  const socialLogin = useCallback(
    async (token: string, fromURL: string) => {
      const data = await socialLoginMutation({
        variables: { token },
        fetchPolicy: "no-cache",
      });
      if (data.data) {
        const { user, accessToken, refreshToken } = data.data.socialLogin;

        setUser(user);
        setIsAuth(true);
        localStorage.setItem("auth", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
      }

      navigate(fromURL);
    },
    [navigate, socialLoginMutation]
  );

  const logout = async () => {
    setUser(null);
    setIsAuth(false);
    await client.resetStore();
    wsClient.close(false);
    localStorage.removeItem("auth");
    localStorage.removeItem("refreshToken");
  };

  const value = useMemo(
    () => ({
      // register,
      login,
      confirmLogin,
      user,
      setUser,
      isAuth,
      logout,
      getMe,
      // resetPassword,
      // resetPasswordError: resetPasswordError.error,
      // resetPasswordAuthorizedError: resetPasswordAuthorizedError.error,
      confirmLoginResult,
      loginResult,
      socialLogin,
      setIsAuth,
      // registrationResult,
      // confirmEmail,
      // confirmEmailError: confirmEmailError.error,
      // linkedInLogin,
      // linkedInLoginError: linkedInLoginError.error,
    }),
    [
      getMe,
      confirmLogin,
      confirmLoginResult,
      isAuth,
      login,
      loginResult,
      socialLogin,
      user,
      setIsAuth,
    ]
  );

  return <AuthContext.Provider value={value} {...props} />;
});

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
