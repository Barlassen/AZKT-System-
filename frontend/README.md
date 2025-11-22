# AZKT Frontend

User-facing mobile/web application for anonymous ticket purchase.

## Features

- Ephemeral key pair generation
- Ticket selection and purchase
- QR code display
- Anonymous payment integration
- Ticket management

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- QR Code generation
- TweetNaCl for cryptography

## Development

```bash
npm install
npm run dev
```

## Key Components

- `WalletManager` - Ephemeral key pair generation
- `TicketSelector` - Route and time selection
- `QRDisplay` - Ticket QR code display
- `PaymentHandler` - Anonymous payment processing

