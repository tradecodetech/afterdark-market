"use client";

import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { addToCart } from "@/lib/actions/cart-actions";
import { formatCents } from "@/lib/constants";

type FeedProduct = {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  vendorName: string;
  categoryName: string;
  stock: number;
};

function FeedCard({ product }: { product: FeedProduct }) {
  const [pending, startTransition] = useTransition();

  return (
    <section className="relative h-[calc(100dvh-65px)] w-full shrink-0 snap-start snap-always">
      <Image
        src={product.imageUrl}
        alt={product.title}
        fill
        sizes="100vw"
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-6 text-white">
        <span className="w-fit rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium backdrop-blur">
          {product.categoryName}
        </span>
        <Link href={`/products/${product.slug}`} className="text-xl font-semibold hover:underline">
          {product.title}
        </Link>
        <p className="line-clamp-2 max-w-md text-sm text-white/80">
          {product.description}
        </p>
        <p className="text-xs text-white/60">{product.vendorName}</p>

        <div className="mt-3 flex items-center gap-3">
          <span className="text-lg font-semibold">{formatCents(product.price)}</span>
          <form
            action={(formData) => startTransition(() => addToCart(formData))}
          >
            <input type="hidden" name="productId" value={product.id} />
            <input type="hidden" name="quantity" value={1} />
            <button
              type="submit"
              disabled={pending || product.stock === 0}
              className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black disabled:opacity-50"
            >
              {product.stock === 0 ? "Out of stock" : pending ? "Adding…" : "Add to cart"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default function FeedClient({ products }: { products: FeedProduct[] }) {
  if (products.length === 0) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-sm text-neutral-500">
        No products in the feed yet.
      </div>
    );
  }

  return (
    <div className="h-[calc(100dvh-65px)] snap-y snap-mandatory overflow-y-scroll">
      {products.map((product) => (
        <FeedCard key={product.id} product={product} />
      ))}
    </div>
  );
}
