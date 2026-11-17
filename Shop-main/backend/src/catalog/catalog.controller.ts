import { Controller, Get, Param, Query } from "@nestjs/common";
import { CatalogService } from "./catalog.service";
import { ListProductsDto } from "./dto/list-products.dto";

@Controller("catalog/products")
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get("categories")
  listCategories() {
    return this.catalogService.listCategories();
  }

  @Get()
  listProducts(@Query() query: ListProductsDto) {
    return this.catalogService.listProducts(query);
  }

  @Get(":slug")
  getProduct(@Param("slug") slug: string) {
    return this.catalogService.getProductBySlug(slug);
  }
}
