# E-Commerce Project — Phase 01 Planning Draft

**Status:** Planning in progress — draft for client review  
**Business model:** Single vendor  
**Market:** India  
**Product category:** Golf — golf balls, apparel, footwear, bags, and accessories  
**Brand:** Client custom branding (brand name pending)  
**Delivery model:** Own delivery team (service area and operating rules pending)

This document records the current plan and distinguishes confirmed decisions from proposals and unresolved business inputs. Phase 01 is not complete until the open decisions are resolved and the client approves the scope, architecture, and roadmap.

## 1. Vision and scope

Build a production-ready, single-vendor commerce platform through which the company can publish and sell its golf products directly to Indian customers. Customers will browse and search the catalog, manage a cart, check out, pay, and track orders. Authorized staff will manage the catalog, stock, orders, customers, and support through a centralized admin experience.

There will be no seller registration, seller panel, commission calculation, or multi-seller settlement. These are out of scope unless the business model changes.

### Launch scope

- Customer storefront, catalog navigation, product search, and product detail pages.
- Customer accounts, addresses, cart, and wishlist.
- Checkout with applicable taxes and delivery charges, online payment and COD subject to business rules.
- Order lifecycle, stock validation, cancellation handling, and customer order history.
- Central admin for catalog, inventory, orders, customer support, and staff access.
- Transactional notifications, essential operational reporting, and policy/content pages.
- Production security, monitoring, backups, and deployment practices.

### Priorities

| Priority | Modules |
|---|---|
| P0 — launch essential | Storefront; customer authentication; product/catalog management; cart and wishlist; checkout; payment integration; orders; inventory; admin dashboard; customer management; shipping and delivery |
| P1 — important | Returns and refunds; coupons and promotions; reviews and ratings; notifications; analytics and reports; CMS and SEO |
| P2 — later enhancement | Advanced recommendations |

The product groups are confirmed; final prioritization still depends on detailed catalog requirements and operating policies.

## 2. Users and access control

The client approved the role list below as the planning baseline. Finalize the role-to-permission matrix before implementation, using least privilege. Staff roles may be combined or adjusted to fit the team. The confirmed own-delivery model requires restricted delivery-staff access.

| Role | Intended responsibilities |
|---|---|
| Super Admin | Platform configuration, staff access, and full business control |
| Admin | Day-to-day website and business management |
| Product Manager | Products, categories, brands, pricing, and catalog content |
| Order Manager | Order review, fulfillment coordination, cancellations, and returns |
| Customer Support | Customer queries, support tickets, and permitted order assistance |
| Delivery Staff | View assigned deliveries and update permitted delivery/pickup statuses |
| Customer | Account, addresses, shopping, orders, reviews, and support requests |

Sensitive actions should be permission-checked on the server, not only hidden in the UI, and recorded in an audit log.

## 3. Application surfaces and modules

### Customer experience

- Home, category/collection listing, search results, and product detail.
- Sign-up/sign-in, account profile, saved addresses, and order history.
- Cart, checkout, payment result, and order tracking.
- Wishlist, reviews, support/contact, and policy pages.

### Admin experience

- Dashboard and role/permission management.
- Product, category, brand, image, variant, price, and inventory management.
- Order, payment status, shipment, cancellation, return, and refund workflows.
- Customer and support-ticket management.
- Coupons, content/SEO, settings, and operational reports as approved.

### Golf catalog planning

The confirmed assortment is golf balls, apparel, footwear, bags, and accessories. The catalog must support SKU-level products, variants, images, pricing, stock, and category-specific product attributes. Confirm the actual SKU list and variant rules before locking fields; apparel and footwear may require size/fit options, while balls, bags, and accessories need their relevant specifications. Product pages should make those details clear to customers.

The confirmed own-delivery model requires an admin workflow to assign orders to delivery staff, expose only assigned deliveries to each staff member, and record delivery status updates. Service areas, delivery charges, delivery estimates, and proof-of-delivery needs remain open.

