import { Test, type TestingModule } from "@nestjs/testing";
import { DatabaseService } from "../database/database.service";
import { CatalogService } from "./catalog.service";

describe("CatalogService", () => {
  let service: CatalogService;
  let query: jest.Mock;

  beforeEach(async () => {
    query = jest.fn();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatalogService,
        { provide: DatabaseService, useValue: { query } },
      ],
    }).compile();

    service = module.get(CatalogService);
  });

  it("lists categories that have published products", async () => {
    query.mockResolvedValue({
      rows: [{ name: "Golf balls", slug: "golf-balls", productCount: "3" }],
    });

    await expect(service.listCategories()).resolves.toEqual([
      { name: "Golf balls", slug: "golf-balls", productCount: 3 },
    ]);
    expect(query).toHaveBeenCalledWith(
      expect.stringContaining("p.status = 'published'"),
    );
  });

  it("uses validated filters and pagination when listing products", async () => {
    query
      .mockResolvedValueOnce({
        rows: [{ id: "1", slug: "example", name: "Example" }],
      })
      .mockResolvedValueOnce({ rows: [{ total: "1" }] });

    await expect(
      service.listProducts({
        page: 2,
        limit: 10,
        category: "golf-balls",
        search: "tour",
      }),
    ).resolves.toEqual({
      items: [{ id: "1", slug: "example", name: "Example" }],
      page: 2,
      limit: 10,
      total: 1,
    });

    expect(query).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining("LIMIT $3 OFFSET $4"),
      ["golf-balls", "%tour%", 10, 10],
    );
    expect(query).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining("count(*)::text AS total"),
      ["golf-balls", "%tour%"],
    );
  });

  it("returns a not-found error for an unpublished or missing product", async () => {
    query.mockResolvedValue({ rows: [] });

    await expect(service.getProductBySlug("missing-product")).rejects.toThrow(
      "Product not found",
    );
    expect(query).toHaveBeenCalledWith(
      expect.stringContaining("p.status = 'published' AND p.slug = $1"),
      ["missing-product"],
    );
  });
});
