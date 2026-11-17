# Golf Commerce Platform

Single-vendor golf commerce project for the India market. The product assortment and own-delivery model are confirmed; branding, detailed policies, and production providers are still being decided.

## Project status and task meter

- Current phase: **Phase 01 — Planning and Architecture (in progress)**.
- Completed phases: **0 of 9**. No phase is complete until its acceptance criteria are met and the required approval is recorded.
- The starter and generic catalog API pass type-checks, API unit/integration tests, and workspace production builds. They are not a completed production foundation; live PostgreSQL migration-runner and deployment checks, authentication, and business approvals are still outstanding.
- The storefront is an unbranded placeholder, not an approved UI/UX design or a finished store.
- P1 feature requirements are an initial, unapproved draft. P1 implementation depends on the P0 commerce foundation and approved business rules.

## Project phases

The phases below describe the intended sequence from planning through launch. Statuses reflect current work, not an estimate of percentage completion.

| Phase | Name | Status |
|---|---|---|
| 01 | Project Planning and Architecture | In progress |
| 02 | UI/UX and Brand Design System | Not started |
| 03 | Platform and Engineering Foundation | Starter groundwork only; phase not complete |
| 04 | Product Catalog and Storefront | Catalog API groundwork only; phase not complete |
| 05 | Customer Accounts and Commerce Core | Not started |
| 06 | Payments, Delivery, and Operations | Not started |
| 07 | P1 Business Modules | Requirements draft only; implementation not started |
| 08 | Quality, Security, and Production Launch | Not started |
| 09 | P2 Enhancements and Ongoing Optimization | Not started |

### Phase 01 — Project Planning and Architecture

**Purpose:** Agree what the single-vendor golf store will do and how it will be built before locking design or production decisions.

**Scope:** Confirmed business model, target market, golf product groups, fulfillment model, roles, permissions, launch scope, module priorities, architecture and stack, conceptual data model, security/privacy needs, operational requirements, and development roadmap.

**Exit criteria:** The client approves the scope and exclusions, exact catalog/variant needs, user permissions, page/workflow list, deployment and operational assumptions, data rules, India-specific business policies, and measurable delivery acceptance criteria. Open business decisions must be resolved or explicitly accepted as deferred.

**Current decisions:** Single vendor; golf balls, apparel, footwear, bags, and accessories; own delivery team; Next.js/React, NestJS REST, and PostgreSQL approved as a planning baseline; role list approved. Detailed SKU/variant rules, permission matrix, client brand, delivery area/rules, gateway/COD, GST/invoice rules, returns policy, hosting, budget, and operations remain open. See [Phase 01 planning](./PHASE-01-PLAN.md).

### Phase 02 — UI/UX and Brand Design System

**Purpose:** Turn the approved requirements and client brand into a consistent, accessible customer and admin experience.

**Scope:** Confirm brand name/assets; define colors, typography, spacing, reusable components, buttons, forms, cards, and navigation; design responsive customer journeys for discovery through checkout; design admin dashboards and role-specific workflows; review empty, loading, validation, and error states.

**Exit criteria:** Client approval of the design system, responsive storefront and admin screens, key interaction states, accessibility expectations, and page inventory. Do not treat the current placeholder page as the approved design.

### Phase 03 — Platform and Engineering Foundation

**Purpose:** Establish a reliable, testable application and deployment foundation.

**Scope:** Monorepo/workspaces; local and deployment configuration; environment/secrets handling; CI checks; database migrations; validated configuration; authentication and approved RBAC; health checks; structured logging, monitoring, and error handling; baseline automated tests.

**Exit criteria:** Reproducible setup; successful build, type-checks, and automated tests in CI; documented deployment configuration; database migration and health checks verified; approved authentication/authorization rules enforced server-side. The current starter is groundwork only and has not met these criteria.

### Phase 04 — Product Catalog and Storefront

**Purpose:** Let staff maintain the approved golf catalog and let customers discover products.

**Scope:** Category/brand/product/variant/image and inventory workflows; approved product attributes and SKUs; customer category browsing, search, product detail, and responsive catalog pages; product availability and SEO-friendly catalog routes.

**Exit criteria:** Approved products can be safely managed by authorized staff and displayed accurately to customers; SKU/variant and image handling is verified; catalog/search behavior and accessibility have passing acceptance tests. The generic read-only catalog API is groundwork, not a completed catalog.

