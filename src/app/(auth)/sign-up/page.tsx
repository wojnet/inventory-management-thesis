import type { Metadata } from "next";
import AuthForm from "@/app/components/auth/AuthForm/AuthForm";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Sign up",
};

const SignUpPage = () => {
  return <AuthForm mode="sign-up" />;
};

export default SignUpPage;
