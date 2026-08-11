import Image from "next/image";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/catalog";
import { addToCart } from "@/lib/actions/cart-actions";
import { formatCents } from "@/lib/constants";

export default async function ProductPage({
  params,
}: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || !product.isActive) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-900">
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>

        <div>
          <span className="text-xs uppercase tracking-wide text-neutral-500">
            {product.category.name}
          </span>
          <h1 className="mt-1 text-2xl font-semibold">{product.title}</h1>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xl font-semibold">
              {formatCents(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-neutral-400 line-through">
                {formatCents(product.compareAtPrice)}
              </span>
            )}
          </div>

          <p className="mt-4 whitespace-pre-line text-sm text-neutral-600 dark:text-neutral-400">
            {product.description}
          </p>

          <div className="mt-4 rounded-lg border border-neutral-200 p-3 text-xs text-neutral-500 dark:border-neutral-800">
            Ships from {product.vendor.name} in plain, unmarked packaging.
            Billing statement will read &ldquo;{product.vendor.discreetLabel}&rdquo;.
          </div>

          <form action={addToCart} className="mt-6 flex items-center gap-3">
            <input type="hidden" name="productId" value={product.id} />
            <input
              type="number"
              name="quantity"
              defaultValue={1}
              min={1}
              max={product.stock}
              className="w-20 rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            />
            <button
              type="submit"
              disabled={product.stock === 0}
              className="rounded-md bg-black px-5 py-2.5 text-sm font-medium text-white disabled:opacity-40 dark:bg-white dark:text-black"
            >
              {product.stock === 0 ? "Out of stock" : "Add to cart"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
