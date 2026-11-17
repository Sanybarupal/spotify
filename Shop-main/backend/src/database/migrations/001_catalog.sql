CREATE TABLE categories (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT categories_name_not_blank CHECK (length(trim(name)) > 0),
  CONSTRAINT categories_slug_not_blank CHECK (length(trim(slug)) > 0)
);

CREATE TABLE brands (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT brands_name_not_blank CHECK (length(trim(name)) > 0),
  CONSTRAINT brands_slug_not_blank CHECK (length(trim(slug)) > 0)
);

CREATE TABLE products (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
  brand_id BIGINT REFERENCES brands(id) ON DELETE SET NULL,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT products_name_not_blank CHECK (length(trim(name)) > 0),
  CONSTRAINT products_slug_not_blank CHECK (length(trim(slug)) > 0)
);

CREATE INDEX products_published_created_at_idx
  ON products (created_at DESC, id)
  WHERE status = 'published';

CREATE INDEX products_published_category_idx
  ON products (category_id, created_at DESC, id)
  WHERE status = 'published';

CREATE TABLE product_variants (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku TEXT NOT NULL UNIQUE,
  options JSONB NOT NULL DEFAULT '{}'::jsonb,
  price_inr NUMERIC(12, 2) NOT NULL CHECK (price_inr >= 0),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT product_variants_sku_not_blank CHECK (length(trim(sku)) > 0),
  CONSTRAINT product_variants_options_object CHECK (jsonb_typeof(options) = 'object')
);

CREATE INDEX product_variants_product_active_idx
  ON product_variants (product_id, id)
  WHERE is_active = TRUE;

CREATE TABLE product_images (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT product_images_url_not_blank CHECK (length(trim(url)) > 0)
);

CREATE INDEX product_images_product_order_idx
  ON product_images (product_id, sort_order, id);

CREATE TABLE inventory (
  variant_id BIGINT PRIMARY KEY REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
