import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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
      <div>
        <h1 className="text-2xl font-semibold">Verify your phone</h1>
        <p className="mt-2 text-sm text-neutral-500">
          One verified phone per account. This is a demo — there&apos;s no
          real SMS gateway wired up, so the code is shown on screen instead
          of texted.
        </p>
      </div>

      <RequestCodeForm defaultPhone={user.phone ?? ""} />
      <VerifyCodeForm />

      <Link href="/" className="text-center text-sm text-neutral-500 underline">
        Skip for now
      </Link>
    </div>
  );
}
