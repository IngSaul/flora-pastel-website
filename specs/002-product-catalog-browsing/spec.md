# Feature Specification: Product Catalog Browsing

**Feature Branch**: `002-product-catalog-browsing`

**Created**: 2026-07-14

**Status**: Draft

**Input**: User description: "Product/catalog browsing — a feature for how visitors browse the Flora Pastel product catalog, view product details, and filter/find products by category."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse the full catalog by category (Priority: P1)

A visitor (a parent planning a celebration, a family looking for a dessert, a corporate buyer) opens the product catalog and browses through the business's categories — Cheesecakes, Gelatinas, Panqués, Pasteles, Postres, and Sobre Pedido — to find something that fits their occasion, without having to already know a product's name.

**Why this priority**: Browsing by category is the primary way a visitor with no fixed idea discovers what Flora Pastel offers. It is the foundation every other catalog interaction (viewing details, comparing sizes, contacting via WhatsApp) builds on.

**Independent Test**: Can be fully tested by opening the catalog, moving between category groupings, and confirming every product that belongs to a category (per the business's product list) appears under it — delivers standalone value even before presentation comparison or WhatsApp inquiry is exercised.

**Acceptance Scenarios**:

1. **Given** a visitor opens the product catalog, **When** the catalog loads, **Then** products are visibly grouped under their category (Cheesecakes, Gelatinas, Panqués, Pasteles, Postres, Sobre Pedido).
2. **Given** a visitor wants to see only one category, **When** they select or navigate to that category, **Then** they can view its products without having to scroll through unrelated categories first.
3. **Given** a visitor is browsing a category, **When** they view a product entry, **Then** they see its name, a photograph, and a short description.

---

### User Story 2 - Compare presentations and prices before deciding (Priority: P2)

A visitor has found a product they like and wants to know what sizes are available and how much each costs (e.g., a whole cheesecake for a party vs. an individual portion) before reaching out to place an order.

**Why this priority**: Most products come in multiple sizes/presentations at different prices; without this information visible, every visitor would have to ask the business directly, defeating the purpose of a self-serve catalog and creating friction before the WhatsApp conversation even starts.

**Independent Test**: Can be fully tested by opening any product with more than one presentation and confirming each presentation's size/portion description and price are visible side by side — independent of category browsing or the WhatsApp flow.

**Acceptance Scenarios**:

1. **Given** a product has multiple presentations (e.g., Grande, Mediano, Individual), **When** a visitor views that product, **Then** they see each presentation's size/portion description and price listed separately.
2. **Given** a product has only one presentation, **When** a visitor views that product, **Then** they see that single size and price without misleading implication of other options.
3. **Given** a visitor has decided on a product and presentation, **When** they use the product's WhatsApp call-to-action, **Then** the pre-filled message identifies the specific product (and presentation, where selected).

---

### User Story 3 - Recognize made-to-order products and their lead time (Priority: P3)

A visitor browsing the catalog encounters a "Sobre Pedido" (made-to-order) product and needs to understand, before contacting the business, that this item requires advance notice rather than being available immediately.

**Why this priority**: Setting the right expectation up front avoids disappointment and last-minute WhatsApp back-and-forth for time-sensitive occasions (e.g., a same-day birthday), protecting trust in the brand even though it affects a smaller subset of products.

**Independent Test**: Can be fully tested by locating any product in the Sobre Pedido category and confirming the required advance-notice period is visibly stated on that product, independent of the rest of the catalog.

**Acceptance Scenarios**:

1. **Given** a visitor views a product in the Sobre Pedido category, **When** the product entry renders, **Then** a clearly visible note states the minimum advance notice required (e.g., "disponible bajo pedido, con 3 días de anticipación").
2. **Given** a visitor is browsing categories generally, **When** they reach the Sobre Pedido category, **Then** the category itself is labeled to indicate these are made-to-order items, not immediately available stock.

---

### Edge Cases

- What happens when a product has only a single presentation (e.g., "Rosca de Naranja" only offers one "Rosca" size)? The catalog must present it plainly, without an empty or confusing size-comparison layout.
- What happens when a category contains only a couple of products (e.g., Postres, Gelatinas)? The category must still render correctly without layout gaps designed for larger sets.
- How does the catalog behave with JavaScript disabled or a script failing to load? Every product's name, description, category, presentations, prices, and WhatsApp contact information must remain visible and readable, consistent with the site's static, non-JS-dependent nature.
- How does the catalog behave on a slow mobile connection with many product photographs to load? Images must load progressively so product names, descriptions, and prices are usable before every photograph finishes loading.
- What happens when a visitor wants to inquire about a Sobre Pedido product? The WhatsApp pre-filled message and/or nearby text must reflect the advance-notice requirement so the conversation starts with the right expectation.
- How does the catalog read on very small and very large screens? Category groupings, product entries, and presentation/price listings must remain legible and free of overlapping content across the full supported device width range.

## Requirements *(mandatory)*

### Functional Requirements

**Catalog structure & browsing**

- **FR-001**: The catalog MUST group all products under their business-defined category: Cheesecakes, Gelatinas, Panqués, Pasteles, Postres, and Sobre Pedido.
- **FR-002**: The catalog MUST let a visitor move directly to a single category of interest without requiring them to scroll past every other category first.
- **FR-003**: The catalog MUST display every product currently defined in the business's product list; no category or product may be silently omitted.

**Product detail**

- **FR-004**: Each product entry MUST display the product's name, at least one photograph, a description, and its category.
- **FR-005**: Each product entry MUST display all of its presentations (size/portion label and price), so a visitor can compare options for that product without contacting the business.
- **FR-006**: Presentation labels MUST reflect the unit that makes sense for the product (e.g., portions, milliliters/liters, slices), matching how the business itself describes each size.
- **FR-007**: Prices MUST be displayed per presentation in Mexican pesos, clearly associated with the specific size/portion they describe.

**Made-to-order (Sobre Pedido)**

- **FR-008**: Every product in the Sobre Pedido category MUST display the minimum advance-notice period required before it can be ordered.
- **FR-009**: The Sobre Pedido category MUST be visually or textually distinguished from immediately-available categories so visitors understand the lead-time expectation before selecting a product from it.

**Contact & conversion**

- **FR-010**: Each product entry MUST provide a way to inquire about that specific product via WhatsApp.
- **FR-011**: The WhatsApp call-to-action for a product MUST pre-fill a message that identifies the product by name, where technically feasible.

**Performance & resilience**

- **FR-012**: Product photographs MUST be optimized and loaded progressively (e.g., lazy loading) so catalog browsing remains fast on mobile connections.
- **FR-013**: All catalog content (product names, descriptions, categories, presentations, prices, and made-to-order notices) MUST remain visible and usable if JavaScript fails to load or execute.
- **FR-014**: The catalog MUST NOT support cart, checkout, payment, or order-status functionality; all ordering continues through a WhatsApp conversation initiated from a product entry.

### Key Entities

- **Product**: A catalog item; represented by a name, category, description, one or more photographs, and one or more presentations. Belongs to exactly one category.
- **Presentation**: A specific size/portion option for a product; represented by a size or portion label (e.g., "Grande · 12 porciones", "Individual · 355 ml") and a price in Mexican pesos.
- **Category**: A grouping of products sharing a product type (Cheesecakes, Gelatinas, Panqués, Pasteles, Postres, Sobre Pedido). The Sobre Pedido category additionally carries a minimum advance-notice period that applies to its products.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A visitor can navigate from the catalog entry point to any specific category in 2 interactions or fewer.
- **SC-002**: 100% of products display every presentation's size/portion label and price without requiring visitor interaction beyond viewing the product.
- **SC-003**: 100% of Sobre Pedido products visibly state their required advance-notice period.
- **SC-004**: All catalog content (product names, descriptions, prices, made-to-order notices) remains visible and readable with JavaScript disabled.
- **SC-005**: In usability testing, at least 90% of participants can find a specific product they are looking for within 3 interactions from the catalog entry point.
- **SC-006**: In usability testing, at least 90% of participants correctly identify, after viewing a Sobre Pedido product, that it requires advance notice rather than being immediately available.
- **SC-007**: The catalog's primary content (product names, first-visible category) is visible in under 2.5 seconds on a simulated mid-range mobile device.

## Assumptions

- This feature refines and supersedes the simplified two-gallery product model ("Signature Cakes" and "Custom Cakes" photo galleries) described in the existing site-wide specification, replacing it with the business's actual multi-category catalog (Cheesecakes, Gelatinas, Panqués, Pasteles, Postres, Sobre Pedido) as documented in the business's product list.
- The catalog is presented within the site's existing page structure (e.g., as a dedicated catalog page or section with category navigation), not as one dedicated page per individual product; this keeps the site static and consistent with its overall page-count scope.
- Requesting a fully bespoke/custom-designed cake (as opposed to selecting a standing menu item) remains a separate concern from this catalog, handled by the site's existing custom-request flow; this feature covers browsing and inquiring about the standing product catalog, including Sobre Pedido items.
- All products in the business's product list are assumed to be currently available for order (subject to the Sobre Pedido lead time where applicable); the catalog does not track seasonal availability, stock, or discontinued items, consistent with the site's no-inventory-management scope.
- Prices shown reflect the business's current listed pricing; final price confirmation for any order still occurs via WhatsApp, consistent with the site's existing pricing approach.
- No search or keyword-filtering capability is assumed beyond category-based navigation, consistent with a small, human-scale catalog (fewer than 30 products) where category browsing is sufficient for discovery.