### P1 module requirements — initial draft (planning only)

These requirements are being outlined now; they do not authorize P1 implementation or replace the P0 launch foundation. P1 workflows depend on the catalog, customer, order, inventory, payment, and delivery records being available and reliable.

| Module | Initial scope | Depends on | Decisions still needed |
|---|---|---|---|
| Returns and refunds | Let a customer request a return for an eligible order item; let authorized staff review the request, record its outcome, track returned goods, and link any refund to its original order/payment. Keep a traceable status history. | Customer accounts, order-item snapshots, delivery/order status, inventory, payment records | Return window and conditions; eligible categories/items; who pays return delivery; inspection and refund timelines; partial returns |
| Coupons and promotions | Let authorized staff create, schedule, enable/disable, and review promotions. Validate eligibility and discount server-side when pricing a cart and placing an order; show the applied discount in the order price breakdown. | Product/category catalog, cart, checkout, orders, tax and price calculation | Fixed vs percentage discounts; eligible products; minimum spend; caps; usage limits; stacking; sale exclusions; tax treatment |
| Reviews and ratings | Let customers submit a product rating and review; provide staff moderation and a customer-facing rating summary. Associate each review with its product and author. | Customer accounts, catalog, orders for purchase verification | Whether only verified buyers may review; moderation rules; rating scale; edit/delete policy; incentives and reporting |
| Notifications | Send event-triggered transactional messages for account and order events through approved channels; record delivery/failure state and avoid duplicate messages on retries. | Authentication, orders, payments, delivery status, chosen messaging providers | Channels (email/SMS/WhatsApp), provider, languages, templates, customer preferences, event list and retry policy |
| Analytics and reports | Provide permission-controlled operational views for orders, sales, refunds, coupons, and stock, with date/status filters and export where approved. Define metrics consistently and avoid exposing unnecessary personal data. | Orders, payments, inventory, refunds, coupons, RBAC | Metric definitions, date/time basis, export format, access roles, retention, and reporting cadence |
| CMS and SEO | Let authorized staff manage approved storefront content and metadata; support editable page title/description, preview/publish workflow, and crawl-friendly public pages. | Storefront routes, catalog/category content, staff access | Which pages are editable; publishing permissions; redirects; structured-data scope; SEO ownership and review process |

#### P1 planning acceptance criteria

- [ ] Each module's launch scope and exclusions approved.
- [ ] Business rules listed in the decisions column resolved or explicitly deferred.
- [ ] Dependencies on P0 data and workflows confirmed; no P1 delivery is scheduled ahead of its required P0 foundation.
- [ ] Role permissions and customer-facing behaviors approved for each module.
- [ ] Acceptance tests and operational ownership agreed before implementation.

## 4. Technical architecture — planning baseline approved

The client approved this core stack as the Phase 01 planning baseline. Provider-specific and deployment decisions are still open; baseline approval does not authorize implementation choices for those pending items.

| Layer | Proposal | Purpose / decision note |
|---|---|---|
| Web | Next.js with React | Storefront and admin UI; supports server rendering and SEO needs |
| API | Node.js with NestJS, REST | Modular business API with validation and clear service boundaries |
| Database | PostgreSQL | Transactional catalog, customer, order, and inventory data |
| Cache / ephemeral state | Redis, if justified by session, queue, or performance needs | Avoid making it mandatory until session and traffic requirements are known |
| Authentication | Secure server-managed session or carefully managed token flow | Select after client/admin UX and deployment topology are confirmed |
| Product media | S3-compatible object storage | Store and serve product images separately from application data |
| Payments | Razorpay or Cashfree, subject to business approval | Gateway selection, COD, and settlement process remain open |
| Email / notifications | Transactional provider to be selected | Order and account notifications |
| Hosting | Production cloud hosting to be selected | Region, operations, backup, and budget requirements need confirmation |
| Source control | GitHub | Code review, version history, and deployment workflows |

