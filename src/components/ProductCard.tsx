import Link from "next/link";
import Image from "next/image";
import { formatCents } from "@/lib/constants";

type Props = {
  product: {
    slug: string;
    title: string;
    price: number;
    compareAtPrice: number | null;
    imageUrl: string;
    category: { name: string };
  };
};

export default function ProductCard({ product }: Props) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 transition hover:shadow-md dark:border-neutral-800"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900">
        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <span className="text-xs uppercase tracking-wide text-neutral-500">
          {product.category.name}
        </span>
        <h3 className="line-clamp-2 text-sm font-medium">{product.title}</h3>
        <div className="mt-auto flex items-center gap-2 pt-1">
          <span className="font-semibold">{formatCents(product.price)}</span>
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
