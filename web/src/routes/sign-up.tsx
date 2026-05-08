import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { signUp } from "../lib/auth-client";

export const Route = createFileRoute("/sign-up")({
  component: SignUpPage,
});

function SignUpPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      const { error } = await signUp.email({
        name: value.name,
        email: value.email,
        password: value.password,
      });

      if (error) {
        setServerError(error.message ?? "Something went wrong.");
        return;
      }

      navigate({ to: "/dashboard" });
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold tracking-tight">
          Create an account
        </h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex flex-col gap-4"
        >
          <form.Field name="name">
            {(field) => (
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-foreground"
                >
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  required
                  className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            )}
          </form.Field>

          <form.Field name="email">
            {(field) => (
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  required
                  className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            )}
          </form.Field>

          <form.Field name="password">
            {(field) => (
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  required
                  className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            )}
          </form.Field>

          {serverError && (
            <p className="text-sm text-destructive">{serverError}</p>
          )}

          <form.Subscribe selector={(s) => s.isSubmitting}>
            {(isSubmitting) => (
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
              >
                {isSubmitting ? "Creating account…" : "Sign up"}
              </button>
            )}
          </form.Subscribe>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <a href="/sign-in" className="text-primary hover:underline">
              Sign in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
