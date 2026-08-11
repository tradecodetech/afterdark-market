import { parse } from "csv-parse/sync";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";

export type CsvImportResult = { count: number; errors: string[] };

// Expected header row: title,description,price,stock,sku,imageUrl,categorySlug
// price is in whole dollars (e.g. "24.99"), converted to cents on import.
export async function importProductsFromCsv(
  vendorId: string,
  csvText: string,
): Promise<CsvImportResult> {
  const vendor = await prisma.vendor.findUniqueOrThrow({ where: { id: vendorId } });

  const rows: Record<string, string>[] = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  const errors: string[] = [];
  let count = 0;

  for (const [index, row] of rows.entries()) {
    const rowNum = index + 2; // account for header row
    const { title, description, price, stock, sku, imageUrl, categorySlug } = row;

    if (!title || !price || !sku || !categorySlug) {
      errors.push(`Row ${rowNum}: missing required field(s).`);
      continue;
    }

    const category = await prisma.category.findFirst({
      where: { slug: categorySlug },
    });
    if (!category) {
      errors.push(`Row ${rowNum}: unknown category "${categorySlug}".`);
      continue;
    }

    const priceCents = Math.round(parseFloat(price) * 100);
    if (Number.isNaN(priceCents)) {
      errors.push(`Row ${rowNum}: invalid price "${price}".`);
      continue;
    }

    const slug = slugify(`${vendor.slug}-${sku}`);

    await prisma.product.upsert({
      where: { slug },
      create: {
        vendorId,
        categoryId: category.id,
        title,
        slug,
        description: description ?? "",
        price: priceCents,
        stock: Number(stock) || 0,
        sku,
        imageUrl: imageUrl || "/placeholders/default.svg",
        source: "MANUAL",
      },
      update: {
        title,
        description: description ?? "",
        price: priceCents,
        stock: Number(stock) || 0,
        imageUrl: imageUrl || "/placeholders/default.svg",
      },
    });
    count += 1;
  }

  return { count, errors };
}
