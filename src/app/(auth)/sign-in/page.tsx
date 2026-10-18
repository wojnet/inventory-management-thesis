import type { Metadata } from "next";
import AuthForm from "@/app/components/auth/AuthForm/AuthForm";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in",
};

const SignInPage = () => {
  return <AuthForm mode="sign-in" />;
};

export default SignInPage;
