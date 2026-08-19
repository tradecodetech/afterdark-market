import { prisma } from "@/lib/prisma";
import NewCategoryForm from "./NewCategoryForm";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <NewCategoryForm />
      <ul className="flex flex-col gap-2 text-sm">
        {categories.map((category) => (
          <li
            key={category.id}
            className="flex items-center justify-between rounded-xl border border-neutral-200 px-3 py-2 dark:border-neutral-800"
          >
            <span>{category.name}</span>
            <span className="text-neutral-500">
              {category._count.products} products · /{category.slug}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
