import Link from "next/link";
import LoginForm from "./LoginForm";
import Card from "@/components/ui/Card";

export default async function LoginPage({
  searchParams,
}: PageProps<"/auth/login">) {
  const params = await searchParams;
  const callbackUrl =
    typeof params.callbackUrl === "string" ? params.callbackUrl : "/";

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 px-4 py-16">
      <div className="text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-xl">
          👀
        </span>
        <h1 className="mt-4 font-display text-2xl tracking-tight">Sign in</h1>
      </div>
      <Card>
        <LoginForm redirectTo={callbackUrl} />
      </Card>
      <p className="text-center text-sm text-neutral-500">
        No account?{" "}
        <Link href="/auth/register" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
          Create one
        </Link>
      </p>
    </div>
  );
}
