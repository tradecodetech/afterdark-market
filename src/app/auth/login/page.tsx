import LoginForm from "./LoginForm";

export default async function LoginPage({
  searchParams,
}: PageProps<"/auth/login">) {
  const params = await searchParams;
  const callbackUrl =
    typeof params.callbackUrl === "string" ? params.callbackUrl : "/";

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 px-4 py-16">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <LoginForm redirectTo={callbackUrl} />
      <p className="text-sm text-neutral-500">
        No account?{" "}
        <a href="/auth/register" className="underline">
          Create one
        </a>
      </p>
    </div>
  );
}
