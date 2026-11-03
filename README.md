# Aurora — Shopify Online Store 2.0 Theme

A clean, fast, starter Shopify theme built with the Online Store 2.0 architecture
(JSON templates, section groups, and app blocks support).

## Structure

```
aurora/
├── assets/
│   ├── base.css            # Design tokens + all component styles
│   └── theme.js            # Cart drawer, mobile nav, AJAX add-to-cart, variants
├── config/
│   ├── settings_schema.json# Theme editor global settings (colors, typography, logo)
│   └── settings_data.json  # Default setting values
├── layout/
│   └── theme.liquid        # Root layout: head, header/footer groups, main content
├── locales/
│   └── en.default.json     # Translation strings
├── sections/
│   ├── header-group.json   # Header section group (announcement bar + header)
│   ├── footer-group.json   # Footer section group
│   ├── announcement-bar.liquid
│   ├── header.liquid       # Sticky header, logo, nav, search/account/cart icons
│   ├── footer.liquid       # Block-based footer (menus, text, social, newsletter)
│   ├── image-banner.liquid # Hero with heading/subheading/CTA
│   ├── featured-collection.liquid
│   ├── rich-text.liquid
│   └── newsletter.liquid
├── snippets/
│   ├── product-card.liquid # Reusable card w/ sale & sold-out badges
│   ├── price.liquid        # Regular/sale/unit pricing
│   ├── cart-drawer.liquid  # Slide-out mini cart
│   └── meta-social.liquid  # Open Graph / Twitter cards
└── templates/
    ├── index.json          # Homepage (banner → featured → rich text → newsletter)
    ├── product.liquid      # PDP with variant select, dynamic checkout, related items
    ├── collection.liquid   # PLP with sorting + pagination
    ├── cart.liquid         # Full cart page with notes & discounts
    ├── blog.liquid, article.liquid
    ├── page.liquid, search.liquid, 404.liquid
```

## Development

Requires [Shopify CLI](https://shopify.dev/docs/api/shopify-cli) v3+:

```bash
shopify theme dev --store your-store.myshopify.com   # local preview at http://127.0.0.1:9292
shopify theme push                                    # deploy to a theme on your store
shopify theme check                                   # lint Liquid/JSON/schema
```

Or upload the folder directly via **Admin → Online Store → Themes → Add theme → Upload zip**.

## Notes / extension ideas

- Color schemes (`color-scheme-1..3`) are simple CSS-class based; wire them to
  `settings_schema.json` color pickers via CSS variables in `theme.liquid` if desired.
- The cart drawer currently reloads after AJAX mutations for simplicity; replace with
  section rendering (`?sections=header`) for a fully seamless experience.
- Add `"presets"` entries with `blocks`/`settings` to create more section types.
- App block support: add `{% content_for 'blocks' %}` inside any section that should accept apps.