Recommended deployment shape is a modular monolith (web app plus a well-structured API and managed PostgreSQL), rather than premature microservices. Separate deployable frontend and backend applications can still share one repository. Hosting, scaling, and service boundaries still need validation against expected traffic, team operations, and budget.

## 5. Data model outline

The initial conceptual entities are:

`users`, `roles`, `permissions`, role/user permission assignments, `addresses`, `categories`, `brands`, `products`, `product_variants`, `product_images`, `inventory`, `carts`, `cart_items`, `wishlists`, `orders`, `order_items`, `payments`, `shipments`, `coupons`, `reviews`, `returns`, `refunds`, `notifications`, `support_tickets`, `audit_logs`, and `settings`.

Before schema approval, validate these important details:

- Product and variant attributes against the confirmed golf assortment and actual SKU list.
- Order-item snapshots for product name, SKU, price, tax, and applicable variant at purchase time.
- Inventory adjustments/reservations and a stock movement history; prevent overselling during concurrent checkout.
- Delivery assignments, permitted status transitions, and delivery event history for the own delivery team.
- Payment event/idempotency records so retries and duplicate gateway callbacks cannot create duplicate orders or captures.
- Return/refund state and references to the original order/payment.
- Role assignments and audit events for privileged staff actions.
- Retention and access rules for customer and payment-related data.

This is a planning model, not a finalized migration/schema.

## 6. Repository / folder proposal

```text
ecommerce-platform/
├── frontend/
│   ├── app/                 # store, account, checkout, and admin routes
│   ├── components/
│   ├── services/
│   ├── hooks/
│   ├── styles/
│   └── public/
├── backend/
│   ├── src/                 # auth, users, catalog, inventory, cart, orders, payments, shipping
│   └── tests/
├── database/
│   ├── migrations/
│   └── seeds/
├── documentation/
│   ├── architecture/
│   ├── api/
│   ├── database/
│   └── testing/
└── README.md
```

Keep module ownership clear and validate the repository layout against the chosen framework/tooling before implementation.

## 7. Security and quality requirements

- Secure password hashing, account/session protections, secure cookies, and HTTPS.
- Server-side authorization for every staff action; least-privilege RBAC.
- Request validation, rate limiting, and safe error handling.
- Defenses against CSRF, XSS, and injection using framework protections, parameterized database access, output encoding, and appropriate security headers.
- Verify payment signatures/webhooks server-side; make payment/order processing idempotent.
- Recheck and reserve stock safely during checkout.
- Do not store raw card data; use the gateway's compliant payment flow.
- Centralized error logging, monitoring/alerts, and audit trails for sensitive admin operations.
- Encrypted backups, recovery procedures, and tested restore process.
- Automated tests for checkout, permissions, payment callbacks, stock races, and order/return state transitions.

## 8. India business and operations

Plan for INR, Indian addresses and PIN codes, applicable GST/invoice requirements, own-team delivery charges and estimates, payment reconciliation, privacy/terms pages, and a documented cancellation/return/refund policy. UPI, cards, net banking, and COD are candidate payment methods, subject to gateway support and business policy. Delivery service areas and operational capacity still need confirmation.

Do not treat GST treatment, legal wording, shipping coverage, or COD availability as settled requirements until verified with the client and appropriate business/tax advisors.

## 9. Delivery roadmap

1. **Complete Phase 01:** Resolve open business decisions; approve scope, roles, pages/modules, data model, stack, deployment assumptions, and acceptance criteria.
2. **Phase 02 — UI/UX:** Approve client branding, design system, storefront journeys, admin workflows, and responsive states. Do not mark complete without approval.
3. **Foundation:** Repository/app setup, environments, database migrations, CI checks, authentication, RBAC, and observability.
4. **Catalog and storefront:** Catalog/admin tools, images, search/navigation, product pages, and customer account basics.
5. **Commerce core:** Cart, checkout, inventory reservation, payment integration, order lifecycle, and notifications.
6. **Operations and launch readiness:** Shipping, support, security/performance checks, backups, UAT, and production rollout.
7. **P1 modules:** After the P0 order/catalog foundation is stable, implement approved returns/refunds, promotions, reviews, notifications, reporting, and CMS/SEO requirements in dependency order.

