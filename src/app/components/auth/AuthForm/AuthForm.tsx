"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { authClient } from "@/lib/auth-client";

type AuthFormProps = {
  mode: "sign-in" | "sign-up";
};

const AUTH_FORM_COPY = {
  "sign-in": {
    title: "Sign in",
    description: "Sign in to manage your warehouse inventory.",
    submitLabel: "Sign in",
    submittingLabel: "Signing in...",
    switchText: "Don't have an account?",
    switchHref: "/sign-up",
    switchLabel: "Sign up",
  },
  "sign-up": {
    title: "Sign up",
    description: "Create an account to join the warehouse.",
    submitLabel: "Sign up",
    submittingLabel: "Creating account...",
    switchText: "Already have an account?",
    switchHref: "/sign-in",
    switchLabel: "Sign in",
  },
} as const;

const AuthForm = ({ mode }: AuthFormProps) => {
  const router = useRouter();
  const copy = AUTH_FORM_COPY[mode];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const result =
      mode === "sign-in"
        ? await authClient.signIn.email({ email, password })
        : await authClient.signUp.email({ name, email, password });

    setIsSubmitting(false);

    if (result.error) {
      setErrorMessage(result.error.message || "Something went wrong.");
      return;
    }

    router.push(mode === "sign-up" ? "/warehouses/create" : "/warehouses");
  };

  return (
    <div className="w-full min-h-screen p-12 flex flex-col items-center justify-center gap-6">
      <div className="space-y-3 text-center">
        <h1 className="text-3xl font-bold">{copy.title}</h1>
        <p className="max-w-md text-secondary">{copy.description}</p>
      </div>

      <form
        data-testid={`${mode}-page/form`}
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl border-2 border-border bg-white p-6 space-y-5"
      >
        {mode === "sign-up" ? (
          <label className="flex flex-col gap-2 text-sm font-medium">
            Name
            <input
              data-testid={`${mode}-page/name-field`}
              className="h-11 rounded-lg border border-border px-3 outline-none"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>
        ) : null}

        <label className="flex flex-col gap-2 text-sm font-medium">
          Email
          <input
            type="email"
            data-testid={`${mode}-page/email-field`}
            className="h-11 rounded-lg border border-border px-3 outline-none"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium">
          Password
          <input
            type="password"
            data-testid={`${mode}-page/password-field`}
            className="h-11 rounded-lg border border-border px-3 outline-none"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={8}
            required
          />
        </label>

        {errorMessage ? (
          <p className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMessage}
          </p>
        ) : null}

        <button
          data-testid={`${mode}-page/submit-button`}
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-11 w-full items-center justify-center rounded-full border-2 border-border bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-background hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? copy.submittingLabel : copy.submitLabel}
        </button>
      </form>

      <p className="text-sm text-secondary">
        {copy.switchText}{" "}
        <Link
          href={copy.switchHref}
          className="font-medium text-foreground underline underline-offset-2"
        >
          {copy.switchLabel}
        </Link>
      </p>
    </div>
  );
};

export default AuthForm;
