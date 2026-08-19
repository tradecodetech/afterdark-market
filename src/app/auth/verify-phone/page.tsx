import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Card from "@/components/ui/Card";
import RequestCodeForm from "./RequestCodeForm";
import VerifyCodeForm from "./VerifyCodeForm";

export default async function VerifyPhonePage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login?callbackUrl=/auth/verify-phone");

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
  });

  if (user.phoneVerified) redirect("/account");

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 px-4 py-16">
      <div className="text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-xl">
          📱
        </span>
        <h1 className="mt-4 font-display text-2xl tracking-tight">Verify your phone</h1>
        <p className="mt-2 text-sm text-neutral-500">
          One verified phone per account. This is a demo — there&apos;s no
          real SMS gateway wired up, so the code is shown on screen instead
          of texted.
        </p>
      </div>

      <Card className="flex flex-col gap-5">
        <RequestCodeForm defaultPhone={user.phone ?? ""} />
        <div className="border-t border-neutral-200 pt-5 dark:border-neutral-800">
          <VerifyCodeForm />
        </div>
      </Card>

      <Link href="/" className="text-center text-sm text-neutral-500 hover:underline">
        Skip for now
      </Link>
    </div>
  );
}
