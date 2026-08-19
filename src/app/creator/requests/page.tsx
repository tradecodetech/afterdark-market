import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ROLES } from "@/lib/constants";
import { respondToContactRequest } from "@/lib/actions/community-actions";

export default async function CreatorRequestsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login?callbackUrl=/creator/requests");
  if (session.user.role !== ROLES.CREATOR) redirect("/");

  const requests = await prisma.contactRequest.findMany({
    where: { creatorId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Creator dashboard</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Contact requests</h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Review paid connection requests and decide whether to accept them.</p>

      <div className="mt-8 space-y-4">
        {requests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 p-10 text-center text-sm text-neutral-500 dark:border-neutral-700">
            No contact requests yet.
          </div>
        ) : requests.map((request) => (
          <article key={request.id} className="rounded-2xl border border-neutral-200 p-5 dark:border-neutral-800">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-medium">Paid contact request</p>
                <p className="mt-1 text-xs text-neutral-500">Received {request.createdAt.toLocaleString()}</p>
              </div>
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs dark:bg-neutral-800">{request.status}</span>
            </div>

            <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
              <div><span className="text-neutral-500">Request fee</span><div className="mt-1 font-semibold">${(request.fee / 100).toFixed(2)}</div></div>
              <div><span className="text-neutral-500">Expires</span><div className="mt-1 font-medium">{request.expiresAt ? request.expiresAt.toLocaleString() : "—"}</div></div>
              <div><span className="text-neutral-500">Request ID</span><div className="mt-1 truncate font-mono text-xs">{request.id}</div></div>
            </div>

            {request.status === "PENDING" && (
              <div className="mt-5 flex flex-wrap gap-3">
                <form
                  action={async (formData) => {
                    "use server";
                    await respondToContactRequest(formData);
                  }}
                >
                  <input type="hidden" name="requestId" value={request.id} />
                  <input type="hidden" name="decision" value="ACCEPTED" />
                  <button className="rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white dark:bg-white dark:text-black">Accept & create session</button>
                </form>
                <form
                  action={async (formData) => {
                    "use server";
                    await respondToContactRequest(formData);
                  }}
                >
                  <input type="hidden" name="requestId" value={request.id} />
                  <input type="hidden" name="decision" value="DECLINED" />
                  <button className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm font-medium dark:border-neutral-700">Decline</button>
                </form>
              </div>
            )}
          </article>
        ))}
      </div>
    </main>
  );
}
