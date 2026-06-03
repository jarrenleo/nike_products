# Nike Products Discord Bot

A Discord bot for looking up Nike product information and generating SNKRS checkout URLs across multiple regions.

## Setup

**Requirements:** Node.js

1. Clone the repo and install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root with your Discord bot token:
   ```
   DISCORD_TOKEN=your_token_here
   ```

3. Start the bot:
   ```
   npm start        # production
   npm run dev      # development (auto-restart)
   ```

## Commands

### `!nike [SKU(s)] [COUNTRY(s)]`

Fetches product details including status, price, launch date, method, colourway, sizes with stock levels, and links to resale platforms.

```
!nike DV3853-101 US
!nike DV3853-101 US GB FR
!nike DV3853-101 FD0774-001 US
```

### `!checkout [SKU] [COUNTRY] [SIZE(s)]`

Generates direct SNKRS checkout URLs for upcoming launch products. Results are sent via DM. Only works for SNKRS products with an active launch.

```
!checkout DV3853-101 US 10
!checkout DV3853-101 US 10,10.5,11
```

Sizes must be comma-separated with no spaces.

## Supported Countries

AU, AT, AE, BE, BG, CA, CH, CZ, DE, DK, ES, FI, FR, GB, GR, HR, HU, ID, IE, IL, IN, IT, JP, KR, LU, MX, MY, NL, NO, NZ, PH, PL, PT, RO, SA, SE, SG, SI, SK, TH, TR, TW, US, ZA