Each implementation milestone should have reviewed requirements, acceptance tests, and an explicit client sign-off before its completion is claimed.

## 10. Phase 01 acceptance criteria

Phase 01 is complete only when all items below are reviewed and approved:

- [x] Single-vendor model and product groups confirmed: golf balls, apparel, footwear, bags, and accessories.
- [ ] Exact product assortment/SKUs, variant rules, in-scope/out-of-scope features, and launch priorities approved.
- [x] Delivery model confirmed: own delivery team.
- [x] Staff/customer role list approved.
- [ ] Role-to-permission matrix and access boundaries approved.
- [ ] Required storefront and admin pages and workflows.
- [x] Core technology stack approved as a planning baseline.
- [ ] Hosting, deployment details, and operational constraints approved.
- [ ] Database entities and key transaction/inventory rules.
- [ ] Repository/folder architecture.
- [ ] Security, privacy, quality, and backup requirements.
- [ ] India-specific payment, GST/invoice, shipping, and return/refund requirements.
- [ ] Development roadmap and measurable acceptance criteria.

## 11. Open client decisions

| Decision | Current status | Needed to close |
|---|---|---|
| Golf assortment | Confirmed: golf balls, apparel, footwear, bags, and accessories | Confirm SKU list, product specifications, and variant rules |
| Delivery / fulfillment | Own delivery team confirmed | Confirm service areas, capacity, delivery charges/estimates, tracking, and proof-of-delivery needs |
| User roles | Super Admin, Admin, Product Manager, Order Manager, Customer Support, Delivery Staff, Customer approved as the planning baseline | Approve role-to-permission matrix and access boundaries |
| Core technology stack | Approved as planning baseline: Next.js/React, NestJS REST, PostgreSQL; Redis if justified | Validate deployment constraints; choose hosting and service providers |
| Client brand name and assets | Not decided | Brand name, logo, existing brand guidelines, and domain preference |
| Payment gateway and COD | Not decided | Gateway preference, enabled methods, COD policy, and reconciliation owner |
| Shipping provider and rules | Not decided | Provider, PIN-code coverage, charges, delivery estimates, and return pickup |
| GST and invoices | Requires business verification | GST configuration, invoice fields, and tax advisor confirmation |
| Returns/refunds | Not decided | Eligibility window, conditions, refund timing, and exception handling |
| P1 module rules | Initial requirements drafted; not approved | Confirm each module's scope and resolve the decisions listed in the P1 requirements table |
| Reviews policy | Not decided | Verified-purchase rule, moderation, rating scale, and edit/report policy |
| Promotions policy | Not decided | Discount types, stacking, eligibility, caps, usage limits, and tax handling |
| Notification channels | Not decided | Approved channels, providers, languages, message templates, and retry policy |
| Reports and CMS governance | Not decided | Metric definitions, report access/export, editable pages, and publishing permissions |
| Catalog operations | Not decided | Who supplies product copy, images, prices, and stock updates |
| Hosting, budget, and operations | Not decided | Hosting preference, expected traffic, budget, support/monitoring ownership |

**Current outcome:** Phase 01 planning is in progress. The core stack is approved as a planning baseline, but the full plan and P1 requirements are not yet approved. P0 technical foundation work has started with a local starter skeleton and a generic, empty product-catalog schema/read API. Type-checks, API unit tests, catalog integration tests against embedded PostgreSQL, and workspace builds have passed; live PostgreSQL migration-runner and deployment checks remain outstanding. No product data is seeded. P1 work is requirements planning only; implementation follows the P0 foundation and explicit approval. Phase 02 must not be marked complete or started as an approved phase until Phase 01 acceptance criteria are signed off.