### Phase 05 — Customer Accounts and Commerce Core

**Purpose:** Support customer identity and a reliable path from product selection to order creation.

**Scope:** Sign-up/sign-in and account security; profile and address book; cart and wishlist; checkout; order and order-item snapshots; inventory reservation and stock-race protection; order history and cancellation rules.

**Exit criteria:** End-to-end customer journeys pass approved tests, including validation, price/order snapshots, concurrent stock protection, and permission checks. All pricing, tax, and cancellation rules used by checkout are approved.

### Phase 06 — Payments, Delivery, and Operations

**Purpose:** Fulfill and reconcile orders safely from payment through delivery and customer support.

**Scope:** Approved payment gateway and methods; verified server-side webhooks and idempotent payment handling; COD only if approved; own-team delivery assignment and restricted delivery updates; service-area/charge/estimate rules; customer notifications for key order events; customer-support workflows and operational reconciliation.

**Exit criteria:** Payment and order state transitions are verified against gateway test flows; duplicate callbacks cannot duplicate outcomes; delivery staff can access only assigned work; agreed shipping, exception, reconciliation, and support workflows pass UAT.

### Phase 07 — P1 Business Modules

**Purpose:** Add the approved features that enhance operations and customer experience after their P0 dependencies are stable.

**Scope:** Returns/refunds; coupons/promotions; reviews/ratings; transactional notifications; analytics/reports; CMS/SEO. Each feature must follow the P1 requirements table in [Phase 01 planning](./PHASE-01-PLAN.md).

**Exit criteria:** Per-module policies, roles, customer behavior, dependencies, and acceptance tests are approved; each implemented module passes those tests. Requirements planning is not feature implementation or approval.

### Phase 08 — Quality, Security, and Production Launch

**Purpose:** Verify that the complete platform is safe, supportable, and ready to operate in production.

**Scope:** End-to-end/regression, accessibility, performance, security, and recovery testing; privacy and policy review; backup/restore drills; monitoring/alerting; production configuration; staff runbooks; UAT; staged release and rollback plan.

**Exit criteria:** Launch-blocking defects are resolved; security and operational checks pass; backup restoration and rollback are demonstrated; client signs off on UAT, production readiness, and launch.

### Phase 09 — P2 Enhancements and Ongoing Optimization

**Purpose:** Improve the platform using observed business needs and launch data without destabilizing core commerce.

**Scope:** Advanced recommendations and any separately approved optimization work.

**Exit criteria:** Each enhancement has an approved business goal, privacy-aware data requirements, measurable success criteria, and tested release/rollback plan. No P2 feature is assumed to be part of initial launch.

## Stack baseline

- Storefront: Next.js and React
- API: NestJS REST
- Data store: PostgreSQL
- Redis: not included until a concrete need is established

## Local prerequisites

- Node.js 20.11 or newer and npm
- Docker Desktop with Docker Compose, for local PostgreSQL

## Start local development

1. Copy `.env.example` to `.env`. The included values are for local development only.
2. Install workspace dependencies with `npm install`.
3. Start PostgreSQL with `docker compose up -d postgres`.
4. Apply the catalog database migration with `npm run db:migrate`.
5. In separate terminals, run `npm run dev:api` and `npm run dev:storefront`.
6. Open `http://localhost:3000`; check API liveness at `http://localhost:3001/api/health/live` and database readiness at `http://localhost:3001/api/health/ready`.

The readiness endpoint returns an error when the database cannot be reached. Do not use the example database credentials outside local development.

## Catalog API

- `GET /api/catalog/products?page=1&limit=20` — list published products.
- `GET /api/catalog/products?category=<category-slug>&search=<text>` — filter the published catalog.
- `GET /api/catalog/products/:slug` — fetch a published product.
- `GET /api/catalog/categories` — list categories that currently contain published products.

The initial catalog migration creates empty catalog, variant, image, and inventory tables; it does not invent or seed product data. Admin catalog write operations, product-specific fields, and actual SKUs remain to be designed and approved.

Run API unit tests with `npm test --workspace @golf-commerce/api`.

## Workspace layout

- `frontend/` — customer storefront
- `backend/` — REST API and database connectivity
- `docker-compose.yml` — local PostgreSQL only
- `PHASE-01-PLAN.md` — approved decisions, planning drafts, dependencies, and open business requirements
#   S h o p  
 