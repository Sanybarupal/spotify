import { Injectable, NotFoundException } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { ListProductsDto } from "./dto/list-products.dto";

export interface ProductSummaryRow {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category: { name: string; slug: string } | null;
  brand: { name: string; slug: string } | null;
  images: Array<{ url: string; altText: string | null }>;
  variants: Array<{
    sku: string;
    options: Record<string, unknown>;
    priceInr: string;
    inStock: boolean;
  }>;
}

interface ProductCountRow {
  total: string;
}

interface CategorySummaryRow {
  name: string;
  slug: string;
  productCount: string;
}

const productSelection = `
  SELECT
    p.id,
    p.slug,
    p.name,
    p.description,
    CASE WHEN c.id IS NULL THEN NULL
      ELSE json_build_object('name', c.name, 'slug', c.slug)
    END AS category,
    CASE WHEN b.id IS NULL THEN NULL
      ELSE json_build_object('name', b.name, 'slug', b.slug)
    END AS brand,
    COALESCE((
      SELECT json_agg(
        json_build_object('url', image.url, 'altText', image.alt_text)
        ORDER BY image.sort_order, image.id
      )
      FROM product_images image
      WHERE image.product_id = p.id
    ), '[]'::json) AS images,
    COALESCE((
      SELECT json_agg(
        json_build_object(
          'sku', variant.sku,
          'options', variant.options,
          'priceInr', variant.price_inr::text,
          'inStock', EXISTS (
            SELECT 1
            FROM inventory stock
            WHERE stock.variant_id = variant.id AND stock.quantity > 0
          )
        )
        ORDER BY variant.id
      )
      FROM product_variants variant
      WHERE variant.product_id = p.id AND variant.is_active = TRUE
    ), '[]'::json) AS variants
  FROM products p
  LEFT JOIN categories c ON c.id = p.category_id
  LEFT JOIN brands b ON b.id = p.brand_id
`;

@Injectable()
export class CatalogService {
  constructor(private readonly databaseService: DatabaseService) {}

  async listCategories(): Promise<
    Array<{ name: string; slug: string; productCount: number }>
  > {
    const result = await this.databaseService.query<CategorySummaryRow>(`
      SELECT c.name, c.slug, count(p.id)::text AS "productCount"
      FROM categories c
      JOIN products p ON p.category_id = c.id AND p.status = 'published'
      GROUP BY c.id
      ORDER BY c.name, c.id
    `);

    return result.rows.map((category) => ({
      name: category.name,
      slug: category.slug,
      productCount: Number(category.productCount),
    }));
  }

  async listProducts(query: ListProductsDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const offset = (page - 1) * limit;
    const category = query.category ?? null;
    const search = query.search ? `%${query.search}%` : null;

    const [productsResult, countResult] = await Promise.all([
      this.databaseService.query<ProductSummaryRow>(
        `${productSelection}
        WHERE p.status = 'published'
          AND ($1::text IS NULL OR c.slug = $1)
          AND ($2::text IS NULL OR p.name ILIKE $2 OR p.description ILIKE $2)
        ORDER BY p.created_at DESC, p.id
        LIMIT $3 OFFSET $4`,
        [category, search, limit, offset],
      ),
      this.databaseService.query<ProductCountRow>(
        `SELECT count(*)::text AS total
        FROM products p
        LEFT JOIN categories c ON c.id = p.category_id
        WHERE p.status = 'published'
          AND ($1::text IS NULL OR c.slug = $1)
          AND ($2::text IS NULL OR p.name ILIKE $2 OR p.description ILIKE $2)`,
        [category, search],
      ),
    ]);

    return {
      items: productsResult.rows,
      page,
      limit,
      total: Number(countResult.rows[0].total),
    };
  }

  async getProductBySlug(slug: string): Promise<ProductSummaryRow> {
    const result = await this.databaseService.query<ProductSummaryRow>(
      `${productSelection}
      WHERE p.status = 'published' AND p.slug = $1`,
      [slug],
    );
    const product = result.rows[0];

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    return product;
  }
}
