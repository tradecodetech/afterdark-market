import Link from "next/link";
import Image from "next/image";
import { formatCents } from "@/lib/constants";
import Badge from "@/components/ui/Badge";

type Props = {
  product: {
    slug: string;
    title: string;
    price: number;
    compareAtPrice: number | null;
    imageUrl: string;
    category: { name: string };
    groupBuyEnabled?: boolean;
  };
};

export default function ProductCard({ product }: Props) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-neutral-900/5 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:shadow-black/20"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900">
        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        {product.groupBuyEnabled && (
          <Badge tone="brand" className="absolute left-2 top-2 shadow-sm">
            Group buy
          </Badge>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3.5">
        <span className="text-xs font-medium uppercase tracking-wide text-brand-600 dark:text-brand-400">
          {product.category.name}
        </span>
        <h3 className="line-clamp-2 text-sm font-medium text-neutral-900 dark:text-neutral-100">
          {product.title}
        </h3>
        <div className="mt-auto flex items-center gap-2 pt-1.5">
          <span className="font-semibold text-neutral-900 dark:text-white">
            {formatCents(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="text-xs text-neutral-400 line-through">
              {formatCents(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
