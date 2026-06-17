---
name: marketplace-lister
description: Create and optimize product listings across multiple marketplaces with SEO-optimized titles, descriptions, and attributes
allowed-tools: [Read, Write, Bash, Grep]
effort: medium
---

## When to activate

- Creating new product listings for Amazon, eBay, or other marketplaces
- Optimizing existing listings for search visibility
- Bulk-uploading products via CSV/flat file templates
- Ensuring listing compliance with marketplace policies
- A/B testing product titles and images

## When NOT to use

- For D2C storefront product pages (use product-description-writer)
- For marketplace advertising campaigns
- For order fulfillment operations

## Instructions

1. **Research marketplace requirements.** Document required fields, character limits, image specs, and category trees.
2. **Build listing template.** Map product data to marketplace fields: title, bullet points, description, backend keywords, attributes.
3. **Optimize titles.** Include brand, product type, key feature, size/quantity — stay within character limits.
4. **Write bullet points.** 5 bullets highlighting benefits, specs, compatibility, and differentiators.
5. **Generate backend keywords.** Extract search terms not in title; avoid brand names, duplicates, and subjective claims.
6. **Validate compliance.** Check restricted categories, prohibited claims, required certifications (CE, FCC, etc.).
7. **Export upload file.** Format as marketplace-specific CSV/flat file with all required columns populated.

## Example

```
Marketplace: Amazon US
Title (200 char max): "BrandX Premium Stainless Steel Water Bottle - 32oz Insulated, BPA-Free, Double-Wall Vacuum, Keeps Drinks Cold 24h Hot 12h - Leak Proof Lid - Ocean Blue"
Bullets:
1. KEEPS DRINKS AT PERFECT TEMPERATURE — Double-wall vacuum insulation...
2. PREMIUM 18/8 STAINLESS STEEL — Food-grade, rust-proof, no metallic taste...
```
