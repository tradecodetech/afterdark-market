import Image from "next/image";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/catalog";
import { addToCart } from "@/lib/actions/cart-actions";
import { formatCents } from "@/lib/constants";
import { getOpenSession } from "@/lib/group-buy";
import { fieldClass } from "@/components/ui/field";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import GroupBuyWidget from "./GroupBuyWidget";

export default async function ProductPage({
  params,
}: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || !product.isActive) notFound();

  const groupBuySession = product.groupBuyEnabled
    ? await getOpenSession(product.id)
    : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-900">
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
          <span className="text-xs font-medium uppercase tracking-wide text-brand-600 dark:text-brand-400">
            {product.category.name}
          </span>
          <h1 className="mt-1 font-display text-2xl tracking-tight">{product.title}</h1>
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

          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            {product.description}
          </p>

          <Card className="mt-4 p-3 text-xs text-neutral-500">
            📦 Ships from {product.vendor.name} in plain, unmarked packaging.
            Billing statement will read &ldquo;{product.vendor.discreetLabel}&rdquo;.
          </Card>

          {product.groupBuyEnabled && product.groupBuyTarget && product.groupBuyPrice && (
            <GroupBuyWidget
              productId={product.id}
              regularPrice={product.price}
              groupPrice={product.groupBuyPrice}
              target={product.groupBuyTarget}
              currentCount={groupBuySession?._count.participants ?? 0}
              expiresAt={groupBuySession?.expiresAt.toISOString() ?? null}
            />
          )}

          <form action={addToCart} className="mt-6 flex items-center gap-3">
            <input type="hidden" name="productId" value={product.id} />
            <input
              type="number"
              name="quantity"
              defaultValue={1}
              min={1}
              max={product.stock}
              className={fieldClass("w-20")}
            />
            <Button type="submit" disabled={product.stock === 0} size="lg">
              {product.stock === 0 ? "Out of stock" : "Add to cart"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
