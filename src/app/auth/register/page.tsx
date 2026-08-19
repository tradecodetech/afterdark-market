import Link from "next/link";
import RegisterForm from "./RegisterForm";
import Card from "@/components/ui/Card";
import { MINIMUM_AGE } from "@/lib/constants";

export default function RegisterPage() {
  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 px-4 py-16">
      <div className="text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-xl">
          👀
        </span>
        <h1 className="mt-4 font-display text-2xl tracking-tight">Create account</h1>
        <p className="mt-2 text-sm text-neutral-500">
          You must be {MINIMUM_AGE} or older to register. A verified phone
          number is required — it keeps one account per person and cuts
          down on spam and harassment.
        </p>
      </div>
      <Card>
        <RegisterForm />
      </Card>
      <p className="text-center text-sm text-neutral-500">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
          Sign in
        </Link>
      </p>
    </div>
  );
}
