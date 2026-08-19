import { prisma } from "@/lib/prisma";
import Badge from "@/components/ui/Badge";
import { ROLES } from "@/lib/constants";

const ROLE_TONE = {
  [ROLES.ADMIN]: "brand",
  [ROLES.VENDOR]: "accent",
  [ROLES.CUSTOMER]: "neutral",
} as const;

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    include: { vendor: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h2 className="text-sm font-semibold">Users ({users.length})</h2>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="text-neutral-500">
            <tr>
              <th className="pb-2">Name</th>
              <th className="pb-2">Email</th>
              <th className="pb-2">Role</th>
              <th className="pb-2">Vendor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="py-2 pr-2">{user.name}</td>
                <td className="py-2 pr-2 text-neutral-500">{user.email}</td>
                <td className="py-2 pr-2">
                  <Badge tone={ROLE_TONE[user.role as keyof typeof ROLE_TONE] ?? "neutral"}>
                    {user.role}
                  </Badge>
                </td>
                <td className="py-2 pr-2 text-neutral-500">
                  {user.vendor?.name ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
