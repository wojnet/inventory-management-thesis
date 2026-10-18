"use client";

import { LogOut as LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

type SignOutButtonProps = {
  hideText?: boolean;
  onClick?: () => void;
};

const SignOutButton = ({ hideText, onClick }: SignOutButtonProps) => {
  const router = useRouter();

  const handleSignOut = async () => {
    onClick?.();
    await authClient.signOut();
    router.push("/sign-in");
  };

  return (
    <button
      data-testid="sign-out-button"
      type="button"
      onClick={handleSignOut}
      className="w-full h-10 flex gap-2 items-center hover:text-secondary transition-colors px-2 rounded-xl shrink-0 cursor-pointer"
    >
      <LogOutIcon size={24} />
      {hideText ? null : <p className="text-sm md:text-base">Sign out</p>}
    </button>
  );
};

export default SignOutButton;
