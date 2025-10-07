# Nike Products Discord Bot

A Discord bot that provides real-time Nike product information and checkout links. Built with Discord.js, this bot allows users to quickly lookup product details and generate direct checkout URLs for Nike sneakers and apparel across multiple regions.

## Features

- **Product Lookup** (`!nike`): Fetch detailed product information including availability, pricing, and sizes for any Nike SKU across different countries
- **Quick Checkout** (`!checkout`): Generate direct checkout URLs for specific product SKUs, sizes, and regions (sent via DM for privacy)
- **Multi-Region Support**: Query products across different Nike regional stores using country codes
- **Batch Queries**: Look up multiple SKUs and countries in a single command

## Commands

### Product Lookup

```
!nike [SKU(s)] [COUNTRY_CODE(s)]
```

Retrieves product information for specified SKU(s) and country/countries.

**Examples:**

- `!nike DV3853-101 US` - Single product in US
- `!nike DV3853-101 US GB FR` - Single product in multiple countries
- `!nike DV3853-101 FD0774-001 US` - Multiple products in US

### Checkout URL Generator

```
!checkout [SKU] [COUNTRY_CODE] [SIZE(s)]
```

Generates direct checkout links for the specified product and size(s). Links are sent via DM for privacy.

**Examples:**

- `!checkout DV3853-101 US 10` - Single size
- `!checkout DV3853-101 US 10,10.5,11` - Multiple sizes (comma-separated)

## Use Cases

Perfect for:

- 👟 Sneaker enthusiasts tracking releases
- 🛒 Resellers needing quick product information
- 💎 Collectors monitoring availability across regions
- 🌍 International buyers comparing regional stock
