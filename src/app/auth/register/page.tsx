import RegisterForm from "./RegisterForm";
import { MINIMUM_AGE } from "@/lib/constants";

export default function RegisterPage() {
  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 px-4 py-16">
      <h1 className="text-2xl font-semibold">Create account</h1>
      <p className="text-sm text-neutral-500">
        You must be {MINIMUM_AGE} or older to register.
      </p>
      <RegisterForm />
      <p className="text-sm text-neutral-500">
        Already have an account?{" "}
        <a href="/auth/login" className="underline">
          Sign in
        </a>
      </p>
    </div>
  );
}
