import { prisma } from "@/lib/prisma";
import Badge from "@/components/ui/Badge";
import { ROLES } from "@/lib/constants";
import { createAdminUser, deleteAdminUser } from "@/lib/actions/admin-actions";

const ROLE_TONE = {
  [ROLES.ADMIN]: "brand",
  [ROLES.VENDOR]: "accent",
  [ROLES.CREATOR]: "accent",
  [ROLES.CUSTOMER]: "neutral",
} as const;

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const params = await searchParams;
  const users = await prisma.user.findMany({
    include: { vendor: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-neutral-200 p-5 dark:border-neutral-800">
        <h2 className="text-xl font-semibold">Add user</h2>
        {params.error && <p className="mt-3 text-sm text-red-600">{params.error}</p>}
        {params.success && <p className="mt-3 text-sm text-green-700">{params.success}</p>}

        <form action={createAdminUser} className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <input name="name" placeholder="Name" required className="rounded-xl border px-3 py-2.5" />
          <input name="email" type="email" placeholder="Email" required className="rounded-xl border px-3 py-2.5" />
          <input name="password" type="password" minLength={8} placeholder="Temporary password" required className="rounded-xl border px-3 py-2.5" />
          <select name="role" defaultValue={ROLES.CUSTOMER} className="rounded-xl border px-3 py-2.5">
            <option value={ROLES.CUSTOMER}>Customer</option>
            <option value={ROLES.CREATOR}>Creator</option>
            <option value={ROLES.ADMIN}>Admin</option>
          </select>
          <input name="contactFee" type="number" min="0" step="0.01" defaultValue="10" placeholder="Creator contact fee" className="rounded-xl border px-3 py-2.5" />
          <input name="sessionRate" type="number" min="0" step="0.01" defaultValue="50" placeholder="Creator session rate" className="rounded-xl border px-3 py-2.5" />
          <label className="flex items-center gap-2 text-sm">
            <input name="ageVerified" type="checkbox" />
            Mark verified for testing
          </label>
          <button className="rounded-xl bg-black px-5 py-2.5 text-sm font-medium text-white">Create user</button>
        </form>
      </section>

      <section>
        <h2 className="text-sm font-semibold">Users ({users.length})</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="text-neutral-500">
              <tr>
                <th className="pb-2">Name</th>
                <th className="pb-2">Email</th>
                <th className="pb-2">Role</th>
                <th className="pb-2">Vendor</th>
                <th className="pb-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="py-2">{user.name}</td>
                  <td className="py-2 text-neutral-500">{user.email}</td>
                  <td className="py-2">
                    <Badge tone={ROLE_TONE[user.role as keyof typeof ROLE_TONE] ?? "neutral"}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="py-2 text-neutral-500">{user.vendor?.name ?? "—"}</td>
                  <td className="py-2 text-right">
                    <form action={deleteAdminUser}>
                      <input type="hidden" name="userId" value={user.id} />
                      <button className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-700">Remove</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
