import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { Test, type TestingModule } from "@nestjs/testing";
import { PGlite } from "@electric-sql/pglite";
import { DatabaseService } from "../database/database.service";
import { CatalogService } from "./catalog.service";

describe("Catalog PostgreSQL integration", () => {
  let database: PGlite;
  let module: TestingModule;
  let service: CatalogService;

  beforeAll(async () => {
    database = new PGlite();
    const migration = await readFile(
      join(__dirname, "..", "database", "migrations", "001_catalog.sql"),
      "utf8",
    );
    await database.exec(migration);
    await database.exec(`
      INSERT INTO categories (name, slug)
      VALUES ('Test category', 'test-category');
      INSERT INTO brands (name, slug)
      VALUES ('Test brand', 'test-brand');
      INSERT INTO products (category_id, brand_id, slug, name, description, status)
      SELECT category.id, brand.id, 'test-product', 'Test product', 'A searchable item', 'published'
      FROM categories category, brands brand;
      INSERT INTO products (category_id, slug, name, status)
      SELECT id, 'draft-product', 'Draft product', 'draft' FROM categories;
      INSERT INTO product_variants (product_id, sku, options, price_inr)
      SELECT id, 'TEST-SKU', '{"pack":"test"}'::jsonb, 1250.50
      FROM products WHERE slug = 'test-product';
      INSERT INTO product_images (product_id, url, alt_text, sort_order)
      SELECT id, 'https://example.test/product.png', 'Test image', 0
      FROM products WHERE slug = 'test-product';
      INSERT INTO inventory (variant_id, quantity)
      SELECT id, 4 FROM product_variants WHERE sku = 'TEST-SKU';
      INSERT INTO categories (name, slug) VALUES ('Empty category', 'empty-category');
    `);

    module = await Test.createTestingModule({
      providers: [
        CatalogService,
        {
          provide: DatabaseService,
          useValue: {
            query: (text: string, values: unknown[] = []) =>
              database.query(text, values),
          },
        },
      ],
    }).compile();
    service = module.get(CatalogService);
  });

  afterAll(async () => {
    await module?.close();
    await database?.close();
  });

  it("applies the catalog migration and lists only categories with published products", async () => {
    await expect(service.listCategories()).resolves.toEqual([
      { name: "Test category", slug: "test-category", productCount: 1 },
    ]);
  });

  it("queries published products with related images, variants, and stock", async () => {
    const result = await service.listProducts({
      page: 1,
      limit: 20,
      category: "test-category",
      search: "searchable",
    });

    expect(result).toMatchObject({
      page: 1,
      limit: 20,
      total: 1,
      items: [
        {
          slug: "test-product",
          category: { name: "Test category", slug: "test-category" },
          brand: { name: "Test brand", slug: "test-brand" },
          images: [
            {
              url: "https://example.test/product.png",
              altText: "Test image",
            },
          ],
          variants: [
            {
              sku: "TEST-SKU",
              options: { pack: "test" },
              priceInr: "1250.50",
              inStock: true,
            },
          ],
        },
      ],
    });
  });

  it("fetches a product by slug and excludes unpublished products", async () => {
    await expect(service.getProductBySlug("test-product")).resolves.toMatchObject(
      { slug: "test-product", name: "Test product" },
    );
    await expect(service.getProductBySlug("draft-product")).rejects.toThrow(
      "Product not found",
    );
  });
});
