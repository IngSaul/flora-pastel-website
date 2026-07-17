# Contract: WhatsApp Call-to-Action Link

The interface between a rendered catalog product and the WhatsApp conversation it opens (spec FR-010, FR-011).

## Link format

```text
https://wa.me/<whatsapp-number>?text=<url-encoded message>
```

- `<whatsapp-number>` — the business's WhatsApp number in international format with no punctuation, sourced from `cliente/datos.md` (`whatsapp: 3319027014` → `523319027014` with the Mexico country code applied).
- `<url-encoded message>` — plain-text message, percent-encoded, built at build time from product data (never hand-typed per product).

## Message template

**Standard product** (no specific presentation selected, or product has a single presentation):

```text
Hola, me interesa el producto "{{product.name}}" que vi en su catálogo.
```

**Product with a presentation in context** (e.g., visitor is viewing/selecting a specific size):

```text
Hola, me interesa el producto "{{product.name}}" ({{presentation.label}}) que vi en su catálogo.
```

**Sobre Pedido product** — message additionally surfaces the lead time so the conversation starts with the right expectation (spec User Story 3):

```text
Hola, me interesa el producto "{{product.name}}" que vi en su catálogo. Entiendo que es sobre pedido.
```

## Guarantees

- The product name in the message is always sourced from `Product.name` (the same field rendered on the page) — never a separately maintained string, so the two cannot drift out of sync (Constitution III: no duplicated business logic).
- The link is a plain anchor `href` computed at build time — functions with JavaScript disabled (FR-013) and on any device with the WhatsApp app or WhatsApp Web installed/accessible (inherited fallback behavior from `specs/001-flora-pastel-website/spec.md`'s Edge Cases).

## Non-goals

- This contract does not cover cart contents, quantities, or order totals — the catalog has no cart (FR-014). Each CTA identifies exactly one product (and optionally one presentation), never a multi-item summary.
